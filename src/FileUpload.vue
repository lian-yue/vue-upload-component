<style>
.file-uploads {
    overflow: hidden;
    position: relative;
    text-align: center;
}
.file-uploads span{
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.file-uploads input{
    z-index: 1;
    opacity: 0;
    font-size: 20em;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 100%;
    height: 100%;
}
.file-uploads.file-uploads-html5 input{
    float: left;
    width: 1px !important;
    height: 1px !important;
    top:-1px !important;
    left:-1px !important;
    right:auto !important;
    bottom:auto !important;
}
</style>

<script>
import InputFile from './InputFile.vue';
export default {
  components: {
    InputFile,
  },

  props: {
    title: {
      type: String,
      default: 'Upload file',
    },
    name: {
      type: String,
      default: 'file',
    },
    drop: {
      default: false,
    },
    extensions: {
      default:  () => [],
    },
    postAction: {
      type: String,
    },
    putAction: {
      type: String,
    },
    accept: {
      type:String,
    },
    multiple: {
      type: Boolean,
    },
    timeout: {
      type: Number,
      default:0,
    },
    size: {
      type: Number,
    },
    events: {
      type: Object,
      default: () => {},
    },

    headers: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
    drop: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => [],
    },
  },


  data() {
    return {
      mode: 'html5',
      active: false,
      uploaded: true,
      dropActive: false,
    }
  },

  // 挂载后
  mounted() {
    var input = document.createElement('input');
    input.type = 'file';
    if (window.FormData && input.files)  {
      this.mode = 'html5';
    } else {
      this.mode = 'html4';
    }
    this._index = 0;
    this._files = [];
    this._dropActive = 0;
    this._drop(this.drop)
    this.$nextTick(() => {
      this._drop(this.drop)
    })
  },

  // 销毁前
  beforeDestroy() {
    this.active = false;
    this.files.splice(0, this.files.length);
  },

  render (h) {
    return (
      <label class={{
        'file-uploads': true,
        'file-uploads-html5': this.mode == 'html5',
        'file-uploads-html4': this.mode == 'html4'
      }} >
          <span>{this.title}</span>
          <input-file></input-file>
      </label>
    )
  },




  watch: {
    drop(value) {
      this._drop(value);
    },
    files(files) {
      var ids = [];
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.error && !file.success) {
          this.uploaded = false;
        }
        ids.push(file.id);
      }

      for (var id in this._files) {
        if (ids.indexOf(id) != -1) {
          continue;
        }
        let file = this._files;

        // 已移除的记录
        file.removed = true;

        // xhr abort
        var xhr = file.xhr;
        if (xhr) {
          try {
            xhr.abort();
            xhr.timeout = 1;
          } catch (e) {
          }
        }

        // iframe abort
        if (file.iframe) {
          file.iframe.onabort({type:'abort'});
        }
        delete this._files[id];
        this._uploadEvents('remove', file);
      }
      this._index = 0;
    },

    active(newValue, oldValue) {
      if (newValue && !oldValue) {
        this._fileUploads();
      }
    },

    uploaded(uploaded) {
      if (uploaded) {
        this.active = false;
      }
    },
  },

  methods: {
    clear() {
      if (this.files.length) {
        this.files.splice(0, this.files.length);
      }
    },

    addFileUpload(file) {
      this.uploaded = false;
      var defaultFile = {
        size: -1,
        name: 'Filename',
        progress: '0.00',
        speed: 0,
        active: false,
        error: '',
        success: false,
        putAction: this.putAction,
        postAction: this.postAction,
        timeout: this.timeout,
        data: Object.assign({}, this.data),
        headers: Object.assign({}, this.headers),
        response: {},

        xhr: false,
        iframe: false,
      };

      file = Object.assign(defaultFile, file)

      if (!file.id) {
        file.id = Math.random().toString(36).substr(2);
      }

      if (!this.multiple) {
        this.clear();
      }


      file = this.files[this.files.push(file) - 1];
      this._files[file.id] = file;
      this._uploadEvents('add', file);
    },

    _uploadEvents(name, file) {
      this.events && this.events[name] && this.events[name](file, this);
    },

    _drop(value) {

      // 移除挂载
      if (this.dropElement && this.mode === 'html5') {
        try {
          window.document.removeEventListener('dragenter', this._onDragenter, false);
          window.document.removeEventListener('dragleave', this._onDragleave, false);
          this.dropElement.removeEventListener('dragover', this._onDragover, false);
          this.dropElement.removeEventListener('drop', this._onDrop, false);
        } catch (e) {
        }
      }

      if (!value) {
        this.dropElement = false;
        return;
      }

      if (typeof value == 'string') {
        this.dropElement = document.querySelector(value) || this.$root.$el.querySelector(value);
      } else if (typeof value == 'boolean') {
        this.dropElement = this.$parent.$el;
      } else {
        this.dropElement = this.drop;
      }

      if (this.dropElement && this.mode === 'html5') {
        window.document.addEventListener('dragenter', this._onDragenter, false);
        window.document.addEventListener('dragleave', this._onDragleave, false);
        this.dropElement.addEventListener('dragover', this._onDragover, false);
        this.dropElement.addEventListener('drop', this._onDrop, false);
      }
    },

    _onDragenter(e) {
      this._dropActive++;
      this.dropActive = !!this._dropActive;
      e.preventDefault();
    },

    _onDragleave(e) {
      e.preventDefault();
      this._dropActive--;
      if (e.target.nodeName == 'HTML' || (e.screenX == 0 && e.screenY == 0)) {
        this.dropActive = !!this._dropActive;
      }
    },
    _onDragover(e) {
      e.preventDefault();
    },


    _onDrop(e) {
      this._dropActive = 0;
      this.dropActive = false;
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          let file = e.dataTransfer.files[i];
          this.addFileUpload({file:file, size:file.size, name: file.name});
          if (!this.multiple) {
            break;
          }
        }
      }
    },


    _addInputFileElement(el) {
      if (el.files) {
        for (let i = 0; i < el.files.length; i++) {
          let file = el.files[i];
          this.addFileUpload({size: file.size, name: file.name, file: file, el:el});
        }
      } else {
        this.addFileUpload({name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'), el:el});
      }

      var Component = this.$options.components.InputFile;

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
        el: el,
      });
    },


    _fileUploads() {
      if (!this.active) {
        return;
      }

      for (; this._index < this.files.length; this._index++) {
        var file = this.files[this._index];
        if (file.active || file.success || file.error) {
          continue;
        }


        if (this.size && this.size > 0 && file.size >= 0 && file.size > this.size) {
          file.error = 'size';
          continue;
        }


        if (this.extensions && (this.extensions.length || typeof this.extensions.length == 'undefined')) {
          var extensions = this.extensions;
          if (typeof extensions == 'object' && extensions instanceof RegExp) {

          } else {
            if (typeof extensions == 'string') {
              extensions = extensions.split(',').map((value) => value.trim()).filter(value => value);
            }
            extensions = new RegExp('\\.('+ extensions.join('|').replace(/\./g, '\\.') +')$', 'i');
          }

          if (file.name.search(extensions) == -1) {
            file.error = 'extension';
            continue;
          }
        }

        if (this.mode == 'html5') {
          if (file.putAction) {
            this._fileUploadPut(file);
          } else if (file.postAction) {
            this._fileUploadHtml5(file);
          } else {
            file.error = 'not_support';
            continue;
          }
        } else {
          if (file.postAction) {
            this._fileUploadHtml4(file);
          } else {
            file.error = 'not_support';
            continue;
          }
        }
        return;
      }

      this.active = false;
      this.uploaded = true;
    },


    _fileUploadXhr(xhr, file, data) {
      var _self = this;
      var complete = false;

      var speedTime = 0;
      var speedLoaded = 0;
      xhr.upload.onprogress = function(e) {

        // 已 移除
        if (file.removed) {
          xhr.abort();
          return;
        }

        //  终止
        if (!_self.active || !file.active) {
          xhr.abort();
          return;
        }

        // 进度
        if (e.lengthComputable) {
          file.progress = (e.loaded / e.total * 100).toFixed(2);
          var speedTime2 = Math.round(Date.now() / 1000);
          if (speedTime2 != speedTime) {
            file.speed = e.loaded - speedLoaded;
            speedLoaded = e.loaded;
            speedTime = speedTime2;
          }
        }
        _self._uploadEvents('progress', file);
      }

      var callback = function(e) {
        switch (e.type) {
          case 'timeout':
            file.error = 'timeout';
            break;
          case 'abort':
            file.error = 'abort';
            break;
          case 'error':
            if (!xhr.status) {
              file.error = 'network';
            } else if(xhr.status >= 500) {
              file.error = 'server';
            } else if (xhr.status >= 400) {
              file.error = 'denied';
            }
            break;
          default:
            if(xhr.status >= 500) {
              file.error = 'server';
            } else if (xhr.status >= 400) {
              file.error = 'denied';
            } else {
              file.progress = '100.00';
              file.success = true;
            }
        }
        file.active = false;
        if (xhr.responseText) {
          var contentType = xhr.getResponseHeader('Content-Type');
          if (contentType && contentType.indexOf('/json') != -1) {
            file.response = JSON.parse(xhr.responseText);
          } else {
            file.response = xhr.responseText;
          }
        }

        if (!complete) {
          complete = true;
          if (!file.removed) {
            _self._uploadEvents('after', file);
          }
          setTimeout(function() {
            _self._fileUploads();
          }, 50);
        }
      };

      // 事件
      xhr.onload = callback;
      xhr.onerror = callback;
      xhr.onabort = callback;
      xhr.ontimeout = callback;

      // 超时
      if (file.timeout) {
        xhr.timeout = file.timeout;
      }



      // headers
      // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      for (let key in file.headers) {
        xhr.setRequestHeader(key, file.headers[key]);
      }


      // 开始上传
      xhr.send(data);
      file.active = true;
      file.xhr = xhr

      // 定时执行检测
      var interval = setInterval(function() {
        if (!_self.active || !file.active || file.success || file.error) {
          clearInterval(interval);
          if (!file.success && !file.error) {
            xhr.abort();
          }
        }
      }, 100);

      // 开始上传
      this._uploadEvents('before', file);
    },


    _fileUploadPut(file) {
      var querys = Object.assign({}, file.data)
      var queryArray = [];
      for (let key in querys) {
        if (querys[key] !== null && typeof querys[key] !== 'undefined') {
          queryArray.push(encodeURIComponent(key)  + '=' + encodeURIComponent(querys[key]));
        }
      }
      var queryString = queryArray.length ? (file.putAction.indexOf('?') == -1 ? '?' : '&') + queryArray.join('&')  : '';
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', file.putAction + queryString);
      this._fileUploadXhr(xhr, file, file.file);
    },

    _fileUploadHtml5(file) {
      var form = new window.FormData();
      form.append(this.name, file.file);
      for (var key in file.data) {
        form.append(key, file.data[key]);
      }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', file.postAction);
      this._fileUploadXhr(xhr, file, form);
    },

    _fileUploadHtml4(file) {
      var _self = this;
      var complete = false;

      var keydown = function(e) {
        if (e.keyCode == 27) {
          e.preventDefault();
        }
      }
      var iframe = document.createElement('iframe');
      iframe.id = 'upload-iframe-' + file.id;
      iframe.name = 'upload-iframe-' + file.id;
      iframe.src = 'about:blank';
      iframe.style = {
        width: '1px',
        height: '1px',
        top: '-9999px',
        left: '-9999px',
        position: 'absolute',
        marginTop: '-9999em',
      }

      var form = document.createElement('form');

      form.action = file.postAction;

      form.name = 'upload-form-' + file.id;


      form.setAttribute('method', 'POST');
      form.setAttribute('target', 'upload-iframe-' + file.id);
      form.setAttribute('enctype', 'multipart/form-data');
      form.appendChild(file.el);

      for (let key in file.data) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name =  key;
        input.value = file[key];
        form.appendChild(input);
      }



      var getDocumentData = function() {
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




      var callback = function(e) {
        switch (e.type) {
          case 'abort':
            file.error = 'abort';
            break;
          case 'error':
            var data = getDocumentData();
            if (file.error) {
            } else if (data === null) {
              file.error = 'network';
            } else {
              file.error = 'denied';
            }
            break;
          default:
            var data = getDocumentData();
            if (file.error) {
            } else if (data === null) {
              file.error = 'network';
            } else {
              file.progress = '100.00';
              file.success = true;
            }
        }

        file.active = false;
        if (typeof data != "undefined") {
          if (data && data.substr(0, 1) == '{' && data.substr(data.length - 1, 1) == '}') {
            try {
              data = JSON.parse(data);
            } catch (err) {
            }
          }
          file.data = data;
        }
        if (!complete) {
          complete = true;
          document.body.removeEventListener('keydown', keydown);
          document.body.removeEventListener('keydown', keydown);
          iframe.parentNode && iframe.parentNode.removeChild(iframe);
          if (!file.removed) {
            _self._uploadEvents('after', file);
          }
          setTimeout(function() {
            _self._fileUploads();
          }, 50);
        }
      };



      setTimeout(function() {
        document.body.appendChild(iframe).appendChild(form).submit();
        iframe.onload = callback;
        iframe.onerror = callback;
        iframe.onabort = callback;

        file.active = true;
        file.iframe = iframe;

        document.body.addEventListener('keydown', keydown);
        var interval = setInterval(function() {
          if (!_self.active || !file.active || file.success || file.error) {
            clearInterval(interval);
            if (!file.success && !file.error) {
              iframe.onabort({type:'abort'});
            }
          }
        }, 50);
        _self._uploadEvents('before', file);
      }, 10);
    },

  }
}
</script>
