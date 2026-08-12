import {
  default as request,
  createRequest,
  sendFormRequest
} from '../utils/request.js'
import UploadSpeedometer from '../utils/UploadSpeedometer.js'

export default class ChunkUploadHandler {
  /**
   * Constructor
   *
   * @param {File} file
   * @param {Object} options
   */
  constructor(file, options) {
    this.file = file
    this.options = options
    this.chunks = []
    this.sessionId = null
    this.chunkSize = null
    this.speedometer = null
    this.lastTransferSpeed = 0
    this.finishing = false
    this.settled = false
    this.paused = false
    this.resuming = false
  }

  /**
   * Gets the max retries from options
   */
  get maxRetries() {
    const value = parseInt(this.options.maxRetries, 10)
    return Number.isFinite(value) && value >= 0 ? value : 0
  }

  /**
   * Gets the max number of active chunks being uploaded at once from options
   */
  get maxActiveChunks() {
    const value = parseInt(this.options.maxActive, 10)
    return Number.isFinite(value) && value > 0 ? value : 1
  }

  /**
   * Gets the file type
   */
  get fileType() {
    return this.file.type
  }

  /**
   * Gets the file size
   */
  get fileSize() {
    return this.file.size
  }

  /**
   * Gets the file name
   */
  get fileName() {
    return this.file.name
  }

  /**
   * Gets action (url) to upload the file
   */
  get action() {
    return this.options.action || null
  }

  /**
   * Gets the body to be merged when sending the request in start phase
   */
  get startBody() {
    return this.options.startBody || {}
  }

  /**
   * Gets the body to be merged when sending the request in upload phase
   */
  get uploadBody() {
    return this.options.uploadBody || {}
  }

  /**
   * Gets the body to be merged when sending the request in finish phase
   */
  get finishBody() {
    return this.options.finishBody || {}
  }

  /**
   * Gets the headers of the requests from options
   */
  get headers() {
    return this.options.headers || {}
  }

  /**
   * Whether it's ready to upload files or not
   */
  get readyToUpload() {
    return this.chunks.length > 0
  }

  /**
   * Gets the progress of the chunk upload
   * - Gets all the completed chunks
   * - Gets the progress of all the chunks that are being uploaded
   */
  get progress() {
    if (!this.chunks.length || !this.fileSize) {
      return 0
    }
    const uploadedBytes = this.chunks.reduce((bytes, chunk) => {
      if (chunk.uploaded) {
        return bytes + chunk.blob.size
      }
      return chunk.active ? bytes + Math.min(chunk.loaded || 0, chunk.blob.size) : bytes
    }, 0)
    return Math.min((uploadedBytes / this.fileSize) * 100, 100)
  }

  /**
   * Gets all the chunks that are pending to be uploaded
   */
  get chunksToUpload() {
    return this.chunks.filter(chunk => {
      return !chunk.active && !chunk.uploaded
    })
  }

  /**
   * Whether there are chunks to upload or not
   */
  get hasChunksToUpload() {
    return this.chunksToUpload.length > 0
  }

  /**
   * Gets all the chunks that are uploading
   */
  get chunksUploading() {
    return this.chunks.filter(chunk => {
      return !!chunk.xhr && !!chunk.active
    })
  }

  /**
   * Gets all the chunks that have finished uploading
   */
  get chunksUploaded() {
    return this.chunks.filter(chunk => {
      return !!chunk.uploaded
    })
  }

  /**
   * Creates all the chunks in the initial state
   */
  createChunks() {
    this.chunks = []

    let start = 0
    let end = this.chunkSize
    while (start < this.fileSize) {
      this.chunks.push({
        blob: this.file.file.slice(start, end),
        startOffset: start,
        active: false,
        loaded: 0,
        transferred: 0,
        retries: this.maxRetries
      })
      start = end
      end = start + this.chunkSize
    }
  }

  /**
   * Updates the progress of the file with the handler's progress
   */
  updateFileProgress() {
    this.file.progress = this.progress
  }

  /**
   * Paues the upload process
   * - Stops all active requests
   * - Sets the file not active
   */
  pause() {
    this.paused = true
    const file = this.options.onPause?.(this.file)
    if (file) {
      this.file = file
    } else {
      this.file.active = false
    }
    this.stopChunks()
  }

  /**
   * Stops all the current chunks
   */
  stopChunks() {
    this.chunksUploading.forEach(chunk => {
      chunk.xhr.abort()
      chunk.active = false
    })

    this.stopSpeedCalc()
  }

  /**
   * Resumes the file upload
   * - Sets the file active
   * - Starts the following chunks
   */
  resume() {
    if (this.settled) {
      return
    }
    this.resuming = true
    this.paused = false
    const file = this.options.onResume?.(this.file)
    if (file) {
      this.file = file
    } else {
      this.file.active = true
    }
    this.resuming = false
    this.startChunking()
  }

  /**
   * Starts the file upload
   *
   * @returns Promise
   * - resolve  The file was uploaded
   * - reject   The file upload failed
   */
  upload() {
    if (this.promise) {
      return this.promise
    }
    this.promise = new Promise((resolve, reject) => {
      this.resolve = value => {
        if (this.settled) {
          return
        }
        this.settled = true
        this.stopSpeedCalc()
        resolve(value)
      }
      this.reject = error => {
        if (this.settled) {
          return
        }
        this.settled = true
        this.stopChunks()
        reject(error)
      }
    })
    try {
      this.start()
    } catch (error) {
      this.reject(error)
    }

    return this.promise
  }

