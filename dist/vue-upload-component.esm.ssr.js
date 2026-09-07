import { defineComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';

/**
 * Creates a XHR request
 *
 * @param {Object} options
 */
const createRequest = (options) => {
  const xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', options.url);
  xhr.responseType = 'json';
  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key]);
    });
  }

  return xhr
};

/**
 * Sends a XHR request with certain body
 *
 * @param {XMLHttpRequest} xhr
 * @param {Object} body
 */
const sendRequest = (xhr, body) => {
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response;
        try {
          response = JSON.parse(xhr.response);
        } catch (err) {
          response = xhr.response;
        }
        resolve(response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = () => reject(xhr.response);
    xhr.onabort = () => reject(new Error('abort'));
    xhr.ontimeout = () => reject(new Error('timeout'));
    xhr.send(JSON.stringify(body));
  })
};

/**
 * Sends a XHR request with certain form data
 *
 * @param {XMLHttpRequest} xhr
 * @param {Object} data
 */
const sendFormRequest = (xhr, data) => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    for (const name in data) {
      const value = data[name];
      if (value && typeof value === 'object' && !(typeof Blob !== 'undefined' && value instanceof Blob)) {
        body.append(name, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        body.append(name, value);
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response;
        try {
          response = JSON.parse(xhr.response);
        } catch (err) {
          response = xhr.response;
        }
        resolve(response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = () => reject(xhr.response);
    xhr.onabort = () => reject(new Error('abort'));
    xhr.ontimeout = () => reject(new Error('timeout'));
    xhr.send(body);
  })
};

/**
 * Creates and sends XHR request
 *
 * @param {Object} options
 *
 * @returns Promise
 */
function request (options) {
  const xhr = createRequest(options);

  return sendRequest(xhr, options.body)
}

const DEFAULT_WINDOW_MS = 3000;

function currentTime() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  }
  return Date.now()
}

class UploadSpeedometer {
  constructor(windowMs = DEFAULT_WINDOW_MS) {
    this.windowMs = windowMs;
    this.totalBytes = 0;
    this.samples = [];
    this.lastPublishedAt = null;
  }

  start(recordedAt = currentTime()) {
    if (this.samples.length) {
      return
    }
    this.samples.push({ time: recordedAt, bytes: this.totalBytes });
    this.lastPublishedAt = recordedAt;
  }

  add(bytes, recordedAt = currentTime()) {
    this.start(recordedAt);
    if (Number.isFinite(bytes) && bytes > 0) {
      this.totalBytes += bytes;
    }
    return this.measure(recordedAt)
  }

  tick(recordedAt = currentTime()) {
    this.start(recordedAt);
    return this.measure(recordedAt)
  }

  shouldPublish(intervalMs = 1000) {
    if (!this.samples.length) {
      return false
    }
    const recordedAt = this.samples[this.samples.length - 1].time;
    if (recordedAt - this.lastPublishedAt < intervalMs) {
      return false
    }
    this.lastPublishedAt = recordedAt;
    return true
  }

  measure(recordedAt) {
    const lastSample = this.samples[this.samples.length - 1];
    const time = Math.max(lastSample.time, recordedAt);
    if (time === lastSample.time) {
      lastSample.bytes = this.totalBytes;
    } else {
      this.samples.push({ time, bytes: this.totalBytes });
    }

    const cutoff = time - this.windowMs;
    while (this.samples.length > 2 && this.samples[1].time <= cutoff) {
      this.samples.shift();
    }

    const first = this.samples[0];
    const second = this.samples[1];
    let baselineTime = first.time;
    let baselineBytes = first.bytes;
    if (first.time < cutoff && second) {
      const sampleDuration = second.time - first.time;
      const cutoffRatio = sampleDuration > 0 ? (cutoff - first.time) / sampleDuration : 1;
      baselineTime = cutoff;
      baselineBytes = first.bytes + ((second.bytes - first.bytes) * cutoffRatio);
    }

    const duration = time - baselineTime;
    if (duration <= 0) {
      return 0
    }
    return Math.max(0, Math.round(((this.totalBytes - baselineBytes) * 1000) / duration))
  }
}

class ChunkUploadHandler {
  /**
   * Constructor
   *
   * @param {File} file
   * @param {Object} options
   */
  constructor(file, options) {
    this.file = file;
    this.options = options;
    this.chunks = [];
    this.sessionId = null;
    this.chunkSize = null;
    this.speedometer = null;
    this.lastTransferSpeed = 0;
    this.finishing = false;
    this.settled = false;
    this.paused = false;
    this.resuming = false;
  }

  /**
   * Gets the max retries from options
   */
  get maxRetries() {
    const value = parseInt(this.options.maxRetries, 10);
    return Number.isFinite(value) && value >= 0 ? value : 0
  }

