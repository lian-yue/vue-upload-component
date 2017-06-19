<template>
  <label class="file-uploads" :class="'file-uploads-' + mode">
    <input-file></input-file>
    <slot></slot>
  </label>
</template>
<style>
.file-uploads {
  overflow: hidden;
  position: relative;
  text-align: center;
  display: inline-block;
}
.file-uploads.file-uploads-html4 input[type="file"]{
  opacity: 0;
  font-size: 20em;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.file-uploads.file-uploads-html5 input[type="file"] {
  overflow: hidden;
  position: fixed;
  width: 1px;
  height: 1px;
  top: -99em;
}
</style>
<script>
import InputFile from './InputFile.vue'
export default {
  components: {
    InputFile,
  },
  props: {
    name: {
      type: String,
      default: 'file',
    },
    drop: {
      default: false,
    },

    dropDirectory: {
      default: true,
    },

    extensions: {
      default: Array,
    },

    postAction: {
      type: String,
    },

    putAction: {
      type: String,
    },

    accept: {
      type: String,
    },

    multiple: {
      type: Boolean,
    },

    directory: {
      type: Boolean,
    },

    timeout: {
      type: Number,
      default: 0,
    },

    size: {
      type: Number,
    },
    headers: {
      type: Object,
      default: Object,
    },

    filter: {
      type: Function,
      default(file) {
        return file
      }
    },

    data: {
      type: Object,
      default: Object,
    },

    value: {
      type: Array,
      default: Array,
    },

    thread: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      mode: 'html5',
      input: false,
      active: false,
      dropActive: false,
      destroy: false,
      files: [],
    }
  },


  // 挂载后
  mounted() {
    var input = document.createElement('input')
    input.type = 'file'
    if (window.FormData && input.files)  {
      this.mode = 'html5'
    } else {
      this.mode = 'html4'
    }

    this._maps = {}

    this.$parent.$forceUpdate()
    this.$nextTick(() => {
      this.watchDrop(this.drop)
    })
  },

  // 销毁前
  beforeDestroy() {
    this.destroy = true
    this.active = false
  },

  computed: {
    uploading() {
      var uploading = 0
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].active) {
          uploading++
        }
      }
      return uploading
    },

    uploaded() {
      var file
      for (var i = 0; i < this.files.length; i++) {
        file = this.files[i]
        if (!file.error && !file.success) {
          return false
        }
      }
      return true
    },
  },


  watch: {
    active(active) {
      this.watchActive(active)
    },

    dropActive() {
      this.$parent.$forceUpdate()
    },
    value(value) {
      if (this.files != value && !this.input) {
        this.files = value
      }
    },

    files(files, oldFiles) {
      this._oldFiles = oldFiles
      var idMaps = {}
      for (var i = 0; i < files.length; i++) {
        let file = files[i]
        let old = this._maps[file.id]

        idMaps[file.id] = true

        if (!old || old != file) {
          this.$emit('input-file', file, old)
          this._maps[file.id] = file
          if (file.active && (!old || !old.active)) {
            this.upload(file).then(() => {
              this.update(file, {active: false, success: true})
            }).catch((e) => {
              this.update(file, {active: false, success: false, error: e.code || e.error || e.message})
            })
          } else if (!file.active && !file.error && !file.success && old && old.active) {
            this.update(file, {error: 'abort'})
          }
        }
      }

      // 删除
      for (var id in this._maps) {
        if (idMaps[id]) {
          continue
        }
        var old = this._maps[id]
        delete this._maps[id]
        this.$emit('input-file', undefined, old)
      }
      this.input = true
      this.$emit('input', files)
      this.$nextTick(() => {
        this.input = false
      })
      if (this.active) {
        this.watchActive(true)
      }
    },
    drop(value) {
      this.watchDrop(value)
    },
  },

  methods: {

    // 清空
    clear() {
      if (this.files.length) {
        this.files = []
      }
      return true
    },

    // 选择
    get(file) {
      if (typeof file == 'object') {
        var index = this.files.indexOf(file)
        if (index != -1) {
          return file
        }
        if (!file.id) {
          return false
        }
        file = file.id
      }

      if (this._maps[file]) {
        return this._maps[file]
      }

      if (!file) {
        return false
      }

      var id = file
      for (var i = 0; i < this.files.length; i++) {
        file = this.files[i]
        if (file.id == id) {
          return file
        }
      }
      return false
    },

    // 添加
    add(file, start) {
      if (this.mode == 'html5' && file instanceof File) {
        file = {
          file,
          size: file.size,
          name: file.webkitRelativePath || file.name,
          type: file.type,
        }
      }

      file = {
        size: -1,                // 只读
        name: 'Filename',        // 只读
        type: '',                // 只读
        progress: '0.00',        // 只读
        speed: 0,                // 只读
        active: false,           // 读写
        error: '',               // 读写
        success: false,          // 读写
        putAction: this.putAction,   // 读写
        postAction: this.postAction, // 读写
        timeout: this.timeout,       // 读写

        ...file,

        response: {},                // 读写

        xhr: false,                // 只读
        iframe: false,             // 只读
      }
      file.data = {
        ...this.data,
        ...file.data ? file.data : {},
      }

      file.headers = {
        ...this.headers,
        ...file.headers ? file.headers : {},
      }


      if (!file.id) {
        file.id = Math.random().toString(36).substr(2)
      }
      if (!this.multiple) {
        this.clear()
      }
      var files = this.files.concat([])
      if (start) {
        files.unshift(file)
      } else {
        files.push(file)
      }
      this.files = files
      return file
    },

    // 移除
    remove(file) {
      file = this.get(file)
      if (file) {
        var files = this.files.concat([])
        files.splice(files.indexOf(file), 1)
        this.files = files
      }
      return file
    },

    // 更新
    update(file, data) {
      file = this.get(file)
      if (file) {
        var newFile = {...file, ...data}
        var files = this.files.concat([])
        files.splice(files.indexOf(file), 1, newFile)
        this.files = files
        return newFile
      }
      return false
    },

    // 添加表单文件
    addInputFile(el) {
      if (el.files) {
        for (let i = 0; i < el.files.length; i++) {
          let file = el.files[i]
          this.add({
            size: file.size,
            name: file.webkitRelativePath || file.name,
            type: file.type,
            file,
            el
          })
        }
      } else {
        this.add({
          name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'),
          el,
        })
      }

      var Component = this.$options.components.InputFile

      // vue 2.0.0  = Component
      // vue 2.0.x  = Component._Ctor
      // vue 2.1.x = Component._Ctor[0]
      if (!Component._Ctor) {

      } else if (typeof Component._Ctor == 'function') {  ///... 蠢死我 没加 typeof
        Component = Component._Ctor
      } else {
        Component = Component._Ctor[0]
      }

      var inputFile = new Component({
        parent: this,
        el,
      })
    },

    // 添加 entry
    addEntry(entry, path = '') {
      if (entry.isFile) {
        entry.file((file) => {
          this.add({
            size: file.size,
            name: path + file.name,
            type: file.type,
            file,
          })
        });
        return 1
      } else if (entry.isDirectory && this.dropDirectory) {
        var count =  0
        entry.createReader().readEntries((entrys) => {
          for (var i = 0; i < entrys.length; i++) {
            count += this.addEntry(entrys[i], path + entry.name + '/')
            if (count && !this.multiple) {
              break
            }
          }
        })
        return count
      }
      return 0
    },


    // 上传
    upload(file) {
      if (!(file = this.get(file))) {
        return Promise.reject(new Error('not_exists'))
      }

      // 重置上传数据
      if (file.error || file.success) {
        file = this.update(file, {error: '', success: false})
      }

      // 后缀
      var extensions = this.extensions
      if (extensions && (extensions.length || typeof extensions.length == 'undefined')) {
        if (typeof extensions != 'object' || !(extensions instanceof RegExp)) {
          if (typeof extensions == 'string') {
            extensions = extensions.split(',').map(value => value.trim()).filter(value => value)
          }
          extensions = new RegExp('\\.('+ extensions.join('|').replace(/\./g, '\\.') +')$', 'i')
        }
        if (file.name.search(extensions) == -1) {
          return Promise.reject(new Error('extension'))
        }
      }


      // 大小
      if (this.size > 0 && file.size >= 0 && file.size > this.size) {
        return Promise.reject(new Error('size'))
      }


      // 过滤器
      file = this.filter(file) || this.get(file)

      // 被过滤掉
      if (!file || file.error || file.success) {
        return Promise.reject(new Error(file ? file.error : 'not_exists'))
      }

      if (this.mode == 'html5' && file.putAction) {
        return this.uploadPut(file)
      } else if (this.mode == 'html5') {
        return this.uploadHtml5(file)
      } else {
        return this.uploadHtml4(file)
      }
    },

    uploadPut(file) {
      var querys = []
      var value
      for (var key in file.data) {
        value = file.data[key]
        if (value !== null && value !== undefined) {
          querys.push(encodeURIComponent(key)  + '=' + encodeURIComponent(value))
        }
      }
      var queryString = querys.length ? (file.putAction.indexOf('?') == -1 ? '?' : '&') + querys.join('&')  : ''
      var xhr = new XMLHttpRequest()
      xhr.open('PUT', file.putAction + queryString)
      return this.uploadXhr(xhr, file, file.file)
    },

    uploadHtml5(file) {
      var form = new window.FormData()
      var value
      for (var key in file.data) {
        value = file.data[key]
        if (value && typeof value == 'object' && typeof value.toString != 'function') {
          form.append(key, JSON.stringify(value))
        } else if (value !== null && value !== undefined) {
          form.append(key, value)
        }
      }
      form.append(this.name, file.file)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', file.postAction)
      return this.uploadXhr(xhr, file, form)
    },

    uploadXhr(xhr, file, data) {
      var self = this

      var speedTime = 0
      var speedLoaded = 0

      xhr.upload.onprogress = function(e) {
        // 还未开始上传 已删除  未激活
        if (!e.lengthComputable || !(file = self.get(file))) {
          return
        }

        // 进度 速度 每秒更新一次
        var speedTime2 = Math.round(Date.now() / 1000)
        if (speedTime2 == speedTime) {
          return
        }
        speedTime = speedTime2


        file = self.update(file, {
          progress: (e.loaded / e.total * 100).toFixed(2),
          speed: e.loaded - speedLoaded,
        })
        speedLoaded = e.loaded
      }

      // 检查激活状态
      var interval = setInterval(function() {
        if (!(file = self.get(file)) || file.success || file.error) {
          if (interval) {
            clearInterval(interval)
            interval = false
          }
          if (!file || file.error) {
            try {
              xhr.abort()
              xhr.timeout =1
            } catch (e) {
            }
          }
        }
      }, 50);

      return new Promise(function(resolve, reject) {
        var complete
        var fn = function(e) {
          // 已经处理过了
          if (complete) {
            return
          }
          complete = true
          if (interval) {
            clearInterval(interval)
            interval = false
          }

          // 不存在直接响应
          if (!(file = self.get(file))) {
            return reject(new Error('not_exists'))
          }

          // 有错误自动响应
          if (file.error) {
            return reject(new Error(file.error))
          }

          var data = {}

          switch (e.type) {
            case 'timeout':
            case 'abort':
              data.error = e.type
              break
            case 'error':
              if (!xhr.status) {
                data.error = 'network'
              } else if(xhr.status >= 500) {
                data.error = 'server'
              } else if (xhr.status >= 400) {
                data.error = 'denied'
              }
              break
            default:
              if(xhr.status >= 500) {
                data.error = 'server'
              } else if (xhr.status >= 400) {
                data.error = 'denied'
              } else {
                data.progress = '100.00'
              }
          }

          if (xhr.responseText) {
            var contentType = xhr.getResponseHeader('Content-Type')
            if (contentType && contentType.indexOf('/json') != -1) {
              data.response = JSON.parse(xhr.responseText)
            } else {
              data.response = xhr.responseText
            }
          }

          // 更新
          file = self.update(file, data)

          if (file.error) {
            return reject(new Error(file.error))
          }

          // 响应
          return resolve(file)
        }

        // 事件
        xhr.onload = fn
        xhr.onerror = fn
        xhr.onabort = fn
        xhr.ontimeout = fn

        // 超时
        if (file.timeout) {
          xhr.timeout = file.timeout
        }

        // headers
        for (let key in file.headers) {
          xhr.setRequestHeader(key, file.headers[key])
        }

        // 更新 xhr
        file = self.update(file, {xhr})

        // 开始上传
        xhr.send(data)
      })
    },




    uploadHtml4(file) {
      var self = this
      var onKeydown = function(e) {
        if (e.keyCode == 27) {
          e.preventDefault()
        }
      };

      var iframe = document.createElement('iframe')
      iframe.id = 'upload-iframe-' + file.id
      iframe.name = 'upload-iframe-' + file.id
      iframe.src = 'about:blank'
      iframe.setAttribute('style', 'width:1px;height:1px;top:-999em;position:absolute; margin-top:-999em;')


      var form = document.createElement('form')

      form.action = file.postAction

      form.name = 'upload-form-' + file.id


      form.setAttribute('method', 'POST')
      form.setAttribute('target', 'upload-iframe-' + file.id)
      form.setAttribute('enctype', 'multipart/form-data')

      var value
      var input
      for (var key in file.data) {
        value = file.data[key]
        if (value && typeof value == 'object' && typeof value.toString != 'function') {
          value = JSON.stringify(value)
        }
        if (value !== null && value !== undefined) {
          input = document.createElement('input')
          input.type = 'hidden'
          input.name =  key
          form.appendChild(input)
        }
      }
      form.appendChild(file.el)

      document.body.appendChild(iframe).appendChild(form)





      var getResponseData = function() {
        var doc;
        try {
          if (iframe.contentWindow) {
            doc = iframe.contentWindow.document;
          }
        } catch(err) {
        }
        if (!doc) {
          try {
            doc = iframe.contentDocument ? iframe.contentDocument : iframe.document;
          } catch(err) {
            doc = iframe.document;
          }
        }
        if (doc && doc.body) {
          return doc.body.innerHTML;
        }
        return null;
      }


      return new Promise(function(resolve, reject) {
        setTimeout(function() {

          // 不存在
          if (!(file = self.update(file, {iframe}))) {
            return reject(new Error('not_exists'))
          }

          // 定时检查
          var interval = setInterval(function() {
            if (!(file = self.get(file)) || file.success || file.error) {
              if (interval) {
                clearInterval(interval)
                interval = false
              }

              if (!file || file.error) {
                iframe.onabort({type:file ? 'abort' : 'not_exists'})
              }
            }
          }, 50)


          var complete
          var fn = function(e) {
            // 已经处理过了
            if (complete) {
              return
            }
            complete = true


            if (interval) {
              clearInterval(interval)
              interval = false
            }

            // 关闭 esc 事件
            document.body.removeEventListener('keydown', onKeydown)

            // 移除
            iframe.parentNode && iframe.parentNode.removeChild(iframe)

            // 不存在直接响应
            if (!(file = self.get(file))) {
              return reject(new Error('not_exists'))
            }

            // 有错误自动响应
            if (file.error) {
              return reject(new Error(file.error))
            }

            var response = getResponseData()
            var data = {}
            switch (e.type) {
              case 'abort':
                data.error = 'abort'
                break
              case 'error':
                if (file.error) {
                  data.error = file.error
                } else if (response === null) {
                  data.error = 'network'
                } else {
                  data.error = 'denied'
                }
                break
              default:
                if (file.error) {
                  data.error = file.error
                } else if (data === null) {
                  data.error = 'network'
                } else {
                  data.progress = '100.00'
                }
            }

            if (response !== null) {
              if (response && response.substr(0, 1) == '{' && response.substr(response.length - 1, 1) == '}') {
                try {
                  response = JSON.parse(response)
                } catch (err) {
                }
              }
              data.response = response
            }

            // 更新
            file = self.update(file, data)

            if (file.error) {
              return reject(new Error(file.error))
            }

            // 响应
            return resolve(file)
          };




          // 添加事件
          iframe.onload = fn
          iframe.onerror = fn
          iframe.onabort = fn


          // 禁止 esc 键
          document.body.addEventListener('keydown', onKeydown)

          // 提交
          form.submit()


        }, 10)
      })
    },



    watchActive(active) {
      var file
      var index = 0
      var uploading = this.uploading
      while (file = this.files[index]) {
        index++
        if (active && !this.destroy) {
          if (uploading >= this.thread) {
            break
          }
          if (!file.active && !file.error && !file.success) {
            this.update(file, {active: true})
            uploading++
          }
        } else {
          uploading = 0
          if (file.active) {
            this.update(file, {active: false})
          }
        }
      }
      if (uploading == 0) {
        this.active = false
      }
    },



    watchDrop(el) {
      if (this.mode != 'html5') {
        return
      }

      // 移除挂载
      if (this.dropElement) {
        try {
          window.document.removeEventListener('dragenter', this.onDragenter, false)
          window.document.removeEventListener('dragleave', this.onDragleave, false)
          this.dropElement.removeEventListener('dragover', this.onDragover, false)
          this.dropElement.removeEventListener('drop', this.onDrop, false)
        } catch (e) {
        }
      }

      if (!el) {
        el = false
      } else if (typeof el == 'string') {
        el = document.querySelector(el) || this.$root.$el.querySelector(el)
      } else if (el === true) {
        el = this.$parent.$el
      }

      this.dropElement = el

      if (this.dropElement) {
        window.document.addEventListener('dragenter', this.onDragenter, false)
        window.document.addEventListener('dragleave', this.onDragleave, false)
        this.dropElement.addEventListener('dragover', this.onDragover, false)
        this.dropElement.addEventListener('drop', this.onDrop, false)
      }
    },


    onDragenter(e) {
      e.preventDefault()
      if (!this.dropActive) {
        this.dropActive = true
      }
    },

    onDragleave(e) {
      e.preventDefault()
      if (e.target.nodeName == 'HTML' || (e.screenX == 0 && e.screenY == 0 && e.screenY == 0 && !e.fromElement && e.offsetX < 0)) {
        this.dropActive = false
      }
    },

    onDragover(e) {
      e.preventDefault()
    },

    onDrop(e) {
      e.preventDefault()
      this.dropActive = false
      var dataTransfer = e.dataTransfer

      if (dataTransfer.items && dataTransfer.items.length) {
        for (let i = 0; i < dataTransfer.items.length; i++) {
          let item = dataTransfer.items[i]
          if (item.getAsEntry) {
            this.addEntry(item.getAsEntry())
          } else if (item.webkitGetAsEntry) {
            this.addEntry(item.webkitGetAsEntry())
          } else {
            this.add(item.getAsFile())
          }
          if (!this.multiple) {
            break
          }
        }
      } else if (dataTransfer.files.length) {
        for (let i = 0; i < dataTransfer.files.length; i++) {
          let file = dataTransfer.files[i]
          this.add(file)
          if (!this.multiple) {
            break
          }
        }
      }
    },
  }
}
</script>
