<template>
    <div>
        <label :for="id||name" :class="{'file-uploads-label': true, 'file-uploads-html5': $mode == 'html5', 'file-uploads-html4': $mode == 'html4'}">
            <span>{{title}}</span>
            <input-file></input-file>
        </label>
    </div>
</template>

<style>
    .file-uploads-label {
        overflow: hidden;
        position: relative;
        text-align: center;
    }
    .file-uploads-label span{
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
    .file-uploads-label input{
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
    .file-uploads-label.file-uploads-html5 input{
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
            required: true
        },
        id: {
            type:String,
        },
        action: {
            type: String,
            required: true
        },
        accept: {
            type:String,
        },
        multiple: {
            type:String,
        },
        timeout: {
            type: Number,
        },
        size: {
            type: Number,
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
            request: {
                data: {},
                headers: {},
            },
        }
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
        this._files = {};
    },
    watch: {
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
                    xhr.abort();
                    xhr.timeout = 1;
                }
                var iframe = this._files[id].iframe;
                if (iframe) {
                    iframe.onabort({type:'abort'});
                }
                delete this._files[id];
                this.$dispatch('removeFileUpload', file, this);
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
        _addFileUploads(el) {
            var Component = this.$options.components.inputFile;
            new Component({
                parent: this,
                el: el,
            });
            this.uploaded = false;


            if (el.files) {
                for (var i = 0; i < el.files.length; i++) {
                    var file = el.files[i];
                    var id = 'upload-file-' + Math.random().toString(36).substr(2);
                    var value = {id: id, size:file.size, name: file.name, progress: '0.00', active: false, error: '', errno: '', success: false, data: {}, request: {headers:{}, data:{}}};
                    this._files[id] = {el:el, file: file};

                    var len;
                    if (this.multiple) {
                        len = this.files.push(value);
                    } else {
                        this.files = [value];
                        len = 1;
                    }
                    this._files[id]._file = this.files[len-1];
                    this.$dispatch('addFileUpload', this.files[len-1], this);
                }
            } else {
                var id = 'upload-file-' + Math.random().toString(36).substr(2);
                var value = {id: id, size: -1, name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'), progress: '0.00', active: false, error: '', errno: '', success: false, data: {}, request: {headers:{}, data:{}}};
                this._files[id] = {el:el};
                var len;
                if (this.multiple) {
                    len = this.files.push(value);
                } else {
                    this.files = [value];
                    len = 1;
                }
                var len = this.files.push(file);
                this._files[id]._file = this.files[len-1];
                this.$dispatch('addFileUpload', this.files[len-1], this);
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

                if (this.$mode == 'html5') {
                    this._fileUploadHtml5(file);
                } else {
                    this._fileUploadHtml4(file);
                }
                return;
            }
            this.active = false;
            this.uploaded = true;
        },

        _fileUploadHtml5(file) {
            var _self = this;
            var file2 = this._files[file.id];

            var fileUploads = false;

            var form = new window.FormData();
            form.append(this.name, file2.file);
            for (var key in this.request.data) {
                form.append(key, this.request.data[key]);
            }

            for (var key in file.request.data) {
                form.append(key, file.request.data[key]);
            }

            var xhr = new XMLHttpRequest();

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
                }
                _self.$dispatch('fileUploadProgress', file, _self);
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
                        _self.$dispatch('afterFileUpload', file, _self);
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

            xhr.open('POST', this.action);

            for (var key in this.request.headers) {
                xhr.setRequestHeader(key, this.request.headers[key]);
            }

            for (var key in file.request.headers) {
                xhr.setRequestHeader(key, file.request.headers[key]);
            }


            xhr.send(form);

            file.active = true;

            file2.xhr = xhr;

            var interval = setInterval(function() {
                if (!_self.active || !file.active || file.success || file.errno) {
                    clearInterval(interval);
                    if (!file.success && !file.errno) {
                        xhr.abort();
                    }
                }
            }, 50);
            this.$dispatch('beforeFileUpload', file, this);
        },

        _fileUploadHtml4(file) {
            var _self = this;
            var file2 = this._files[file.id];

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
            form.action = this.action;
            form.name = 'upload-form-' + file.id;
            form.setAttribute('method', 'POST');
            form.setAttribute('target', 'upload-iframe-' + file.id);
            form.setAttribute('enctype', 'multipart/form-data');
            form.appendChild(file2.el);
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
                        _self.$dispatch('afterFileUpload', file, _self);
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

                file2.iframe = iframe;

                document.body.addEventListener('keydown', keydown);
                var interval = setInterval(function() {
                    if (!_self.active || !file.active || file.success || file.errno) {
                        clearInterval(interval);
                        if (!file.success && !file.errno) {
                            iframe.onabort({type:'abort'});
                        }
                    }
                }, 50);
                _self.$dispatch('beforeFileUpload', file, this);
            }, 10);

        },
    }
}
</script>