  /**
   * Gets the max number of active chunks being uploaded at once from options
   */
  get maxActiveChunks() {
    const value = parseInt(this.options.maxActive, 10);
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
    }, 0);
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
    this.chunks = [];

    let start = 0;
    let end = this.chunkSize;
    while (start < this.fileSize) {
      this.chunks.push({
        blob: this.file.file.slice(start, end),
        startOffset: start,
        active: false,
        loaded: 0,
        transferred: 0,
        retries: this.maxRetries
      });
      start = end;
      end = start + this.chunkSize;
    }
  }

  /**
   * Updates the progress of the file with the handler's progress
   */
  updateFileProgress() {
    this.file.progress = this.progress;
  }

  /**
   * Paues the upload process
   * - Stops all active requests
   * - Sets the file not active
   */
  pause() {
    this.paused = true;
    const file = this.options.onPause?.(this.file);
    if (file) {
      this.file = file;
    } else {
      this.file.active = false;
    }
    this.stopChunks();
  }

  /**
   * Stops all the current chunks
   */
  stopChunks() {
    this.chunksUploading.forEach(chunk => {
      chunk.xhr.abort();
      chunk.active = false;
    });

    this.stopSpeedCalc();
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
    this.resuming = true;
    this.paused = false;
    const file = this.options.onResume?.(this.file);
    if (file) {
      this.file = file;
    } else {
      this.file.active = true;
    }
    this.resuming = false;
    this.startChunking();
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
        this.settled = true;
        this.stopSpeedCalc();
        resolve(value);
      };
      this.reject = error => {
        if (this.settled) {
          return
        }
        this.settled = true;
        this.stopChunks();
        reject(error);
      };
    });
    try {
      this.start();
    } catch (error) {
      this.reject(error);
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
        this.file.response = res;
        return this.reject('server')
      }

      const chunkSize = Number(res.data?.end_offset);
      const sessionId = res.data?.session_id;
      if (!Number.isFinite(chunkSize) || chunkSize <= 0 || sessionId === null || sessionId === undefined || sessionId === '') {
        this.file.response = res;
        return this.reject('server')
      }

      this.sessionId = sessionId;
      this.chunkSize = chunkSize;

      this.createChunks();
      if (this.file.active) {
        this.startChunking();
      }
    }).catch(res => {
      if (this.settled) {
        return
      }
      this.file.response = res;
      this.reject('server');
    });
  }

  /**
   * Starts to upload chunks
   */
  startChunking() {
    if (this.settled || !this.file.active || !this.readyToUpload) {
      return
    }
    this.startSpeedCalc();
    for (let i = 0; i < this.maxActiveChunks; i++) {
      this.uploadNextChunk();
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
    chunk.progress = 0;
    chunk.loaded = 0;
    chunk.transferred = 0;
    chunk.active = true;
    this.updateFileProgress();
    try {
      chunk.xhr = createRequest({
        method: 'POST',
        headers: this.headers,
        url: this.action
      });
    } catch (error) {
      chunk.active = false;
      this.reject(error);
      return
    }

    chunk.xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const transferred = Math.max(0, evt.loaded - chunk.transferred);
        chunk.transferred = evt.loaded;
        chunk.loaded = evt.total > 0 ? Math.min(chunk.blob.size, (evt.loaded / evt.total) * chunk.blob.size) : 0;
        chunk.progress = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0;
        this.updateSpeed(transferred);
        this.updateFileProgress();
      }
    }, false);
    chunk.xhr.upload.addEventListener('loadstart', () => {
      this.speedometer?.start();
    }, false);

    sendFormRequest(chunk.xhr, {
      ...this.uploadBody,
      phase: 'upload',
      session_id: this.sessionId,
      start_offset: chunk.startOffset,
      chunk: chunk.blob
    }).then(res => {
      chunk.active = false;
      if (this.settled) {
        return
      }
      if (res.status === 'success') {
        chunk.uploaded = true;
      } else {
        if (chunk.retries-- <= 0) {
          this.stopChunks();
          return this.reject('upload')
        }
      }

      this.uploadNextChunk();
    }).catch(() => {
      chunk.active = false;
      if (this.settled || !this.file.active) {
        return
      }
      if (chunk.retries-- <= 0) {
        this.stopChunks();
        return this.reject('upload')
      }

      this.uploadNextChunk();
    });
  }

  /**
   * Finish phase
   * Sends a request to the backend to finish the process
   */
  finish() {
    if (this.settled || this.finishing || !this.file.active) {
      return
    }
    this.finishing = true;
    this.updateFileProgress();
    this.stopSpeedCalc();

    let finishRequest;
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
      });
    } catch (error) {
      this.finishing = false;
      this.file.response = error;
      this.reject('server');
      return
    }

    finishRequest.then(res => {
      this.finishing = false;
      if (this.settled || !this.file.active) {
        return
      }
      this.file.response = res;
      if (res.status !== 'success') {
        return this.reject('server')
      }

      this.resolve(res);
    }).catch(res => {
      this.finishing = false;
      if (this.settled || !this.file.active) {
        return
      }
      this.file.response = res;
      this.reject('server');
    });
  }


  /**
   * Starts the rolling upload speed calculation
   */
  startSpeedCalc() {
    if (!this.speedometer) {
      this.file.speed = 0;
      this.lastTransferSpeed = 0;
      this.speedometer = new UploadSpeedometer();
    }
  }

  updateSpeed(transferred) {
    if (this.speedometer) {
      this.lastTransferSpeed = this.speedometer.add(transferred);
      if (this.speedometer.shouldPublish()) {
        this.file.speed = this.lastTransferSpeed;
      }
    }
  }

  /**
   * Removes the upload speed interval
   */
  stopSpeedCalc() {
    if (this.speedometer && this.lastTransferSpeed) {
      this.file.speed = this.lastTransferSpeed;
    }
    this.speedometer = null;
  }
}