  /**
   * Start phase
   * Sends a request to the backend to initialise the chunks
   */
  start() {
    if (!this.action) {
      return this.reject('action')
    }

    request({
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json'},
      url: this.action,
      body: {
        ...this.startBody,
        phase: 'start',
        mime_type: this.fileType,
        size: this.fileSize,
        name: this.fileName
      }
    }).then(res => {
      if (this.settled) {
        return
      }
      if (res.status !== 'success') {
        this.file.response = res
        return this.reject('server')
      }

      const chunkSize = Number(res.data?.end_offset)
      const sessionId = res.data?.session_id
      if (!Number.isFinite(chunkSize) || chunkSize <= 0 || sessionId === null || sessionId === undefined || sessionId === '') {
        this.file.response = res
        return this.reject('server')
      }

      this.sessionId = sessionId
      this.chunkSize = chunkSize

      this.createChunks()
      if (this.file.active) {
        this.startChunking()
      }
    }).catch(res => {
      if (this.settled) {
        return
      }
      this.file.response = res
      this.reject('server')
    })
  }

  /**
   * Starts to upload chunks
   */
  startChunking() {
    if (this.settled || !this.file.active || !this.readyToUpload) {
      return
    }
    this.startSpeedCalc()
    for (let i = 0; i < this.maxActiveChunks; i++) {
      this.uploadNextChunk()
    }
  }

  /**
   * Uploads the next chunk
   * - Won't do anything if the process is paused
   * - Will start finish phase if there are no more chunks to upload
   */
  uploadNextChunk() {
    if (!this.settled && !this.finishing && this.file.active) {
      if (this.hasChunksToUpload) {
        return this.uploadChunk(this.chunksToUpload[0])
      }

      if (this.chunksUploading.length === 0) {
        return this.finish()
      }
    }
  }

  /**
   * Uploads a chunk
   * - Sends the chunk to the backend
   * - Sets the chunk as uploaded if everything went well
   * - Decreases the number of retries if anything went wrong
   * - Fails if there are no more retries
   *
   * @param {Object} chunk
   */
  uploadChunk(chunk) {
    chunk.progress = 0
    chunk.loaded = 0
    chunk.transferred = 0
    chunk.active = true
    this.updateFileProgress()
    try {
      chunk.xhr = createRequest({
        method: 'POST',
        headers: this.headers,
        url: this.action
      })
    } catch (error) {
      chunk.active = false
      this.reject(error)
      return
    }

    chunk.xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const transferred = Math.max(0, evt.loaded - chunk.transferred)
        chunk.transferred = evt.loaded
        chunk.loaded = evt.total > 0 ? Math.min(chunk.blob.size, (evt.loaded / evt.total) * chunk.blob.size) : 0
        chunk.progress = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
        this.updateSpeed(transferred)
        this.updateFileProgress()
      }
    }, false)
    chunk.xhr.upload.addEventListener('loadstart', () => {
      this.speedometer?.start()
    }, false)

    sendFormRequest(chunk.xhr, {
      ...this.uploadBody,
      phase: 'upload',
      session_id: this.sessionId,
      start_offset: chunk.startOffset,
      chunk: chunk.blob
    }).then(res => {
      chunk.active = false
      if (this.settled) {
        return
      }
      if (res.status === 'success') {
        chunk.uploaded = true
      } else {
        if (chunk.retries-- <= 0) {
          this.stopChunks()
          return this.reject('upload')
        }
      }

      this.uploadNextChunk()
    }).catch(() => {
      chunk.active = false
      if (this.settled || !this.file.active) {
        return
      }
      if (chunk.retries-- <= 0) {
        this.stopChunks()
        return this.reject('upload')
      }

      this.uploadNextChunk()
    })
  }

  /**
   * Finish phase
   * Sends a request to the backend to finish the process
   */
  finish() {
    if (this.settled || this.finishing || !this.file.active) {
      return
    }
    this.finishing = true
    this.updateFileProgress()
    this.stopSpeedCalc()

    let finishRequest
    try {
      finishRequest = request({
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        url: this.action,
        body: {
          ...this.finishBody,
          phase: 'finish',
          session_id: this.sessionId
        }
      })
    } catch (error) {
      this.finishing = false
      this.file.response = error
      this.reject('server')
      return
    }

    finishRequest.then(res => {
      this.finishing = false
      if (this.settled || !this.file.active) {
        return
      }
      this.file.response = res
      if (res.status !== 'success') {
        return this.reject('server')
      }

      this.resolve(res)
    }).catch(res => {
      this.finishing = false
      if (this.settled || !this.file.active) {
        return
      }
      this.file.response = res
      this.reject('server')
    })
  }


  /**
   * Starts the rolling upload speed calculation
   */
  startSpeedCalc() {
    if (!this.speedometer) {
      this.file.speed = 0
      this.lastTransferSpeed = 0
      this.speedometer = new UploadSpeedometer()
    }
  }

  updateSpeed(transferred) {
    if (this.speedometer) {
      this.lastTransferSpeed = this.speedometer.add(transferred)
      if (this.speedometer.shouldPublish()) {
        this.file.speed = this.lastTransferSpeed
      }
    }
  }

  /**
   * Removes the upload speed interval
   */
  stopSpeedCalc() {
    if (this.speedometer && this.lastTransferSpeed) {
      this.file.speed = this.lastTransferSpeed
    }
    this.speedometer = null
  }
}
