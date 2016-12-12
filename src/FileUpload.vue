<template>
    <label :class="{'file-uploads': true, 'file-uploads-html5': $mode == 'html5', 'file-uploads-html4': $mode == 'html4'}">
        <span>{{{title}}}</span>
        <input-file></input-file>
    </label>
</template>

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
export default {
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
  },

  components: {
    inputFile : {
      template: '<input type="file" :name="$parent.name" :id="$parent.id||$parent.name" :accept="$parent.accept" @change="change" :multiple="$parent.multiple && $parent.$mode == \'html5\'">',
      methods: {
        change(e) {
          this.$parent._addFileUploads(e.target);
          this.$destroy();
        },
      },
    },
  },

  data() {
    return {
      files: [],
      active: false,
      uploaded: true,
      dropActive: false,
      dropElement: false,
      request: {
        data: {},
        headers: {},
      },
    }
  },

  ready() {
    this._drop(this.drop);
  },


  init() {
    var input = document.createElement('input');
    input.type = 'file';
    if (window.FormData && input.files)  {
      this.$mode = 'html5';
    } else {
      this.$mode = 'html4';
    }
    this._index = 0;
    this._dropActive = 0;
    this._files = {};
  },


  beforeDestroy() {
    this.active = false;
    this.files = [];
  },

  watch: {
    drop(value) {
      this._drop(value);
    },
    files(files) {
      var ids = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.errno && !file.success) {
          this.uploaded = false;
        }
        ids.push(file.id);
      }
      for (var id in this._files) {
        if (ids.indexOf(id) != -1) {
          continue;
        }


        var file = this._files[id]._file;

        file.removed = true;
        var xhr = this._files[id].xhr;
        if (xhr) {
          try {
            xhr.abort();
            xhr.timeout = 1;
          } catch (e) {

          }
        }
        var iframe = this._files[id].iframe;
        if (iframe) {
          iframe.onabort({type:'abort'});
        }
        delete this._files[id];
        this._uploadEvents('removeFileUpload', file);
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

    _uploadEvents(name, file) {
      this.$dispatch && this.$dispatch(name, file, this);
      this[name] && this[name](file);
      this.events && this.events[name] && this.events[name](file, this);
    },

    _drop(value) {
      if (this.dropElement && this.$mode === 'html5') {
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
      if (this.dropElement && this.$mode === 'html5') {
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

    _addFileUpload(hiddenData, file) {
      var defaultFile = {
        size:-1,
        name: 'Filename',
        progress: '0.00',
        speed: 0,
        active: false,
        error: '',
        errno: '',
        success: false,
        data: {},
        request: {
          headers:{},
          data:{}
        }
      };
      for (let key in defaultFile) {
        if (typeof file[key] == 'undefined') {
          file[key] = defaultFile[key];
        }
      }
      if (!file.id) {
        file.id = Math.random().toString(36).substr(2);
      }

      if (!this.multiple) {
        this.clear();
      }

      this._files[file.id] = hiddenData;
      file = this.files[this.files.push(file) - 1];
      this._files[file.id]._file = file;
      this._uploadEvents('addFileUpload', file);
    },
    _onDrop(e) {
      this._dropActive = 0;
      this.dropActive = false;
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          let file = e.dataTransfer.files[i];
          this._addFileUpload({file:file}, {size:file.size, name: file.name});
          if (!this.multiple) {
            break;
          }
        }
      }
    },

    _addFileUploads(el) {
      var Component = this.$options.components.inputFile;
      new Component({
        parent: this,
        el: el,
      });
      this.uploaded = false;


      if (el.files) {
        for (let i = 0; i < el.files.length; i++) {
          let file = el.files[i];
          this._addFileUpload({file:file, el:el}, {size:file.size, name: file.name});
        }
      } else {
        this._addFileUpload({el:el}, {size: -1, name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1')});
      }
    },

    _fileUploads() {
      if (!this.active) {
        return;
      }
      for (; this._index < this.files.length; this._index++) {
        var file = this.files[this._index];
        if (file.active || file.success || file.errno) {
          continue;
        }
        if (this.size && this.size > 0 && file.size >= 0 && file.size > this.size) {
          file.error = 'Size';
          file.errno = 'size';
          continue;
        }

        if (this.extensions && (this.extensions.length || typeof this.extensions.length == 'undefined')) {
          var extensions = this.extensions;
          if (typeof extensions == 'object' && extensions instanceof RegExp) {

          } else {
            if (typeof extensions == 'string') {
              extensions = extensions.split(',').map(function(value) {
                return value.trim();
              }).filter(function(value) {
                return value;
              });
            }
            extensions = new RegExp('\\.('+ extensions.join('|').replace(/\./g, '\\.') +')$', 'i');
          }

          if (file.name.search(extensions) == -1) {
            file.error = 'Extension';
            file.errno = 'extension';
            continue;
          }
        }

        if (this.$mode == 'html5') {
          if (this.putAction || file.putAction) {
            this._fileUploadPut(file);
          } else if (this.postAction || file.postAction) {
            this._fileUploadHtml5(file);
          } else {
            file.error = 'Not Support';
            file.errno = 'not_support';
            continue;
          }
        } else {
          if (this.postAction || file.postAction) {
            this._fileUploadHtml4(file);
          } else {
            file.error = 'Not Support';
            file.errno = 'not_support';
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
      var hiddenData = this._files[file.id];
      var fileUploads = false;
      var speedTime = 0;
      var speedLoaded = 0;
      xhr.upload.onprogress = function(e) {
        if (file.removed) {
          xhr.abort();
          return;
        }
        if (!_self.active || !file.active) {
          xhr.abort();
          return;
        }
        if (e.lengthComputable) {
          file.progress = (e.loaded / e.total * 100).toFixed(2);
          var speedTime2 = Math.round(Date.now() / 1000);
          if (speedTime2 != speedTime) {
            file.speed = e.loaded - speedLoaded;
            speedLoaded = e.loaded;
            speedTime = speedTime2;
          }
        }
        _self._uploadEvents('fileUploadProgress', file);
      };


      var callback = function(e) {
        switch (e.type) {
          case 'timeout':
            file.errno = 'timeout';
            file.error = 'Timeout';
            break;
          case 'abort':
            file.errno = 'abort';
            file.error = 'Abort';
            break;
          case 'error':
            if (!xhr.status) {
              file.errno = 'network';
              file.error = 'Network';
            } else if(xhr.status >= 500) {
              file.errno = 'server';
              file.error = 'Server';
            } else if (xhr.status >= 400) {
              file.errno = 'denied';
              file.error = 'Denied';
            }
            break;
          default:
            if(xhr.status >= 500) {
              file.errno = 'server';
              file.error = 'Server';
            } else if (xhr.status >= 400) {
              file.errno = 'denied';
              file.error = 'Denied';
            } else {
              file.progress = '100.00';
              file.success = true;
            }
          }
          file.active = false;
          if (xhr.responseText) {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (contentType && contentType.indexOf('/json') != -1) {
              file.data = JSON.parse(xhr.responseText);
            } else {
              file.data = xhr.responseText;
            }
          }
          if (!fileUploads) {
            fileUploads = true;
            if (!file.removed) {
              _self._uploadEvents('afterFileUpload', file);
            }
            setTimeout(function() {
              _self._fileUploads();
            }, 50);
          }
      };

      xhr.onload = callback;
      xhr.onerror = callback;
      xhr.onabort = callback;
      xhr.ontimeout = callback;


      if (this.timeout) {
        xhr.timeout = this.timeout;
      }


      xhr.onload = callback;
      xhr.onerror = callback;
      xhr.onabort = callback;
      xhr.ontimeout = callback;

      if (this.timeout) {
        xhr.timeout = this.timeout;
      }

      // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      for (var key in this.request.headers) {
        xhr.setRequestHeader(key, this.request.headers[key]);
      }
      for (var key in file.request.headers) {
        xhr.setRequestHeader(key, file.request.headers[key]);
      }


      xhr.send(data);
      file.active = true;
      hiddenData.xhr = xhr;
      var interval = setInterval(function() {
        if (!_self.active || !file.active || file.success || file.errno) {
          clearInterval(interval);
          if (!file.success && !file.errno) {
              xhr.abort();
          }
        }
      }, 100);
      this._uploadEvents('beforeFileUpload', file);
    },
    _fileUploadPut(file) {
        var _self = this;

        var querys = {};
        for (let key in this.request.data) {
          querys[key] = this.request.data[key];
        }
        for (let key in file.request.data) {
          querys[key] = file.request.data[key];
        }
        var queryArray = [];
        for (let key in querys) {
          if (querys[key] !== null && typeof querys[key] !== 'undefined') {
            queryArray.push(encodeURIComponent(key)  + '=' + encodeURIComponent(querys[key]));
          }
        }
        var queryString = queryArray.length ? '?' + queryArray.join('&')  : '';

        var xhr = new XMLHttpRequest();
        xhr.open('PUT', (file.putAction || this.putAction) + queryString);
        this._fileUploadXhr(xhr, file, this._files[file.id].file);
    },



    _fileUploadHtml5(file) {
      var form = new window.FormData();
      form.append(this.name, this._files[file.id].file);
      for (var key in this.request.data) {
        form.append(key, this.request.data[key]);
      }

      for (var key in file.request.data) {
        form.append(key, file.request.data[key]);
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', file.postAction || this.postAction);
      this._fileUploadXhr(xhr, file, form);
    },

    _fileUploadHtml4(file) {
      var _self = this;
      var hiddenData = this._files[file.id];

      var fileUploads = false;



      var keydown = function(e) {
        if (e.keyCode == 27) {
          e.preventDefault();
        }
      };

      var iframe = document.createElement('iframe');
      iframe.id = 'upload-iframe-' + file.id;
      iframe.name = 'upload-iframe-' + file.id;
      iframe.src = 'about:blank';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.position = 'absolute';
      iframe.style.marginTop = '-9999em';


      var form = document.createElement('form');
      form.action = file.postAction || this.postAction;
      form.name = 'upload-form-' + file.id;
      form.setAttribute('method', 'POST');
      form.setAttribute('target', 'upload-iframe-' + file.id);
      form.setAttribute('enctype', 'multipart/form-data');
      form.appendChild(hiddenData.el);
      for (var key in this.request.data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name =  key;
        input.value = this.request.data[key];
        form.appendChild(input);
      }

      for (var key in file.request.data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name =  key;
        input.value = file.request.data[key];
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
            file.errno = 'abort';
            file.error = 'Abort';
            break;
          case 'error':
            var data = getDocumentData();
            if (file.errno) {

            } else if (data === null) {
              file.errno = 'network';
              file.error = 'Network';
            } else {
              file.errno = 'denied';
              file.error = 'Denied';
            }
            break;
          default:
              var data = getDocumentData();
              if (file.errno) {

              } else if (data === null) {
                file.errno = 'network';
                file.error = 'Network';
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
          if (!fileUploads) {
            document.body.removeEventListener('keydown', keydown);
            document.body.removeEventListener('keydown', keydown);
            fileUploads = true;
            iframe.parentNode && iframe.parentNode.removeChild(iframe);
            if (!file.removed) {
              _self._uploadEvents('afterFileUpload', file);
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

        hiddenData.iframe = iframe;

        document.body.addEventListener('keydown', keydown);
        var interval = setInterval(function() {
          if (!_self.active || !file.active || file.success || file.errno) {
            clearInterval(interval);
            if (!file.success && !file.errno) {
              iframe.onabort({type:'abort'});
            }
          }
        }, 50);
        _self._uploadEvents('beforeFileUpload', file);
      }, 10);
    },
  }
}
</script>
