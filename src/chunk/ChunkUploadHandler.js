import axios from 'axios'

export class DefaultChunkUploadCallbacks {
  async startPhaseSuccessResponse (sessionId, filename) {
  }

  async uploadPhaseSuccessResponse (sessionId, data) {
  }

  async uploadPhaseBeforeRequestCallback (sessionId, uploadBody) {
    return uploadBody
  }

  async finishPhaseBeforeRequest (sessionId, finishBody) {
    return finishBody
  }

  async finishPhaseSuccessResponse (sessionId) {
  }
}


export default class ChunkUploadHandler {
  /**
   * Constructor
   *
   * @param {File} file
   * @param {Object} options
   */
  constructor (file, options) {
    this.file = file
    this.options = options
    this.chunkCallbacksEnabled = this.options.chunkCallbacksEnabled || null
    this.chunkCallbacks = this.options.chunkCallbacks || null
  }

  /**
   * Gets the max retries from options
   */
  get maxRetries () {
    return parseInt(this.options.maxRetries)
  }

  /**
   * Gets the max number of active chunks being uploaded at once from options
   */
  get maxActiveChunks () {
    return parseInt(this.options.maxActive)
  }

  /**
   * Gets the file type
   */
  get fileType () {
    return this.file.type
  }

  /**
   * Gets the file size
   */
  get fileSize () {
    return this.file.size
  }

  /**
   * Gets the file name
   */
  get fileName () {
    return this.file.name
  }

  /**
   * Gets action (url) to upload the file
   */
  get action () {
    return this.options.action || null
  }

  /**
   * Gets the body to be merged when sending the request in start phase
   */
  get startBody () {
    return this.options.startBody || {}
  }

  /**
   * Gets the body to be merged when sending the request in upload phase
   */
  get uploadBody () {
    return this.options.uploadBody || {}
  }

  /**
   * Gets the body to be merged when sending the request in finish phase
   */
  get finishBody () {
    return this.options.finishBody || {}
  }

  /**
   * Gets the headers of the requests from options
   */
  get headers () {
    return this.options.headers || {}
  }

  /**
   * Whether it's ready to upload files or not
   */
  get readyToUpload () {
    return !!this.chunks
  }

  /**
   * Gets the progress of the chunk upload
   * - Gets all the completed chunks
   * - Gets the progress of all the chunks that are being uploaded
   */
  get progress () {
    const completedProgress = (this.chunksUploaded.length / this.chunks.length) * 100
    const uploadingProgress = this.chunksUploading.reduce((progress, chunk) => {
      return progress + ((chunk.progress | 0) / this.chunks.length)
    }, 0)

    return Math.min(completedProgress + uploadingProgress, 100)
  }

  /**
   * Gets all the chunks that are pending to be uploaded
   */
  get chunksToUpload () {
    return this.chunks.filter(chunk => {
      return !chunk.active && !chunk.uploaded
    })
  }

  /**
   * Whether there are chunks to upload or not
   */
  get hasChunksToUpload () {
    return this.chunksToUpload.length > 0
  }

  /**
   * Gets all the chunks that are uploading
   */
  get chunksUploading () {
    return this.chunks.filter(chunk => {
      return !!chunk.xhr && !!chunk.active
    })
  }

  /**
   * Gets all the chunks that have finished uploading
   */
  get chunksUploaded () {
    return this.chunks.filter(chunk => {
      return !!chunk.uploaded
    })
  }

  /**
   * Creates all the chunks in the initial state
   */
  createChunks () {
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
  updateFileProgress () {
    this.file.progress = this.progress
  }

  /**
   * Paues the upload process
   * - Stops all active requests
   * - Sets the file not active
   */
  pause () {
    this.file.active = false
    this.stopChunks()
  }

  /**
   * Stops all the current chunks
   */
  stopChunks () {
    this.chunksUploading.forEach(chunk => {
      chunk.xhr.abort()
      chunk.active = false
    })
  }

  /**
   * Resumes the file upload
   * - Sets the file active
   * - Starts the following chunks
   */
  resume () {
    this.file.active = true
    this.startChunking()
  }

  /**
   * Starts the file upload
   *
   * @returns Promise
   * - resolve  The file was uploaded
   * - reject   The file upload failed
   */
  upload () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
    this.start()

    return this.promise
  }

