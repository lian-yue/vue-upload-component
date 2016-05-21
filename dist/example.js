/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _FileUpload = __webpack_require__(5);
	
	var _FileUpload2 = _interopRequireDefault(_FileUpload);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	new Vue({
	    el: '#app',
	    components: {
	        FileUpload: _FileUpload2.default
	    },
	    data: {
	        accept: 'image/*',
	        size: 1024 * 1024 * 10,
	        multiple: true
	    },
	    compiled: function compiled() {
	        this.$refs.upload.request = {
	            headers: {
	                "X-Csrf-Token": "xxxx"
	            },
	            data: {
	                "_csrf_token": "xxxxxx"
	            }
	        };
	    },
	    methods: {
	        remove: function remove(file) {
	            this.$refs.upload.files.$remove(file);
	        }
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    props: {
	        title: {
	            type: String,
	            default: 'Upload file'
	        },
	        name: {
	            type: String,
	            required: true
	        },
	        id: {
	            type: String
	        },
	        action: {
	            type: String,
	            required: true
	        },
	        accept: {
	            type: String
	        },
	        multiple: {
	            type: String
	        },
	        timeout: {
	            type: Number
	        },
	        size: {
	            type: Number
	        }
	    },
	
	    components: {
	        inputFile: {
	            template: '<input type="file" :name="$parent.name" :id="$parent.id||$parent.name" :accept="$parent.accept" @change="change" :multiple="$parent.multiple && $parent.$mode == \'html5\'">',
	            methods: {
	                change: function change(e) {
	                    this.$parent._addFileUploads(e.target);
	                    this.$destroy();
	                }
	            }
	        }
	    },
	
	    data: function data() {
	        return {
	            files: [],
	            active: false,
	            uploaded: true,
	            request: {
	                data: {},
	                headers: {}
	            }
	        };
	    },
	    init: function init() {
	        var input = document.createElement('input');
	        input.type = 'file';
	        if (window.FormData && input.files) {
	            this.$mode = 'html5';
	        } else {
	            this.$mode = 'html4';
	        }
	        this._index = 0;
	        this._files = {};
	    },
	    beforeDestroy: function beforeDestroy() {
	        this.active = false;
	        this.files = [];
	    },
	
	
	    watch: {
	        files: function files(_files) {
	            var ids = [];
	            for (var i = 0; i < _files.length; i++) {
	                var file = _files[i];
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
	                    iframe.onabort({ type: 'abort' });
	                }
	                delete this._files[id];
	                this.$dispatch('removeFileUpload', file, this);
	            }
	            this._index = 0;
	        },
	        active: function active(newValue, oldValue) {
	            if (newValue && !oldValue) {
	                this._fileUploads();
	            }
	        },
	        uploaded: function uploaded(_uploaded) {
	            if (_uploaded) {
	                this.active = false;
	            }
	        }
	    },
	
	    methods: {
	        _addFileUploads: function _addFileUploads(el) {
	            var Component = this.$options.components.inputFile;
	            new Component({
	                parent: this,
	                el: el
	            });
	            this.uploaded = false;
	
	            if (el.files) {
	                for (var i = 0; i < el.files.length; i++) {
	                    var file = el.files[i];
	                    var id = 'upload-file-' + Math.random().toString(36).substr(2);
	                    var value = { id: id, size: file.size, name: file.name, progress: '0.00', active: false, error: '', errno: '', success: false, data: {}, request: { headers: {}, data: {} } };
	                    this._files[id] = { el: el, file: file };
	
	                    var len;
	                    if (this.multiple) {
	                        len = this.files.push(value);
	                    } else {
	                        this.files = [value];
	                        len = 1;
	                    }
	                    this._files[id]._file = this.files[len - 1];
	                    this.$dispatch('addFileUpload', this.files[len - 1], this);
	                }
	            } else {
	                var id = 'upload-file-' + Math.random().toString(36).substr(2);
	                var value = { id: id, size: -1, name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'), progress: '0.00', active: false, error: '', errno: '', success: false, data: {}, request: { headers: {}, data: {} } };
	                this._files[id] = { el: el };
	                var len;
	                if (this.multiple) {
	                    len = this.files.push(value);
	                } else {
	                    this.files = [value];
	                    len = 1;
	                }
	                var len = this.files.push(file);
	                this._files[id]._file = this.files[len - 1];
	                this.$dispatch('addFileUpload', this.files[len - 1], this);
	            }
	        },
	        _fileUploads: function _fileUploads() {
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
	        _fileUploadHtml5: function _fileUploadHtml5(file) {
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
	
	            xhr.upload.onprogress = function (e) {
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
	
	            var callback = function callback(e) {
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
	                        } else if (xhr.status >= 500) {
	                            file.errno = 'server';
	                            file.error = 'Server';
	                        } else if (xhr.status >= 400) {
	                            file.errno = 'denied';
	                            file.error = 'Denied';
	                        }
	                        break;
	                    default:
	                        if (xhr.status >= 500) {
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
	                    setTimeout(function () {
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
	            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	            for (var key in this.request.headers) {
	                xhr.setRequestHeader(key, this.request.headers[key]);
	            }
	
	            for (var key in file.request.headers) {
	                xhr.setRequestHeader(key, file.request.headers[key]);
	            }
	
	            xhr.send(form);
	
	            file.active = true;
	
	            file2.xhr = xhr;
	
	            var interval = setInterval(function () {
	                if (!_self.active || !file.active || file.success || file.errno) {
	                    clearInterval(interval);
	                    if (!file.success && !file.errno) {
	                        xhr.abort();
	                    }
	                }
	            }, 50);
	            this.$dispatch('beforeFileUpload', file, this);
	        },
	        _fileUploadHtml4: function _fileUploadHtml4(file) {
	            var _self = this;
	            var file2 = this._files[file.id];
	
	            var fileUploads = false;
	
	            var keydown = function keydown(e) {
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
	                input.name = key;
	                input.value = this.request.data[key];
	                form.appendChild(input);
	            }
	
	            for (var key in file.request.data) {
	                var input = document.createElement('input');
	                input.type = 'hidden';
	                input.name = key;
	                input.value = file.request.data[key];
	                form.appendChild(input);
	            }
	
	            var getDocumentData = function getDocumentData() {
	                var doc;
	                try {
	                    if (iframe.contentWindow) {
	                        doc = iframe.contentWindow.document;
	                    }
	                } catch (err) {}
	                if (!doc) {
	                    try {
	                        doc = iframe.contentDocument ? iframe.contentDocument : iframe.document;
	                    } catch (err) {
	                        doc = iframe.document;
	                    }
	                }
	                if (doc && doc.body) {
	                    return doc.body.innerHTML;
	                }
	                return null;
	            };
	
	            var callback = function callback(e) {
	                switch (e.type) {
	                    case 'abort':
	                        file.errno = 'abort';
	                        file.error = 'Abort';
	                        break;
	                    case 'error':
	                        var data = getDocumentData();
	                        if (file.errno) {} else if (data === null) {
	                            file.errno = 'network';
	                            file.error = 'Network';
	                        } else {
	                            file.errno = 'denied';
	                            file.error = 'Denied';
	                        }
	                        break;
	                    default:
	                        var data = getDocumentData();
	                        if (file.errno) {} else if (data === null) {
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
	                        } catch (err) {}
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
	                    setTimeout(function () {
	                        _self._fileUploads();
	                    }, 50);
	                }
	            };
	
	            setTimeout(function () {
	                document.body.appendChild(iframe).appendChild(form).submit();
	                iframe.onload = callback;
	                iframe.onerror = callback;
	                iframe.onabort = callback;
	
	                file.active = true;
	
	                file2.iframe = iframe;
	
	                document.body.addEventListener('keydown', keydown);
	                var interval = setInterval(function () {
	                    if (!_self.active || !file.active || file.success || file.errno) {
	                        clearInterval(interval);
	                        if (!file.success && !file.errno) {
	                            iframe.onabort({ type: 'abort' });
	                        }
	                    }
	                }, 50);
	                _self.$dispatch('beforeFileUpload', file, this);
	            }, 10);
	        }
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "\n.file-uploads-label {\n    overflow: hidden;\n    position: relative;\n    text-align: center;\n}\n.file-uploads-label span{\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    -o-user-select: none;\n    user-select: none;\n}\n.file-uploads-label input{\n    z-index: 1;\n    opacity: 0;\n    font-size: 20em;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n.file-uploads-label.file-uploads-html5 input{\n    width: 1px !important;\n    height: 1px !important;\n    top:-1px !important;\n    left:-1px !important;\n    right:auto !important;\n    bottom:auto !important;\n}\n", ""]);
	
	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n    <label :for=\"id||name\" :class=\"{'file-uploads-label': true, 'file-uploads-html5': $mode == 'html5', 'file-uploads-html4': $mode == 'html4'}\">\n        <span>{{title}}</span>\n        <input-file></input-file>\n    </label>\n</div>\n";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(7)
	__vue_script__ = __webpack_require__(1)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/FileUpload.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(4)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if (media) {
			styleElement.setAttribute("media", media);
		}
	
		if (sourceMap) {
			// https://developer.chrome.com/devtools/docs/javascript-debugging
			// this makes source maps inside style tags work properly in Chrome
			css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js!./../node_modules/vue-loader/lib/selector.js?type=style&index=0!./FileUpload.vue", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/vue-loader/lib/style-rewriter.js!./../node_modules/vue-loader/lib/selector.js?type=style&index=0!./FileUpload.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
/******/ ]);
//# sourceMappingURL=example.js.map