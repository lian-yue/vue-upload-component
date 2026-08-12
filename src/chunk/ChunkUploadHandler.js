import {
  default as request,
  createRequest,
  sendFormRequest
} from '../utils/request.js'

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
    this.speedInterval = null
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
    if (!this.chunks.length) {
      return 0
    }
    const completedProgress = (this.chunksUploaded.length / this.chunks.length) * 100
    const uploadingProgress = this.chunksUploading.reduce((progress, chunk) => {
      return progress + ((chunk.progress | 0) / this.chunks.length)
    }, 0)

    return Math.min(completedProgress + uploadingProgress, 100)
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
    for (let i = 0; i < this.maxActiveChunks; i++) {
      this.uploadNextChunk()
    }

    this.startSpeedCalc()
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
        chunk.progress = Math.round(evt.loaded / evt.total * 100)
        this.updateFileProgress()
      }
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
   * Sets an interval to calculate and
   * set upload speed every 3 seconds
   */
  startSpeedCalc() {
    this.file.speed = 0
    let lastUploadedBytes = 0
    if (!this.speedInterval) {
      this.speedInterval = window.setInterval(() => {
        let uploadedBytes = (this.progress / 100) * this.fileSize
        this.file.speed = (uploadedBytes - lastUploadedBytes)
        lastUploadedBytes = uploadedBytes
      }, 1000)
    }
  }

  /**
   * Removes the upload speed interval
   */
  stopSpeedCalc() {
    this.speedInterval && window.clearInterval(this.speedInterval)
    this.speedInterval = null
    this.file.speed = 0
  }
}