  /**
   * Start phase
   * Sends a request to the backend to initialise the chunks
   */
  start () {
    axios.post(
      this.action,
      Object.assign(this.startBody, {
        phase: 'start',
        mime_type: this.fileType,
        size: this.fileSize,
        name: this.fileName
      }),
      {
        headers: Object.assign({}, this.headers, {
          'Content-Type': 'application/json'
        })
      }
    ).then(response => {
      const res = response.data
      if (res.status !== 'success') {
        this.file.response = res
        return this.reject('server')
      }

      this.sessionId = res.data.upload_id
      this.chunkSize = res.data.end_offset

      this.startPhaseSuccessResponseCallback(
        this.sessionId,
        this.fileName
      ).then(() => {
        console.debug('[vue-upload-component] ChunkUploadHandler -- START createChunks')
        this.createChunks()
        console.debug('[vue-upload-component] ChunkUploadHandler -- START startChunking')
        this.startChunking()
      }).catch(ex => {
        this.reject('server')
        console.error('[vue-upload-component] ChunkUploadHandler -- START reject server - startPhaseSuccessResponseCallback exception:', ex)
      })
    }).catch(response => {
      const res = response.data
      this.file.response = res
      this.reject('server')
      console.error('[vue-upload-component] ChunkUploadHandler -- START reject server - response:', response)
    })
  }

  /**
   * Starts to upload chunks
   */
  startChunking () {
    for (let i = 0; i < this.maxActiveChunks; i++) {
      this.uploadNextChunk()
    }
  }

