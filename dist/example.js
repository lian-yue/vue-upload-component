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
	
	var _FileUpload = __webpack_require__(73);
	
	var _FileUpload2 = _interopRequireDefault(_FileUpload);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	Vue.filter('formatSize', function (size) {
	    if (size > 1024 * 1024 * 1024 * 1024) {
	        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
	    } else if (size > 1024 * 1024 * 1024) {
	        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
	    } else if (size > 1024 * 1024) {
	        return (size / 1024 / 1024).toFixed(2) + ' MB';
	    } else if (size > 1024) {
	        return (size / 1024).toFixed(2) + ' KB';
	    }
	    return size.toString() + ' B';
	});
	
	new Vue({
	    el: '#app',
	    components: {
	        FileUpload: _FileUpload2.default
	    },
	    data: {
	        accept: 'image/*',
	        size: 1024 * 1024 * 10,
	        multiple: true,
	        extensions: 'gif,jpg,png',
	
	        drop: true
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

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 2 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(49)
	  , defined = __webpack_require__(15);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(9)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(6)
	  , createDesc = __webpack_require__(12);
	module.exports = __webpack_require__(4) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(8)
	  , IE8_DOM_DEFINE = __webpack_require__(30)
	  , toPrimitive    = __webpack_require__(24)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(22)('wks')
	  , uid        = __webpack_require__(13)
	  , Symbol     = __webpack_require__(1).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(35)
	  , enumBugKeys = __webpack_require__(16);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 15 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 19 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(6).f
	  , has = __webpack_require__(2)
	  , TAG = __webpack_require__(7)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(22)('keys')
	  , uid    = __webpack_require__(13);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(1)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(10);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(1)
	  , core           = __webpack_require__(14)
	  , LIBRARY        = __webpack_require__(18)
	  , wksExt         = __webpack_require__(26)
	  , defineProperty = __webpack_require__(6).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(7);

/***/ },
/* 27 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10)
	  , document = __webpack_require__(1).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(1)
	  , core      = __webpack_require__(14)
	  , ctx       = __webpack_require__(46)
	  , hide      = __webpack_require__(5)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(4) && !__webpack_require__(9)(function(){
	  return Object.defineProperty(__webpack_require__(28)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(18)
	  , $export        = __webpack_require__(29)
	  , redefine       = __webpack_require__(36)
	  , hide           = __webpack_require__(5)
	  , has            = __webpack_require__(2)
	  , Iterators      = __webpack_require__(17)
	  , $iterCreate    = __webpack_require__(51)
	  , setToStringTag = __webpack_require__(20)
	  , getPrototypeOf = __webpack_require__(58)
	  , ITERATOR       = __webpack_require__(7)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(8)
	  , dPs         = __webpack_require__(55)
	  , enumBugKeys = __webpack_require__(16)
	  , IE_PROTO    = __webpack_require__(21)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(28)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(48).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(35)
	  , hiddenKeys = __webpack_require__(16).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(2)
	  , toIObject    = __webpack_require__(3)
	  , arrayIndexOf = __webpack_require__(45)(false)
	  , IE_PROTO     = __webpack_require__(21)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5);

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof2 = __webpack_require__(40);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createId = function createId() {
	    return Math.random().toString(36).substr(2);
	};
	
	exports.default = {
	    props: {
	        title: {
	            type: String,
	            default: 'Upload file'
	        },
	        name: {
	            type: String,
	            default: 'file'
	        },
	        drop: {
	            default: false
	        },
	        extensions: {},
	        postAction: {
	            type: String
	        },
	        putAction: {
	            type: String
	        },
	        accept: {
	            type: String
	        },
	        multiple: {
	            type: Boolean
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
	            dropActive: false,
	            dropElement: false,
	            request: {
	                data: {},
	                headers: {}
	            }
	        };
	    },
	    ready: function ready() {
	        this._drop(this.drop);
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
	        this._dropActive = 0;
	        this._files = {};
	    },
	    beforeDestroy: function beforeDestroy() {
	        this.active = false;
	        this.files = [];
	    },
	
	
	    watch: {
	        drop: function drop(value) {
	            this._drop(value);
	        },
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
	        _drop: function _drop(value) {
	            if (this.dropElement && this.$mode === 'html5') {
	                try {
	                    window.document.removeEventListener('dragenter', this._onDragenter, false);
	                    window.document.removeEventListener('dragleave', this._onDragleave, false);
	                    this.dropElement.removeEventListener('dragover', this._onDragover, false);
	                    this.dropElement.removeEventListener('drop', this._onDrop, false);
	                } catch (e) {}
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
	        _onDragenter: function _onDragenter(e) {
	            this._dropActive++;
	            this.dropActive = !!this._dropActive;
	            e.preventDefault();
	        },
	        _onDragleave: function _onDragleave(e) {
	            e.preventDefault();
	            this._dropActive--;
	            if (e.target.nodeName == 'HTML' || e.screenX == 0 && e.screenY == 0) {
	                this.dropActive = !!this._dropActive;
	            }
	        },
	        _onDragover: function _onDragover(e) {
	            e.preventDefault();
	        },
	        _onDrop: function _onDrop(e) {
	            this._dropActive = 0;
	            this.dropActive = false;
	            e.preventDefault();
	            if (e.dataTransfer.files.length) {
	                for (var i = 0; i < e.dataTransfer.files.length; i++) {
	                    var file = e.dataTransfer.files[i];
	                    var id = createId();
	                    var value = { id: id, size: file.size, name: file.name, progress: '0.00', speed: 0, active: false, error: '', errno: '', success: false, data: {}, request: { headers: {}, data: {} } };
	                    this._files[id] = { file: file };
	
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
	            }
	        },
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
	                    var id = createId();
	                    var value = { id: id, size: file.size, name: file.name, progress: '0.00', speed: 0, active: false, error: '', errno: '', success: false, data: {}, request: { headers: {}, data: {} } };
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
	                var id = createId();
	                var value = { id: id, size: -1, name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'), progress: '0.00', speed: 0, active: false, error: '', errno: '', success: false, data: {}, request: { headers: {}, data: {} } };
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
	
	                if (this.extensions.length || typeof this.extensions.length == 'undefined') {
	                    var extensions = this.extensions;
	                    if ((typeof extensions === 'undefined' ? 'undefined' : (0, _typeof3.default)(extensions)) == 'object' && RegExp instanceof extensions) {} else {
	                        if (typeof extensions == 'string') {
	                            extensions = extensions.split(',').map(function (value) {
	                                return value.trim();
	                            }).filter(function (value) {
	                                return value;
	                            });
	                        }
	                        extensions = new RegExp('\\.(' + extensions.join('|').replace(/\./g, '\\.') + ')$', 'i');
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
	        _fileUploadXhr: function _fileUploadXhr(xhr, file, data) {
	            var _self = this;
	            var file2 = this._files[file.id];
	            var fileUploads = false;
	            var speedTime = 0;
	            var speedLoaded = 0;
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
	                    var speedTime2 = Math.round(Date.now() / 1000);
	                    if (speedTime2 != speedTime) {
	                        file.speed = e.loaded - speedLoaded;
	                        speedLoaded = e.loaded;
	                        speedTime = speedTime2;
	                    }
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
	
	            xhr.onload = callback;
	            xhr.onerror = callback;
	            xhr.onabort = callback;
	            xhr.ontimeout = callback;
	
	            if (this.timeout) {
	                xhr.timeout = this.timeout;
	            }
	
	            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	            for (var key in this.request.headers) {
	                xhr.setRequestHeader(key, this.request.headers[key]);
	            }
	            for (var key in file.request.headers) {
	                xhr.setRequestHeader(key, file.request.headers[key]);
	            }
	
	            xhr.send(data);
	            file.active = true;
	            file2.xhr = xhr;
	            var interval = setInterval(function () {
	                if (!_self.active || !file.active || file.success || file.errno) {
	                    clearInterval(interval);
	                    if (!file.success && !file.errno) {
	                        xhr.abort();
	                    }
	                }
	            }, 100);
	            this.$dispatch('beforeFileUpload', file, this);
	        },
	        _fileUploadPut: function _fileUploadPut(file) {
	            var _self = this;
	            var querys = Vue.util.extend(Vue.util.extend({}, this.request.data), file.request.data);
	            var queryArray = [];
	            for (var key in querys) {
	                if (querys[key] !== null && typeof querys[key] !== 'undefined') {
	                    queryArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(querys[key]));
	                }
	            }
	            var queryString = queryArray.length ? '?' + queryArray.join('&') : '';
	
	            var xhr = new XMLHttpRequest();
	            xhr.open('PUT', (file.putAction || this.putAction) + queryString);
	            this._fileUploadXhr(xhr, file, this._files[file.id].file);
	        },
	        _fileUploadHtml5: function _fileUploadHtml5(file) {
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
	            form.action = file.postAction || this.postAction;
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(41), __esModule: true };

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(42), __esModule: true };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(39);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(38);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(64);
	__webpack_require__(67);
	__webpack_require__(68);
	module.exports = __webpack_require__(14).Symbol;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(65);
	__webpack_require__(69);
	module.exports = __webpack_require__(26).f('iterator');

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(3)
	  , toLength  = __webpack_require__(61)
	  , toIndex   = __webpack_require__(60);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(43);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(11)
	  , gOPS    = __webpack_require__(34)
	  , pIE     = __webpack_require__(19);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1).document && document.documentElement;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(32)
	  , descriptor     = __webpack_require__(12)
	  , setToStringTag = __webpack_require__(20)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(5)(IteratorPrototype, __webpack_require__(7)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(11)
	  , toIObject = __webpack_require__(3);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(13)('meta')
	  , isObject = __webpack_require__(10)
	  , has      = __webpack_require__(2)
	  , setDesc  = __webpack_require__(6).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(9)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(6)
	  , anObject = __webpack_require__(8)
	  , getKeys  = __webpack_require__(11);
	
	module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(19)
	  , createDesc     = __webpack_require__(12)
	  , toIObject      = __webpack_require__(3)
	  , toPrimitive    = __webpack_require__(24)
	  , has            = __webpack_require__(2)
	  , IE8_DOM_DEFINE = __webpack_require__(30)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(3)
	  , gOPN      = __webpack_require__(33).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(2)
	  , toObject    = __webpack_require__(62)
	  , IE_PROTO    = __webpack_require__(21)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(23)
	  , defined   = __webpack_require__(15);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(23)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(23)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(15);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(44)
	  , step             = __webpack_require__(52)
	  , Iterators        = __webpack_require__(17)
	  , toIObject        = __webpack_require__(3);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(31)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 64 */
/***/ function(module, exports) {



/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(59)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(31)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(1)
	  , has            = __webpack_require__(2)
	  , DESCRIPTORS    = __webpack_require__(4)
	  , $export        = __webpack_require__(29)
	  , redefine       = __webpack_require__(36)
	  , META           = __webpack_require__(54).KEY
	  , $fails         = __webpack_require__(9)
	  , shared         = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(20)
	  , uid            = __webpack_require__(13)
	  , wks            = __webpack_require__(7)
	  , wksExt         = __webpack_require__(26)
	  , wksDefine      = __webpack_require__(25)
	  , keyOf          = __webpack_require__(53)
	  , enumKeys       = __webpack_require__(47)
	  , isArray        = __webpack_require__(50)
	  , anObject       = __webpack_require__(8)
	  , toIObject      = __webpack_require__(3)
	  , toPrimitive    = __webpack_require__(24)
	  , createDesc     = __webpack_require__(12)
	  , _create        = __webpack_require__(32)
	  , gOPNExt        = __webpack_require__(57)
	  , $GOPD          = __webpack_require__(56)
	  , $DP            = __webpack_require__(6)
	  , $keys          = __webpack_require__(11)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(33).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(19).f  = $propertyIsEnumerable;
	  __webpack_require__(34).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(18)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(5)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25)('asyncIterator');

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25)('observable');

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	var global        = __webpack_require__(1)
	  , hide          = __webpack_require__(5)
	  , Iterators     = __webpack_require__(17)
	  , TO_STRING_TAG = __webpack_require__(7)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(71)();
	// imports
	
	
	// module
	exports.push([module.id, "\n.file-uploads-label {\n    overflow: hidden;\n    position: relative;\n    text-align: center;\n}\n.file-uploads-label span{\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    -o-user-select: none;\n    user-select: none;\n}\n.file-uploads-label input{\n    z-index: 1;\n    opacity: 0;\n    font-size: 20em;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n.file-uploads-label.file-uploads-html5 input{\n    width: 1px !important;\n    height: 1px !important;\n    top:-1px !important;\n    left:-1px !important;\n    right:auto !important;\n    bottom:auto !important;\n}\n", ""]);
	
	// exports


/***/ },
/* 71 */
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
/* 72 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n    <label :for=\"id||name\" :class=\"{'file-uploads-label': true, 'file-uploads-html5': $mode == 'html5', 'file-uploads-html4': $mode == 'html4'}\">\n        <span>{{title}}</span>\n        <input-file></input-file>\n    </label>\n</div>\n";

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(75)
	__vue_script__ = __webpack_require__(37)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/FileUpload.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(72)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}


/***/ },
/* 74 */
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(70);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(74)(content, {});
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