const CHUNK_DEFAULT_OPTIONS = {
    headers: {},
    action: '',
    minSize: 1048576,
    maxActive: 3,
    maxRetries: 5,
    handler: ChunkUploadHandler
};
let fileId = 0;
let uploadTokenId = 0;
function createFileMap() {
    return Object.create(null);
}
var script = defineComponent({
    compatConfig: {
        MODE: 3,
    },
    props: {
        inputId: {
            type: String,
        },
        name: {
            type: String,
            default: 'file',
        },
        accept: {
            type: String,
        },
        capture: {
            type: [Boolean, String],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        maximum: {
            type: Number,
        },
        addIndex: {
            type: [Boolean, Number],
        },
        directory: {
            type: Boolean,
        },
        createDirectory: {
            type: Boolean,
            default: false
        },
        postAction: {
            type: String,
        },
        putAction: {
            type: String,
        },
        customAction: {
            type: Function
        },
        headers: {
            type: Object,
            default: () => {
                return {};
            },
        },
        data: {
            type: Object,
            default: () => {
                return {};
            },
        },
        timeout: {
            type: Number,
            default: 0,
        },
        drop: {
            type: [Boolean, String, Object],
            default: () => {
                return false;
            },
        },
        dropDirectory: {
            type: Boolean,
            default: true,
        },
        size: {
            type: Number,
            default: 0,
        },
        extensions: {
            type: [RegExp, String, Array],
            default: () => {
                return [];
            },
        },
        modelValue: {
            type: Array,
            default: () => {
                return [];
            },
        },
        thread: {
            type: Number,
            default: 1,
        },
        // Chunk upload enabled
        chunkEnabled: {
            type: Boolean,
            default: false
        },
        // Chunk upload properties
        chunk: {
            type: Object,
            default: () => {
                return { ...CHUNK_DEFAULT_OPTIONS, headers: {} };
            }
        }
    },
    emits: [
        'update:modelValue',
        'input-filter',
        'input-file',
    ],
    data() {
        return {
            files: this.modelValue,
            features: {
                html5: true,
                directory: false,
                drop: false,
            },
            active: false,
            dropActive: false,
            dropElementActive: false,
            uploading: 0,
            activeUploadIds: new Set(),
            activeUploadTokens: new Map(),
            destroy: false,
            maps: createFileMap(),
            dropElement: null,
            dropTimeout: null,
            reload: false,
        };
    },
    /**
     * mounted
     * @return {[type]} [description]
     */
    mounted() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        // html5 特征
        if (window.FormData && input.files) {
            // 上传目录特征
            // @ts-ignore
            if (typeof input.webkitdirectory === 'boolean' || typeof input.directory === 'boolean') {
                this.features.directory = true;
            }
            // 拖拽特征. 要兼容 relatedTarget
            if (this.features.html5 && typeof input.ondrop !== 'undefined' && this.isRelatedTargetSupported()) {
                this.features.drop = true;
            }
        }
        else {
            this.features.html5 = false;
        }
        // files 定位缓存
        this.maps = createFileMap();
        if (this.files) {
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                this.maps[file.id] = file;
            }
        }
        // @ts-ignore
        this.$nextTick(() => {
            // 更新下父级
            if (this.$parent) {
                this.$parent.$forceUpdate();
                // 拖拽渲染
                this.$parent.$nextTick(() => {
                    this.watchDrop(this.drop);
                });
            }
            else {
                // 拖拽渲染
                this.watchDrop(this.drop);
            }
        });
    },
    /**
     * beforeUnmount
     * @return {[type]} [description]
     */
    beforeUnmount() {
        // 已销毁
        this.destroy = true;
        // 设置成不激活
        this.active = false;
        // 销毁拖拽事件
        this.watchDrop(false);
        // 销毁不激活
        this.watchActive(false);
    },
    computed: {
        /**
         * uploading 正在上传的线程
         * @return {[type]} [description]
         */
        /**
         * uploaded 文件列表是否全部已上传
         * @return {[type]} [description]
         */
        uploaded() {
            let file;
            for (let i = 0; i < this.files.length; i++) {
                file = this.files[i];
                if (file.fileObject && !file.error && !file.success) {
                    return false;
                }
            }
            return true;
        },
        chunkOptions() {
            return { ...CHUNK_DEFAULT_OPTIONS, ...this.chunk };
        },
        className() {
            return [
                'file-uploads',
                this.features.html5 ? 'file-uploads-html5' : 'file-uploads-html4',
                this.features.directory && this.directory ? 'file-uploads-directory' : undefined,
                this.features.drop && this.drop ? 'file-uploads-drop' : undefined,
                this.disabled ? 'file-uploads-disabled' : undefined,
            ];
        },
        forId() {
            return this.inputId || this.name;
        },
        iMaximum() {
            if (this.maximum === undefined) {
                return this.multiple ? 0 : 1;
            }
            const maximum = Math.floor(this.maximum);
            return Number.isFinite(maximum) && maximum > 0 ? maximum : 0;
        },
        iThread() {
            const thread = Math.floor(this.thread);
            return Number.isFinite(thread) && thread > 0 ? thread : 1;
        },
        iExtensions() {
            if (!this.extensions) {
                return;
            }
            if (this.extensions instanceof RegExp) {
                return this.extensions;
            }
            if (!this.extensions.length) {
                return;
            }
            let exts = [];
            if (typeof this.extensions === 'string') {
                exts = this.extensions.split(',');
            }
            else {
                exts = this.extensions;
            }
            exts = exts.filter(function (value) { return typeof value === 'string'; }).map(function (value) { return value.trim(); }).filter(function (value) { return value; });
            const pattern = exts.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            if (!pattern) {
                return;
            }
            return new RegExp('\\.(' + pattern + ')$', 'i');
        },
        iDirectory() {
            if (this.directory && this.features.directory) {
                return true;
            }
            return undefined;
        }
    },
    watch: {
        active(active) {
            this.watchActive(active);
        },
        dropActive(value) {
            this.watchDropActive(value);
            if (this.$parent) {
                this.$parent.$forceUpdate();
            }
        },
        drop(value) {
            this.watchDrop(value);
        },
        disabled(value) {
            if (value) {
                this.dropActive = false;
                this.dropElementActive = false;
                this.watchDropActive(false);
            }
        },
        modelValue(files) {
            if (this.files === files) {
                return;
            }
            this.files = files;
            const oldMaps = this.maps;
            // 重写 maps 缓存
            this.maps = createFileMap();
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                this.maps[file.id] = file;
            }
            // add, update
            for (const key in this.maps) {
                const newFile = this.maps[key];
                const oldFile = oldMaps[key];
                if (newFile !== oldFile) {
                    this.emitFile(newFile, oldFile);
                }
            }
            // delete
            for (const key in oldMaps) {
                if (!this.maps[key]) {
                    this.emitFile(undefined, oldMaps[key]);
                }
            }
        },
    },
    methods: {
        newId() {
            fileId++;
            return Math.random().toString(36).slice(2) + Date.now().toString(36) + fileId.toString(36);
        },
        ensureUniqueId(file, addFiles) {
            if (file.id && !this.maps[file.id] && !addFiles.some(value => value.id === file.id)) {
                return;
            }
            do {
                file.id = this.newId();
            } while (this.maps[file.id] || addFiles.some(value => value.id === file.id));
        },
        // 清空
        clear() {
            if (this.files.length) {
                const files = this.files;
                this.files = [];
                // 定位
                this.maps = createFileMap();
                // 事件
                this.emitInput();
                for (let i = 0; i < files.length; i++) {
                    this.emitFile(undefined, files[i]);
                }
            }
            return true;
        },
        // 选择
        get(id) {
            if (!id) {
                return false;
            }
            if (typeof id === 'object') {
                return this.maps[id.id || ''] || false;
            }
            return this.maps[id] || false;
        },
        // 添加
        add(_files, index) {
            // 不是数组整理成数组
            let files;
            if (_files instanceof Array) {
                files = _files;
            }
            else {
                files = [_files];
            }
            if (index === undefined) {
                index = this.addIndex;
            }
            // 遍历规范对象
            let addFiles = [];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (!file || typeof file !== 'object') {
                    continue;
                }
                if (this.features.html5 && typeof Blob !== 'undefined' && file instanceof Blob) {
                    file = {
                        id: '',
                        file,
                        size: file.size,
                        // @ts-ignore
                        name: file.webkitRelativePath || file.relativePath || file.name || 'unknown',
                        type: file.type,
                    };
                }
                file = file;
                let fileObject = false;
                if (file.fileObject === false) ;
                else if (file.fileObject) {
                    fileObject = true;
                }
                else if (typeof HTMLInputElement !== 'undefined' && file.el instanceof HTMLInputElement) {
                    fileObject = true;
                }
                else if (typeof Blob !== 'undefined' && file.file instanceof Blob) {
                    fileObject = true;
                }
                if (fileObject) {
                    file = {
                        fileObject: true,
                        size: -1,
                        name: 'Filename',
                        type: '',
                        active: false,
                        error: '',
                        success: false,
                        putAction: this.putAction,
                        postAction: this.postAction,
                        timeout: this.timeout,
                        ...file,
                        response: {},
                        progress: '0.00', // 只读
                        speed: 0, // 只读
                        // file: undefined,
                        // xhr: undefined,
                        // el: undefined,
                        // iframe: undefined,
                    };
                    file.data = {
                        ...this.data,
                        ...file.data ? file.data : {},
                    };
                    file.headers = {
                        ...this.headers,
                        ...file.headers ? file.headers : {},
                    };
                }
                // 必须包含 id
                this.ensureUniqueId(file, addFiles);
                if (this.emitFilter(file, undefined)) {
                    continue;
                }
                this.ensureUniqueId(file, addFiles);
                // 最大数量限制
                if (this.iMaximum > 1 && (addFiles.length + this.files.length) >= this.iMaximum) {
                    break;
                }
                addFiles.push(file);
                // 最大数量限制
                if (this.iMaximum === 1) {
                    break;
                }
            }
            // 没有文件
            if (!addFiles.length) {
                return;
            }
            // 如果是 1 清空
            if (this.iMaximum === 1) {
                this.clear();
            }
            // 添加进去 files
            let newFiles;
            if (index === true || index === 0) {
                newFiles = addFiles.concat(this.files);
            }
            else if (index) {
                newFiles = this.files.concat([]);
                newFiles.splice(index, 0, ...addFiles);
            }
            else {
                newFiles = this.files.concat(addFiles);
            }
            this.files = newFiles;
            // 读取代理后的数据
            let index2 = 0;
            if (index === true || index === 0) {
                index2 = 0;
            }
            else if (index) {
                if (index >= 0) {
                    if ((index + addFiles.length) > this.files.length) {
                        index2 = this.files.length - addFiles.length;
                    }
                    else {
                        index2 = index;
                    }
                }
                else {
                    index2 = this.files.length - addFiles.length + index;
                    if (index2 < 0) {
                        index2 = 0;
                    }
                }
            }
            else {
                index2 = this.files.length - addFiles.length;
            }
            addFiles = this.files.slice(index2, index2 + addFiles.length);
            // 定位
            for (let i = 0; i < addFiles.length; i++) {
                const file = addFiles[i];
                this.maps[file.id] = file;
            }
            // 事件
            this.emitInput();
            for (let i = 0; i < addFiles.length; i++) {
                this.emitFile(addFiles[i], undefined);
            }
            return _files instanceof Array ? addFiles : addFiles[0];
        },
        // 添加表单文件
        addInputFile(el) {
            const files = [];
            // @ts-ignore
            const entrys = el.webkitEntries || el.entries || undefined;
            if (entrys?.length) {
                return this.getFileSystemEntry(entrys).then((files) => {
                    return this.add(files) || [];
                });
            }
            if (el.files) {
                for (let i = 0; i < el.files.length; i++) {
                    const file = el.files[i];
                    files.push({
                        id: '',
                        size: file.size,
                        // @ts-ignore
                        name: file.webkitRelativePath || file.relativePath || file.name,
                        type: file.type,
                        file,
                    });
                }
            }
            else {
                let names = el.value.replace(/\\/g, '/').split('/');
                if (!names || !names.length) {
                    names = [el.value];
                }
                // @ts-ignore
                delete el.__vuex__;
                files.push({
                    id: '',
                    name: names[names.length - 1],
                    el,
                });
            }
            return Promise.resolve(this.add(files) || []);
        },
        // 添加 DataTransfer
        addDataTransfer(dataTransfer) {
            // dataTransfer.items 支持
            if (dataTransfer?.items?.length) {
                const entrys = [];
                // 遍历出所有 dataTransferVueUploadItem
                for (let i = 0; i < dataTransfer.items.length; i++) {
                    const dataTransferTtem = dataTransfer.items[i];
                    let entry;
                    // @ts-ignore
                    if (dataTransferTtem.getAsEntry) {
                        // @ts-ignore
                        entry = dataTransferTtem.getAsEntry() || dataTransferTtem.getAsFile();
                    }
                    else if (dataTransferTtem.webkitGetAsEntry) {
                        entry = dataTransferTtem.webkitGetAsEntry() || dataTransferTtem.getAsFile();
                    }
                    else {
                        entry = dataTransferTtem.getAsFile();
                    }
                    if (entry) {
                        entrys.push(entry);
                    }
                }
                if (entrys.length) {
                    return this.getFileSystemEntry(entrys).then((files) => {
                        return this.add(files) || [];
                    });
                }
            }
            // dataTransfer.files 支持
            const maximumValue = this.iMaximum;
            const files = [];
            if (dataTransfer.files.length) {
                for (let i = 0; i < dataTransfer.files.length; i++) {
                    files.push(dataTransfer.files[i]);
                    if (maximumValue > 0 && files.length >= maximumValue) {
                        break;
                    }
                }
                return Promise.resolve(this.add(files) || []);
            }
            return Promise.resolve([]);
        },
        // 获得 entrys
        getFileSystemEntry(entry, path = '') {
            // getFileSystemEntry(entry: any, path = ''): Promise<VueUploadItem[]> {
            return new Promise((resolve) => {
                const maximumValue = this.iMaximum;
                if (!entry) {
                    resolve([]);
                    return;
                }
                if (entry instanceof Array) {
                    // 多个
                    const uploadFiles = [];
                    const forEach = (i) => {
                        const v = entry[i];
                        if (!v || (maximumValue > 0 && uploadFiles.length >= maximumValue)) {
                            return resolve(uploadFiles);
                        }
                        this.getFileSystemEntry(v, path).then(function (results) {
                            const remaining = maximumValue > 0 ? maximumValue - uploadFiles.length : results.length;
                            uploadFiles.push(...results.slice(0, Math.max(remaining, 0)));
                            forEach(i + 1);
                        });
                    };
                    forEach(0);
                    return;
                }
                if (entry instanceof Blob) {
                    resolve([
                        {
                            id: '',
                            size: entry.size,
                            // @ts-ignore
                            name: path + entry.name,
                            type: entry.type,
                            file: entry,
                        }
                    ]);
                    return;
                }
                if (entry.isFile) {
                    let fileEntry = entry;
                    fileEntry.file(function (file) {
                        resolve([
                            {
                                id: '',
                                size: file.size,
                                name: path + file.name,
                                type: file.type,
                                file,
                            }
                        ]);
                    }, function () {
                        resolve([]);
                    });
                    return;
                }
                if (entry.isDirectory && this.dropDirectory) {
                    let directoryEntry = entry;
                    const uploadFiles = [];
                    // 目录也要添加到文件列表
                    if (this.createDirectory) {
                        uploadFiles.push({
                            id: '',
                            name: path + directoryEntry.name,
                            size: 0,
                            type: 'text/directory',
                            file: new File([], path + directoryEntry.name, { type: 'text/directory' }),
                        });
                    }
                    const dirReader = directoryEntry.createReader();
                    const readEntries = () => {
                        dirReader.readEntries((entries) => {
                            const forEach = (i) => {
                                if ((!entries[i] && i === 0) || (maximumValue > 0 && uploadFiles.length >= maximumValue)) {
                                    return resolve(uploadFiles);
                                }
                                if (!entries[i]) {
                                    return readEntries();
                                }
                                this.getFileSystemEntry(entries[i], path + directoryEntry.name + '/').then(function (results) {
                                    const remaining = maximumValue > 0 ? maximumValue - uploadFiles.length : results.length;
                                    uploadFiles.push(...results.slice(0, Math.max(remaining, 0)));
                                    forEach(i + 1);
                                });
                            };
                            forEach(0);
                        }, function () {
                            resolve(uploadFiles);
                        });
                    };
                    readEntries();
                    return;
                }
                resolve([]);
            });
        },
        // 替换
        replace(id1, id2) {
            const file1 = this.get(id1);
            const file2 = this.get(id2);
            if (!file1 || !file2 || file1 === file2) {
                return false;
            }
            const files = this.files.concat([]);
            const index1 = files.indexOf(file1);
            const index2 = files.indexOf(file2);
            if (index1 === -1 || index2 === -1) {
                return false;
            }
            files[index1] = file2;
            files[index2] = file1;
            this.files = files;
            this.emitInput();
            return true;
        },
        // 移除
        remove(id) {
            const file = this.get(id);
            if (file) {
                if (this.emitFilter(undefined, file)) {
                    return false;
                }
                const files = this.files.concat([]);
                const index = files.indexOf(file);
                if (index === -1) {
                    console.error('remove', file);
                    return false;
                }
                files.splice(index, 1);
                this.files = files;
                // 定位
                delete this.maps[file.id];
                // 事件
                this.emitInput();
                this.emitFile(undefined, file);
            }
            return file;
        },
        // 更新
        update(id, data) {
            const file = this.get(id);
            if (file) {
                let newFile = {
                    ...file,
                    ...data
                };
                if (newFile.id !== file.id && (file.active || this.activeUploadTokens.has(file.id) || (this.maps[newFile.id] && this.maps[newFile.id] !== file))) {
                    return false;
                }
                // 停用必须加上错误
                if (file.fileObject && file.active && !newFile.active && !newFile.error && !newFile.success && !newFile.chunk?.paused) {
                    newFile.error = 'abort';
                }
                // 从 非激活 变为 激活 速度归零 不能沿用上一次上传的速度
                if (newFile.fileObject && newFile.active && !file.active && data.speed === undefined) {
                    newFile.speed = 0;
                }
                if (this.emitFilter(newFile, file)) {
                    return false;
                }
                if (!newFile.id || (newFile.id !== file.id && (file.active || this.maps[newFile.id]))) {
                    return false;
                }
                const files = this.files.concat([]);
                const index = files.indexOf(file);
                if (index === -1) {
                    console.error('update', file);
                    return false;
                }
                files.splice(index, 1, newFile);
                this.files = files;
                newFile = this.files[index];
                // 删除  旧定位 写入 新定位 （已便支持修改id)
                delete this.maps[file.id];
                this.maps[newFile.id] = newFile;
                // 事件
                this.emitInput();
                this.emitFile(newFile, file);
                return newFile;
            }
            return false;
        },
        // 预处理 事件 过滤器
        emitFilter(newFile, oldFile) {
            let isPrevent = false;
            this.$emit('input-filter', newFile, oldFile, function (prevent = true) {
                isPrevent = prevent;
                return isPrevent;
            });
            return isPrevent;
        },
        resumeChunkUpload(file) {
            if (!this.activeUploadTokens.has(file.id) || !file.chunk?.resume || file.chunk.settled) {
                return false;
            }
            if (!this.activeUploadIds.has(file.id)) {
                this.activeUploadIds.add(file.id);
                this.uploading++;
            }
            file.chunk.file = file;
            if (!file.chunk.resuming) {
                file.chunk.resume();
            }
            return true;
        },
        // 处理后 事件 分发
        emitFile(newFile, oldFile) {
            this.$emit('input-file', newFile, oldFile);
            if (!newFile && oldFile) {
                this.activeUploadTokens.delete(oldFile.id);
            }
            else if (newFile && !newFile.active && (newFile.error || newFile.success || !newFile.fileObject)) {
                this.activeUploadTokens.delete(newFile.id);
            }
            if (newFile?.fileObject && newFile.active && (!oldFile || !oldFile.active)) {
                if (this.resumeChunkUpload(newFile)) ;
                else if (this.activeUploadIds.has(newFile.id)) {
                    if (newFile.chunk?.resume) {
                        newFile.chunk.file = newFile;
                        newFile.chunk.resume();
                    }
                }
                else {
                    const uploadId = newFile.id;
                    const uploadToken = ++uploadTokenId;
                    this.activeUploadIds.add(newFile.id);
                    this.activeUploadTokens.set(uploadId, uploadToken);
                    this.uploading++;
                    // 激活
                    // @ts-ignore
                    this.$nextTick(() => {
                        setTimeout(() => {
                            Promise.resolve().then(() => {
                                if (this.activeUploadTokens.get(uploadId) !== uploadToken) {
                                    return;
                                }
                                const currentFile = this.get(uploadId);
                                if (!currentFile || !currentFile.active) {
                                    throw new Error('abort');
                                }
                                newFile = currentFile;
                                return this.upload(currentFile);
                            }).then(() => {
                                if (this.activeUploadTokens.get(uploadId) !== uploadToken) {
                                    return;
                                }
                                newFile = this.get(uploadId) || undefined;
                                if (newFile?.fileObject) {
                                    this.update(newFile, {
                                        active: false,
                                        success: !newFile.error
                                    });
                                }
                            }).catch((e) => {
                                if (this.activeUploadTokens.get(uploadId) !== uploadToken) {
                                    return;
                                }
                                const currentFile = this.get(uploadId);
                                currentFile && this.update(currentFile, {
                                    active: false,
                                    success: false,
                                    error: e.code || e.error || e.message || e
                                });
                            });
                        }, Math.ceil(Math.random() * 50 + 50));
                    });
                }
            }
            else if ((!newFile || !newFile.fileObject || !newFile.active) && oldFile?.fileObject && this.activeUploadIds.has(oldFile.id)) {
                // 停止
                this.activeUploadIds.delete(oldFile.id);
                const pausedChunk = Boolean(newFile && !newFile.error && !newFile.success && newFile.chunk?.paused);
                if (!pausedChunk) {
                    this.activeUploadTokens.delete(oldFile.id);
                }
                if (!newFile?.success && oldFile.chunk?.pause && !oldFile.chunk.paused) {
                    oldFile.chunk.pause();
                }
                this.uploading = Math.max(0, this.uploading - 1);
            }
            // 自动延续激活
            // @ts-ignore
            if (this.active && (Boolean(newFile) !== Boolean(oldFile) || newFile.active !== oldFile.active)) {
                this.watchActive(true);
            }
        },
        emitInput() {
            this.$emit('update:modelValue', this.files);
        },
        // 上传
        upload(id) {
            const file = this.get(id);
            // 被删除
            if (!file) {
                return Promise.reject(new Error('not_exists'));
            }
            // 不是文件对象
            if (!file.fileObject) {
                return Promise.reject(new Error('file_object'));
            }
            // 有错误直接响应
            if (file.error) {
                if (file.error instanceof Error) {
                    return Promise.reject(file.error);
                }
                return Promise.reject(new Error(file.error));
            }
            // 已完成直接响应
            if (file.success) {
                return Promise.resolve(file);
            }
            // 后缀
            if (file.name && this.iExtensions && file.type !== "text/directory") {
                if (file.name.search(this.iExtensions) === -1) {
                    return Promise.reject(new Error('extension'));
                }
            }
            // 大小
            if (this.size > 0 && file.size !== undefined && file.size >= 0 && file.size > this.size && file.type !== "text/directory") {
                return Promise.reject(new Error('size'));
            }
            try {
                if (this.customAction) {
                    return Promise.resolve(this.customAction(file, this));
                }
                if (this.features.html5) {
                    if (this.shouldUseChunkUpload(file)) {
                        return this.uploadChunk(file);
                    }
                    if (file.putAction) {
                        return this.uploadPut(file);
                    }
                    if (file.postAction) {
                        return this.uploadHtml5(file);
                    }
                }
                if (file.postAction) {
                    return this.uploadHtml4(file);
                }
            }
            catch (error) {
                return Promise.reject(error instanceof Error ? error : new Error(String(error)));
            }
            return Promise.reject(new Error('No action configured'));
        },
        /**
         * Whether this file should be uploaded using chunk upload or not
         *
         * @param Object file
         */
        shouldUseChunkUpload(file) {
            return Boolean(this.chunkEnabled &&
                !!this.chunkOptions.handler &&
                file.size && file.size > this.chunkOptions.minSize);
        },
        /**
         * Upload a file using Chunk method
         *
         * @param File file
         */
        uploadChunk(file) {
            const HandlerClass = this.chunkOptions.handler;
            const fileId = file.id;
            const handlerOptions = {
                ...this.chunkOptions,
                onPause: (handlerFile) => {
                    const currentFile = this.get(fileId);
                    if (!currentFile) {
                        // 文件已移除，先停用旧处理器，避免取消请求后继续重试。
                        handlerFile.active = false;
                        return handlerFile;
                    }
                    if (currentFile && currentFile.active) {
                        return this.update(currentFile, { active: false }) || handlerFile;
                    }
                    return currentFile || handlerFile;
                },
                onResume: (handlerFile) => {
                    const currentFile = this.get(fileId);
                    if (currentFile && !currentFile.active && !currentFile.error && !currentFile.success) {
                        return this.update(currentFile, { active: true }) || handlerFile;
                    }
                    return currentFile || handlerFile;
                },
            };
            file.chunk = new HandlerClass(file, handlerOptions);
            return file.chunk.upload().then(() => file);
        },
        uploadPut(file) {
            const querys = [];
            let value;
            for (const key in file.data) {
                value = file.data[key];
                if (value !== null && value !== undefined) {
                    if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    }
                    querys.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
            const putAction = file.putAction || '';
            const queryString = querys.length ? (putAction.indexOf('?') === -1 ? '?' : '&') + querys.join('&') : '';
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', putAction + queryString);
            return this.uploadXhr(xhr, file, file.file);
        },
        uploadHtml5(file) {
            const form = new window.FormData();
            let value;
            for (const key in file.data) {
                value = file.data[key];
                if (value && typeof value === 'object') {
                    if (typeof File !== 'undefined' && value instanceof File) {
                        form.append(key, value, value.name);
                    }
                    else if (typeof Blob !== 'undefined' && value instanceof Blob) {
                        form.append(key, value);
                    }
                    else {
                        form.append(key, JSON.stringify(value));
                    }
                }
                else if (value !== null && value !== undefined) {
                    form.append(key, value);
                }
            }
            // Moved file.name as the first option to set the filename of the uploaded file, since file.name
            // contains the full (relative) path of the file not just the filename as in file.file.filename
            // @ts-ignore
            form.append(this.name, file.file, file.name || file.file.name || file.file.filename);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', file.postAction || '');
            return this.uploadXhr(xhr, file, form);
        },
        uploadXhr(xhr, ufile, body) {
            let file = ufile;
            const uploadId = file ? file.id : '';
            const uploadToken = this.activeUploadTokens.get(uploadId);
            // 同一文件重新激活后，旧请求不能更新新一轮上传。
            const isCurrentUpload = () => this.activeUploadTokens.get(uploadId) === uploadToken;
            let speedLoaded = 0;
            let lastTransferSpeed = 0;
            const speedometer = new UploadSpeedometer();
            xhr.upload.onloadstart = () => {
                speedometer.start();
            };
            // 进度条
            xhr.upload.onprogress = (e) => {
                // 还未开始上传 已删除 未激活
                if (!file || !isCurrentUpload()) {
                    return;
                }
                file = this.get(file);
                if (!e.lengthComputable || !file || !file.fileObject || !file.active) {
                    return;
                }
                const transferred = Math.max(0, e.loaded - speedLoaded);
                speedLoaded = e.loaded;
                lastTransferSpeed = speedometer.add(transferred);
                const data = {
                    progress: (e.loaded / e.total * 100).toFixed(2),
                };
                if (speedometer.shouldPublish()) {
                    data.speed = lastTransferSpeed;
                }
                file = this.update(file, data);
            };
            // 检查激活状态
            let interval = window.setInterval(() => {
                if (file && isCurrentUpload()) {
                    if ((file = this.get(file))) {
                        if (file?.fileObject && !file.success && !file.error && file.active) {
                            return;
                        }
                    }
                }
                if (interval) {
                    clearInterval(interval);
                    interval = undefined;
                }
                try {
                    xhr.abort();
                    xhr.timeout = 1;
                }
                catch (e) {
                }
            }, 100);
            return new Promise((resolve, reject) => {
                const stopInterval = () => {
                    if (interval) {
                        clearInterval(interval);
                        interval = undefined;
                    }
                };
                if (!file) {
                    stopInterval();
                    reject(new Error('not_exists'));
                    return;
                }
                let complete;
                const fn = (e) => {
                    // 已经处理过了
                    if (complete) {
                        return;
                    }
                    complete = true;
                    stopInterval();
                    if (!file) {
                        return reject(new Error('not_exists'));
                    }
                    file = this.get(file);
                    // 不存在直接响应
                    if (!file) {
                        return reject(new Error('not_exists'));
                    }
                    if (!isCurrentUpload()) {
                        return reject(new Error('abort'));
                    }
                    // 不是文件对象
                    if (!file.fileObject) {
                        return reject(new Error('file_object'));
                    }
                    // 有错误自动响应
                    if (file.error) {
                        if (file.error instanceof Error) {
                            return reject(file.error);
                        }
                        return reject(new Error(file.error));
                    }
                    // 未激活
                    if (!file.active) {
                        return reject(new Error('abort'));
                    }
                    // 已完成 直接相应
                    if (file.success) {
                        return resolve(file);
                    }
                    const data = { speed: lastTransferSpeed || file.speed || 0 };
                    switch (e.type) {
                        case 'timeout':
                        case 'abort':
                            data.error = e.type;
                            break;
                        case 'error':
                            if (!xhr.status) {
                                data.error = 'network';
                            }
                            else if (xhr.status >= 500) {
                                data.error = 'server';
                            }
                            else if (xhr.status >= 400) {
                                data.error = 'denied';
                            }
                            else {
                                data.error = 'server';
                            }
                            break;
                        default:
                            if (!xhr.status) {
                                data.error = 'network';
                            }
                            else if (xhr.status >= 500) {
                                data.error = 'server';
                            }
                            else if (xhr.status >= 400) {
                                data.error = 'denied';
                            }
                            else if (xhr.status < 200 || xhr.status >= 300) {
                                data.error = 'server';
                            }
                            else {
                                data.progress = '100.00';
                            }
                    }
                    if (xhr.responseText) {
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType && /(?:\/|\+)json(?:;|$)/i.test(contentType)) {
                            try {
                                data.response = JSON.parse(xhr.responseText);
                            }
                            catch {
                                data.response = xhr.responseText;
                            }
                        }
                        else {
                            data.response = xhr.responseText;
                        }
                    }
                    // 更新
                    // @ts-ignore
                    file = this.update(file, data);
                    if (!file) {
                        return reject(new Error('abort'));
                    }
                    // 有错误自动响应
                    if (file.error) {
                        if (file.error instanceof Error) {
                            return reject(file.error);
                        }
                        return reject(new Error(file.error));
                    }
                    // 响应
                    return resolve(file);
                };
                // 事件
                xhr.onload = fn;
                xhr.onerror = fn;
                xhr.onabort = fn;
                xhr.ontimeout = fn;
                // 超时
                if (file.timeout) {
                    xhr.timeout = file.timeout;
                }
                // headers
                try {
                    for (const key in file.headers) {
                        xhr.setRequestHeader(key, file.headers[key]);
                    }
                    // 更新 xhr
                    // @ts-ignore
                    file = this.update(file, { xhr });
                    // 开始上传
                    if (!file || !isCurrentUpload()) {
                        stopInterval();
                        reject(new Error('abort'));
                        return;
                    }
                    xhr.send(body);
                }
                catch (error) {
                    stopInterval();
                    reject(error instanceof Error ? error : new Error(String(error)));
                }
            });
        },
        uploadHtml4(ufile) {
            let file = ufile;
            if (!file) {
                return Promise.reject(new Error('not_exists'));
            }
            const onKeydown = function (e) {
                if (e.keyCode === 27) {
                    e.preventDefault();
                }
            };
            const iframe = document.createElement('iframe');
            iframe.id = 'upload-iframe-' + file.id;
            iframe.name = 'upload-iframe-' + file.id;
            iframe.src = 'about:blank';
            iframe.setAttribute('style', 'width:1px;height:1px;top:-999em;position:absolute; margin-top:-999em;');
            const form = document.createElement('form');
            form.setAttribute('action', file.postAction || '');
            form.name = 'upload-form-' + file.id;
            form.setAttribute('method', 'POST');
            form.setAttribute('target', 'upload-iframe-' + file.id);
            form.setAttribute('enctype', 'multipart/form-data');
            for (const key in file.data) {
                let value = file.data[key];
                if (value && typeof value === 'object' && typeof value.toString !== 'function') {
                    value = JSON.stringify(value);
                }
                if (value !== null && value !== undefined) {
                    const el = document.createElement('input');
                    el.type = 'hidden';
                    el.name = key;
                    el.value = value;
                    form.appendChild(el);
                }
            }
            form.appendChild(file.el);
            document.body.appendChild(iframe).appendChild(form);
            const getResponseData = function () {
                let doc;
                try {
                    if (iframe.contentWindow) {
                        doc = iframe.contentWindow.document;
                    }
                }
                catch (err) {
                }
                if (!doc) {
                    try {
                        // @ts-ignore
                        doc = iframe.contentDocument ? iframe.contentDocument : iframe.document;
                    }
                    catch (err) {
                        // @ts-ignore
                        doc = iframe.document;
                    }
                }
                // @ts-ignore
                if (doc?.body) {
                    return doc.body.innerHTML;
                }
                return null;
            };
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (!file) {
                        reject(new Error('not_exists'));
                        return;
                    }
                    file = this.update(file, { iframe });
                    // 不存在
                    if (!file) {
                        return reject(new Error('not_exists'));
                    }
                    // 定时检查
                    let interval = window.setInterval(() => {
                        if (file) {
                            if ((file = this.get(file))) {
                                if (file.fileObject && !file.success && !file.error && file.active) {
                                    return;
                                }
                            }
                        }
                        if (interval) {
                            clearInterval(interval);
                            interval = undefined;
                        }
                        // @ts-ignore
                        iframe.onabort({ type: file ? 'abort' : 'not_exists' });
                    }, 100);
                    let complete;
                    const fn = (e) => {
                        // 已经处理过了
                        if (complete) {
                            return;
                        }
                        complete = true;
                        if (interval) {
                            clearInterval(interval);
                            interval = undefined;
                        }
                        // 关闭 esc 事件
                        document.body.removeEventListener('keydown', onKeydown);
                        if (!file) {
                            return reject(new Error('not_exists'));
                        }
                        file = this.get(file);
                        // 不存在直接响应
                        if (!file) {
                            return reject(new Error('not_exists'));
                        }
                        // 不是文件对象
                        if (!file.fileObject) {
                            return reject(new Error('file_object'));
                        }
                        // 有错误自动响应
                        if (file.error) {
                            if (file.error instanceof Error) {
                                return reject(file.error);
                            }
                            return reject(new Error(file.error));
                        }
                        // 未激活
                        if (!file.active) {
                            return reject(new Error('abort'));
                        }
                        // 已完成 直接相应
                        if (file.success) {
                            return resolve(file);
                        }
                        let response = getResponseData();
                        const data = {};
                        if (typeof e === 'string') {
                            return reject(new Error(e));
                        }
                        switch (e.type) {
                            case 'abort':
                                data.error = 'abort';
                                break;
                            case 'error':
                                if (file.error) {
                                    data.error = file.error;
                                }
                                else if (response === null) {
                                    data.error = 'network';
                                }
                                else {
                                    data.error = 'denied';
                                }
                                break;
                            default:
                                if (file.error) {
                                    data.error = file.error;
                                }
                                else if (response === null) {
                                    data.error = 'network';
                                }
                                else {
                                    data.progress = '100.00';
                                }
                        }
                        if (response !== null) {
                            if (response && response.substr(0, 1) === '{' && response.substr(response.length - 1, 1) === '}') {
                                try {
                                    response = JSON.parse(response);
                                }
                                catch (err) {
                                }
                            }
                            data.response = response;
                        }
                        // 更新
                        file = this.update(file, data);
                        if (!file) {
                            return reject(new Error('not_exists'));
                        }
                        if (file?.error) {
                            if (file.error instanceof Error) {
                                return reject(file.error);
                            }
                            return reject(new Error(file.error));
                        }
                        // 响应
                        return resolve(file);
                    };
                    // 添加事件
                    iframe.onload = fn;
                    iframe.onerror = fn;
                    iframe.onabort = fn;
                    // 禁止 esc 键
                    document.body.addEventListener('keydown', onKeydown);
                    // 提交
                    form.submit();
                }, 50);
            }).then(function (res) {
                iframe?.parentNode?.removeChild(iframe);
                return res;
            }).catch(function (res) {
                iframe?.parentNode?.removeChild(iframe);
                return res;
            });
        },
        watchActive(active) {
            let file;
            let index = 0;
            while ((file = this.files[index])) {
                index++;
                if (!file.fileObject) ;
                else if (active && !this.destroy) {
                    if (this.uploading >= this.iThread || (this.uploading && !this.features.html5)) {
                        break;
                    }
                    if (!file.active && !file.error && !file.success) {
                        this.update(file, { active: true });
                    }
                }
                else {
                    if (file.active) {
                        this.update(file, { active: false });
                    }
                }
            }
            if (this.uploading === 0) {
                this.active = false;
            }
        },
        watchDrop(newDrop, oldDrop = undefined) {
            if (!this.features.drop) {
                return;
            }
            if (newDrop === oldDrop) {
                return;
            }
            // 移除挂载
            if (this.dropElement) {
                try {
                    document.removeEventListener('dragenter', this.onDocumentDragenter, false);
                    document.removeEventListener('dragleave', this.onDocumentDragleave, false);
                    document.removeEventListener('dragover', this.onDocumentDragover, false);
                    document.removeEventListener('drop', this.onDocumentDrop, false);
                    this.dropElement.removeEventListener('dragenter', this.onDragenter, false);
                    this.dropElement.removeEventListener('dragleave', this.onDragleave, false);
                    this.dropElement.removeEventListener('dragover', this.onDragover, false);
                    this.dropElement.removeEventListener('drop', this.onDrop, false);
                }
                catch (e) {
                }
            }
            let el = null;
            if (!newDrop) ;
            else if (typeof newDrop === 'string') {
                try {
                    // @ts-ignore
                    el = document.querySelector(newDrop) || this.$root.$el?.querySelector(newDrop);
                }
                catch (error) {
                    el = null;
                }
            }
            else if (newDrop === true) {
                const uploadEl = this.$el;
                const parentEl = this.$parent?.$el;
                const rootEl = this.$root?.$el;
                // Preserve the existing container when it contains the rendered upload element.
                if (parentEl?.nodeType === 1 && parentEl.contains(uploadEl)) {
                    el = parentEl;
                }
                else if (rootEl?.nodeType === 1 && rootEl.contains(uploadEl)) {
                    el = rootEl;
                }
                else {
                    // Teleport and fragment roots may not identify an ancestor in the actual DOM.
                    el = uploadEl.parentElement;
                }
            }
            else {
                el = newDrop;
            }
            this.dropElement = el;
            if (!this.dropElement) {
                this.dropActive = false;
                this.dropElementActive = false;
                this.watchDropActive(false);
            }
            if (this.dropElement) {
                document.addEventListener('dragenter', this.onDocumentDragenter, false);
                document.addEventListener('dragleave', this.onDocumentDragleave, false);
                document.addEventListener('dragover', this.onDocumentDragover, false);
                document.addEventListener('drop', this.onDocumentDrop, false);
                this.dropElement.addEventListener('dragenter', this.onDragenter, false);
                this.dropElement.addEventListener('dragleave', this.onDragleave, false);
                this.dropElement.addEventListener('dragover', this.onDragover, false);
                this.dropElement.addEventListener('drop', this.onDrop, false);
            }
        },
        watchDropActive(newDropActive, oldDropActive) {
            if (newDropActive === oldDropActive) {
                return;
            }
            // 设置 dropElementActive false
            if (!newDropActive && this.dropElementActive) {
                this.dropElementActive = false;
            }
            if (this.dropTimeout) {
                clearTimeout(this.dropTimeout);
                this.dropTimeout = null;
            }
            if (newDropActive) {
                // @ts-ignore
                this.dropTimeout = setTimeout(this.onDocumentDrop, 1000);
            }
        },
        onDocumentDragenter(e) {
            if (this.disabled || this.dropActive) {
                return;
            }
            if (!e.dataTransfer) {
                return;
            }
            const dt = e.dataTransfer;
            if (dt?.files?.length) {
                this.dropActive = true;
            }
            else if (!dt.types) {
                this.dropActive = true;
            }
            else if (dt.types.indexOf && dt.types.indexOf('Files') !== -1) {
                this.dropActive = true;
                // @ts-ignore
            }
            else if (dt.types?.contains && dt.types.contains('Files')) {
                this.dropActive = true;
            }
            if (this.dropActive) {
                this.watchDropActive(true);
            }
        },
        onDocumentDragleave(e) {
            if (!this.dropActive) {
                return;
            }
            // @ts-ignore
            if (e.target === e.explicitOriginalTarget || (!e.fromElement && (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))) {
                this.dropActive = false;
                this.watchDropActive(false);
            }
        },
        onDocumentDragover() {
            if (!this.disabled && this.dropActive) {
                this.watchDropActive(true);
            }
        },
        onDocumentDrop() {
            this.dropActive = false;
            this.watchDropActive(false);
        },
        onDragenter() {
            if (this.disabled || !this.dropActive || this.dropElementActive) {
                return;
            }
            this.dropElementActive = true;
        },
        onDragleave(e) {
            if (!this.dropElementActive) {
                return;
            }
            const related = e.relatedTarget;
            if (!related) {
                this.dropElementActive = false;
            }
            else if (this.dropElement?.contains) {
                if (!this.dropElement.contains(related)) {
                    this.dropElementActive = false;
                }
            }
            else {
                let child = related;
                while (child) {
                    if (child === this.dropElement) {
                        break;
                    }
                    // @ts-ignore
                    child = child.parentNode;
                }
                if (child !== this.dropElement) {
                    this.dropElementActive = false;
                }
            }
        },
        onDragover(e) {
            if (this.disabled) {
                return;
            }
            e.preventDefault();
        },
        onDrop(e) {
            e.preventDefault();
            if (!this.disabled) {
                e.dataTransfer && this.addDataTransfer(e.dataTransfer);
            }
        },
        async inputOnChange(e) {
            if (!(e.target instanceof HTMLInputElement)) {
                return Promise.reject(new Error("not HTMLInputElement"));
            }
            const reinput = (res) => {
                this.reload = true;
                // @ts-ignore
                this.$nextTick(() => {
                    this.reload = false;
                });
                return res;
            };
            return this.addInputFile(e.target).then(reinput).catch(reinput);
        },
        isRelatedTargetSupported() {
            try {
                // 创建一个模拟的 MouseEvent
                const event = new MouseEvent('mouseout', {
                    relatedTarget: document.body
                });
                return 'relatedTarget' in event; // 检查 `relatedTarget` 属性是否存在
            }
            catch (e) {
                // 如果 MouseEvent 不受支持，或者无法设置 relatedTarget
                return false;
            }
        },
    },
});

function ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<span${ssrRenderAttrs(mergeProps({ class: _ctx.className }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<label${ssrRenderAttr("for", _ctx.forId)}></label>`);
  if (!_ctx.reload) {
    _push(`<input type="file"${
      ssrRenderAttr("name", _ctx.name)
    }${
      ssrRenderAttr("id", _ctx.forId)
    }${
      ssrRenderAttr("accept", _ctx.accept)
    }${
      ssrRenderAttr("capture", _ctx.capture)
    }${
      (ssrIncludeBooleanAttr(_ctx.disabled)) ? " disabled" : ""
    }${
      ssrRenderAttr("webkitdirectory", _ctx.iDirectory)
    }${
      ssrRenderAttr("allowdirs", _ctx.iDirectory)
    }${
      ssrRenderAttr("directory", _ctx.iDirectory)
    }${
      (ssrIncludeBooleanAttr(_ctx.multiple && _ctx.features.html5)) ? " multiple" : ""
    }>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</span>`);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.file-uploads {\n  overflow: hidden;\n  position: relative;\n  text-align: center;\n  display: inline-block;\n}\n.file-uploads.file-uploads-html4 input,\n.file-uploads.file-uploads-html5 label {\n  /* background fix ie  click */\n  background: #fff;\n  opacity: 0;\n  font-size: 20em;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.file-uploads.file-uploads-html5 input,\n.file-uploads.file-uploads-html4 label {\n  /* background fix ie  click */\n  position: absolute;\n  background: rgba(255, 255, 255, 0);\n  overflow: hidden;\n  position: fixed;\n  width: 1px;\n  height: 1px;\n  z-index: -1;\n  opacity: 0;\n}\n";
styleInject(css_248z);

script.ssrRender = ssrRender;

export { script as default };
//# sourceMappingURL=vue-upload-component.esm.ssr.js.map