  /**
   * Uploads the next chunk
   * - Won't do anything if the process is paused
   * - Will start finish phase if there are no more chunks to upload
   */
  uploadNextChunk () {
    if (this.file.active) {
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
  async uploadChunk (chunk) {
    chunk.progress = 0
    chunk.active = true
    this.updateFileProgress()

    let uploadBody = Object.assign(this.uploadBody, {
      phase: 'upload',
      session_id: this.sessionId,
      start_offset: chunk.startOffset,
      chunk: chunk.blob
    })

    this.uploadPhaseBeforeRequestCallback(
      this.sessionId,
      uploadBody
    ).then(newBody => {
      console.info('[vue-upload-component] ChunkUploadHandler -- UPLOAD uploadPhaseBeforeRequestCallback then - newBody:', newBody)
      const formData = new FormData()
      for (var name in newBody) {
        formData.append(name, newBody[name])
      }

      console.info('[vue-upload-component] ChunkUploadHandler -- UPLOAD formData:', formData)

      axios.post(
        this.action,
        formData,
        {
          headers: Object.assign({}, this.headers, {
            'Content-Type': 'multipart/form-data'
          }),
          onUploadProgress: function(progressEvent) {
            if (progressEvent.lengthComputable) {
              chunk.progress = Math.round(progressEvent.loaded / progressEvent.total * 100)
            }
          }
        }
      ).then(response => {
        console.info('[vue-upload-component] ChunkUploadHandler -- UPLOAD response:', response)
        const res = response.data
        chunk.active = false
        if (res.status === 'success') {
          this.uploadPhaseSuccessResponseCallback(
            this.sessionId,
            res
          ).then(() => {
            console.info('[vue-upload-component] ChunkUploadHandler -- UPLOAD success')
            chunk.uploaded = true
          }).catch(ex => {
            this.reject('server')
            chunk.active = false
            if (chunk.retries-- <= 0) {
              this.stopChunks()
              console.error('[vue-upload-component] ChunkUploadHandler -- UPLOAD stopChunks if (chunk.retries-- <= 0) { - reject upload - exception:', ex)
              return this.reject('upload')
            }
          })
        } else {
          chunk.active = false
          if (chunk.retries-- <= 0) {
            this.stopChunks()
            console.error('[vue-upload-component] ChunkUploadHandler -- UPLOAD stopChunks if (chunk.retries-- <= 0) { - reject upload')
            return this.reject('upload')
          }
        }
        console.warn('[vue-upload-component] ChunkUploadHandler -- UPLOAD uploadNextChunk')
        this.uploadNextChunk()
      }).catch((response) => {
        console.error('[vue-upload-component] ChunkUploadHandler -- UPLOAD catch - response:', response)
        chunk.active = false
        if (chunk.retries-- <= 0) {
          this.stopChunks()
          console.error('[vue-upload-component] ChunkUploadHandler -- UPLOAD stopChunks - reject upload')
          return this.reject('upload')
        }
        console.warn('[vue-upload-component] ChunkUploadHandler -- UPLOAD uploadNextChunk')
        this.uploadNextChunk()
      })
    }).catch((ex) => {
      chunk.active = false
      if (chunk.retries-- <= 0) {
        this.stopChunks()
        console.error('[vue-upload-component] ChunkUploadHandler -- UPLOAD stopChunks - reject upload')
        return this.reject('upload')
      }
      console.warn('[vue-upload-component] ChunkUploadHandler -- UPLOAD uploadPhaseBeforeRequestCallback - exception:', ex)
      this.uploadNextChunk()
    })
  }

  /**
   * Finish phase
   * Sends a request to the backend to finish the process
   */
  async finish () {
    this.updateFileProgress()

    let finishBody = Object.assign(this.finishBody, {
      phase: 'finish',
      session_id: this.sessionId
    })

    this.finishPhaseBeforeRequestCallback(
      this.sessionId,
      finishBody
    ).then(newBody => {
      axios.post(
        this.action,
        newBody,
        {
          headers: Object.assign({}, this.headers, {
            'Content-Type': 'application/json'
          })
        }
      ).then(response => {
        const res = response.data
        this.file.response = res
        if (res.status !== 'success') {
          console.error('[vue-upload-component] ChunkUploadHandler -- FINISH reject server ' +
                        '- IF res.status !== "success"- response:', response)
          return this.reject('server')
        }

        this.finishPhaseSuccessResponseCallback(
          this.sessionId
        ).then(() => {
          this.resolve(res)
        }).catch(ex => {
          console.error('[vue-upload-component] ChunkUploadHandler ' +
                        '-- FINISH reject server - exception:', ex)
          this.reject('server')
        })
      }).catch(response => {
        const res = response.data
        this.file.response = res
        this.reject('server')
        console.error('[vue-upload-component] ChunkUploadHandler ' +
                      '-- FINISH reject server - response:', response)
      })
    }).catch(ex => {
      this.reject('server')
      console.error('[vue-upload-component] ChunkUploadHandler ' +
                    '-- FINISH reject server - exception:', ex)
    })
  }

  async startPhaseSuccessResponseCallback (sessionId, fileName) {
    if (!this.chunkCallbacksEnabled || this.chunkCallbacks.startPhaseSuccessResponse instanceof Function === false) {
      return false
    }
    return this.chunkCallbacks.startPhaseSuccessResponse(sessionId, fileName)
  }

  async uploadPhaseBeforeRequestCallback (sessionId, uploadBody) {
    if (!this.chunkCallbacksEnabled || this.chunkCallbacks.uploadPhaseBeforeRequest instanceof Function === false) {
      return uploadBody
    }
    return this.chunkCallbacks.uploadPhaseBeforeRequest(sessionId, uploadBody)
  }

  async uploadPhaseSuccessResponseCallback (sessionId, data) {
    if (!this.chunkCallbacksEnabled || this.chunkCallbacks.uploadPhaseSuccessResponse instanceof Function === false) {
      return false
    }
    return this.chunkCallbacks.uploadPhaseSuccessResponse(sessionId, data)
  }

  async finishPhaseBeforeRequestCallback (sessionId, finishBody) {
    if (!this.chunkCallbacksEnabled || this.chunkCallbacks.finishPhaseBeforeRequest instanceof Function === false) {
      return finishBody
    }
    return this.chunkCallbacks.finishPhaseBeforeRequest(sessionId, finishBody)
  }

  async finishPhaseSuccessResponseCallback (sessionId) {
    if (!this.chunkCallbacksEnabled || this.chunkCallbacks.finishPhaseSuccessResponse instanceof Function === false) {
      return false
    }
    return this.chunkCallbacks.finishPhaseSuccessResponse(sessionId)
  }
}
