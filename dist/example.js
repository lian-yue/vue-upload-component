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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(57);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(28)('wks')
	  , uid        = __webpack_require__(21)
	  , Symbol     = __webpack_require__(2).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(5)
	  , IE8_DOM_DEFINE = __webpack_require__(40)
	  , toPrimitive    = __webpack_require__(32)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(13)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(4)
	  , createDesc = __webpack_require__(17);
	module.exports = __webpack_require__(6) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(41)
	  , defined = __webpack_require__(23);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(22);
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

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(2)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(8)
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

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(48)
	  , enumBugKeys = __webpack_require__(25);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(4).f
	  , has = __webpack_require__(7)
	  , TAG = __webpack_require__(1)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14)
	  , document = __webpack_require__(2).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(28)('keys')
	  , uid    = __webpack_require__(21);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(2)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(29)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(23);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
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

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(2)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(18)
	  , wksExt         = __webpack_require__(34)
	  , defineProperty = __webpack_require__(4).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(1);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(98)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(44)(String, 'String', function(iterated){
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

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// this module is a runtime utility for cleaner component module output and will
	// be included in the final webpack user bundle
	
	module.exports = function normalizeComponent (
	  rawScriptExports,
	  compiledTemplate,
	  scopeId,
	  cssModules
	) {
	  var esModule
	  var scriptExports = rawScriptExports = rawScriptExports || {}
	
	  // ES6 modules interop
	  var type = typeof rawScriptExports.default
	  if (type === 'object' || type === 'function') {
	    esModule = rawScriptExports
	    scriptExports = rawScriptExports.default
	  }
	
	  // Vue.extend constructor export interop
	  var options = typeof scriptExports === 'function'
	    ? scriptExports.options
	    : scriptExports
	
	  // render functions
	  if (compiledTemplate) {
	    options.render = compiledTemplate.render
	    options.staticRenderFns = compiledTemplate.staticRenderFns
	  }
	
	  // scopedId
	  if (scopeId) {
	    options._scopeId = scopeId
	  }
	
	  // inject cssModules
	  if (cssModules) {
	    var computed = Object.create(options.computed || null)
	    Object.keys(cssModules).forEach(function (key) {
	      var module = cssModules[key]
	      computed[key] = function () { return module }
	    })
	    options.computed = computed
	  }
	
	  return {
	    esModule: esModule,
	    exports: scriptExports,
	    options: options
	  }
	}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(65);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(10)
	  , TAG = __webpack_require__(1)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(6) && !__webpack_require__(13)(function(){
	  return Object.defineProperty(__webpack_require__(24)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(10);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(15)
	  , ITERATOR   = __webpack_require__(1)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(5);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(18)
	  , $export        = __webpack_require__(12)
	  , redefine       = __webpack_require__(49)
	  , hide           = __webpack_require__(8)
	  , has            = __webpack_require__(7)
	  , Iterators      = __webpack_require__(15)
	  , $iterCreate    = __webpack_require__(85)
	  , setToStringTag = __webpack_require__(20)
	  , getPrototypeOf = __webpack_require__(94)
	  , ITERATOR       = __webpack_require__(1)('iterator')
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

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(1)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(5)
	  , dPs         = __webpack_require__(91)
	  , enumBugKeys = __webpack_require__(25)
	  , IE_PROTO    = __webpack_require__(27)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(24)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(39).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
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


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(48)
	  , hiddenKeys = __webpack_require__(25).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(7)
	  , toIObject    = __webpack_require__(9)
	  , arrayIndexOf = __webpack_require__(79)(false)
	  , IE_PROTO     = __webpack_require__(27)('IE_PROTO');
	
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

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(11)
	  , invoke             = __webpack_require__(83)
	  , html               = __webpack_require__(39)
	  , cel                = __webpack_require__(24)
	  , global             = __webpack_require__(2)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(10)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(38)
	  , ITERATOR  = __webpack_require__(1)('iterator')
	  , Iterators = __webpack_require__(15);
	module.exports = __webpack_require__(3).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 52 */
/***/ (function(module, exports) {



/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	var global        = __webpack_require__(2)
	  , hide          = __webpack_require__(8)
	  , Iterators     = __webpack_require__(15)
	  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 54 */
/***/ (function(module, exports) {

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


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	  MIT License http://www.opensource.org/licenses/mit-license.php
	  Author Tobias Koppers @sokra
	  Modified by Evan You @yyx990803
	*/
	
	var hasDocument = typeof document !== 'undefined'
	
	if (false) {
	  if (!hasDocument) {
	    throw new Error(
	    'vue-style-loader cannot be used in a non-browser environment. ' +
	    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
	  ) }
	}
	
	var listToStyles = __webpack_require__(117)
	
	/*
	type StyleObject = {
	  id: number;
	  parts: Array<StyleObjectPart>
	}
	
	type StyleObjectPart = {
	  css: string;
	  media: string;
	  sourceMap: ?string
	}
	*/
	
	var stylesInDom = {/*
	  [id: number]: {
	    id: number,
	    refs: number,
	    parts: Array<(obj?: StyleObjectPart) => void>
	  }
	*/}
	
	var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
	var singletonElement = null
	var singletonCounter = 0
	var isProduction = false
	var noop = function () {}
	
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())
	
	module.exports = function (parentId, list, _isProduction) {
	  isProduction = _isProduction
	
	  var styles = listToStyles(parentId, list)
	  addStylesToDom(styles)
	
	  return function update (newList) {
	    var mayRemove = []
	    for (var i = 0; i < styles.length; i++) {
	      var item = styles[i]
	      var domStyle = stylesInDom[item.id]
	      domStyle.refs--
	      mayRemove.push(domStyle)
	    }
	    if (newList) {
	      styles = listToStyles(parentId, newList)
	      addStylesToDom(styles)
	    } else {
	      styles = []
	    }
	    for (var i = 0; i < mayRemove.length; i++) {
	      var domStyle = mayRemove[i]
	      if (domStyle.refs === 0) {
	        for (var j = 0; j < domStyle.parts.length; j++) {
	          domStyle.parts[j]()
	        }
	        delete stylesInDom[domStyle.id]
	      }
	    }
	  }
	}
	
	function addStylesToDom (styles /* Array<StyleObject> */) {
	  for (var i = 0; i < styles.length; i++) {
	    var item = styles[i]
	    var domStyle = stylesInDom[item.id]
	    if (domStyle) {
	      domStyle.refs++
	      for (var j = 0; j < domStyle.parts.length; j++) {
	        domStyle.parts[j](item.parts[j])
	      }
	      for (; j < item.parts.length; j++) {
	        domStyle.parts.push(addStyle(item.parts[j]))
	      }
	      if (domStyle.parts.length > item.parts.length) {
	        domStyle.parts.length = item.parts.length
	      }
	    } else {
	      var parts = []
	      for (var j = 0; j < item.parts.length; j++) {
	        parts.push(addStyle(item.parts[j]))
	      }
	      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
	    }
	  }
	}
	
	function createStyleElement () {
	  var styleElement = document.createElement('style')
	  styleElement.type = 'text/css'
	  head.appendChild(styleElement)
	  return styleElement
	}
	
	function addStyle (obj /* StyleObjectPart */) {
	  var update, remove
	  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')
	
	  if (styleElement) {
	    if (isProduction) {
	      // has SSR styles and in production mode.
	      // simply do nothing.
	      return noop
	    } else {
	      // has SSR styles but in dev mode.
	      // for some reason Chrome can't handle source map in server-rendered
	      // style tags - source maps in <style> only works if the style tag is
	      // created and inserted dynamically. So we remove the server rendered
	      // styles and inject new ones.
	      styleElement.parentNode.removeChild(styleElement)
	    }
	  }
	
	  if (isOldIE) {
	    // use singleton mode for IE9.
	    var styleIndex = singletonCounter++
	    styleElement = singletonElement || (singletonElement = createStyleElement())
	    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
	    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
	  } else {
	    // use multi-style-tag mode in all other cases
	    styleElement = createStyleElement()
	    update = applyToTag.bind(null, styleElement)
	    remove = function () {
	      styleElement.parentNode.removeChild(styleElement)
	    }
	  }
	
	  update(obj)
	
	  return function updateStyle (newObj /* StyleObjectPart */) {
	    if (newObj) {
	      if (newObj.css === obj.css &&
	          newObj.media === obj.media &&
	          newObj.sourceMap === obj.sourceMap) {
	        return
	      }
	      update(obj = newObj)
	    } else {
	      remove()
	    }
	  }
	}
	
	var replaceText = (function () {
	  var textStore = []
	
	  return function (index, replacement) {
	    textStore[index] = replacement
	    return textStore.filter(Boolean).join('\n')
	  }
	})()
	
	function applyToSingletonTag (styleElement, index, remove, obj) {
	  var css = remove ? '' : obj.css
	
	  if (styleElement.styleSheet) {
	    styleElement.styleSheet.cssText = replaceText(index, css)
	  } else {
	    var cssNode = document.createTextNode(css)
	    var childNodes = styleElement.childNodes
	    if (childNodes[index]) styleElement.removeChild(childNodes[index])
	    if (childNodes.length) {
	      styleElement.insertBefore(cssNode, childNodes[index])
	    } else {
	      styleElement.appendChild(cssNode)
	    }
	  }
	}
	
	function applyToTag (styleElement, obj) {
	  var css = obj.css
	  var media = obj.media
	  var sourceMap = obj.sourceMap
	
	  if (media) {
	    styleElement.setAttribute('media', media)
	  }
	
	  if (sourceMap) {
	    // https://developer.chrome.com/devtools/docs/javascript-debugging
	    // this makes source maps inside style tags work properly in Chrome
	    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
	    // http://stackoverflow.com/a/26603875
	    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
	  }
	
	  if (styleElement.styleSheet) {
	    styleElement.styleSheet.cssText = css
	  } else {
	    while (styleElement.firstChild) {
	      styleElement.removeChild(styleElement.firstChild)
	    }
	    styleElement.appendChild(document.createTextNode(css))
	  }
	}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

	module.exports = Vue;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends2 = __webpack_require__(37);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _vue = __webpack_require__(56);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Home = __webpack_require__(109);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _store = __webpack_require__(58);
	
	var _store2 = _interopRequireDefault(_store);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.config.silent = false;
	_vue2.default.config.devtools = true;
	
	_vue2.default.filter('formatSize', function (size) {
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
	
	new _vue2.default((0, _extends3.default)({
	  store: _store2.default
	}, _Home2.default)).$mount('#app');

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(56);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _vuex = __webpack_require__(118);
	
	var _vuex2 = _interopRequireDefault(_vuex);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var state = {
	  files: []
	};
	
	var mutations = {
	  updateFiles: function updateFiles(state, files) {
	    state.files = files;
	  }
	};
	exports.default = new _vuex2.default.Store({
	  strict: true,
	  state: state,
	  mutations: mutations
	});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _src = __webpack_require__(62);
	
	var _src2 = _interopRequireDefault(_src);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    FileUpload: _src2.default
	  },
	
	  data: function data() {
	    return {
	      files: [],
	      accept: 'image/png,image/gif,image/jpeg,image/webp',
	      size: 1024 * 1024 * 10,
	      extensions: 'gif,jpg,jpeg,png,webp',
	
	
	      multiple: true,
	      directory: false,
	      drop: true,
	      dropDirectory: true,
	      thread: 3,
	      name: 'file',
	
	      postAction: './post.php',
	      putAction: './put.php',
	
	      headers: {
	        "X-Csrf-Token": "xxxx"
	      },
	
	      data: {
	        "_csrf_token": "xxxxxx"
	      },
	
	      auto: false
	
	    };
	  },
	
	
	  watch: {
	    auto: function auto(_auto) {
	      if (_auto && !this.$refs.upload.uploaded && !this.$refs.upload.active) {
	        this.$refs.upload.active = true;
	      }
	    }
	  },
	
	  methods: {
	    addDirectory: function addDirectory() {
	      var _this = this;
	
	      if (!this.$refs.upload.features.directory) {
	        return;
	      }
	
	      var input = this.$refs.upload.$el.querySelector('input');
	      input.directory = true;
	      input.webkitdirectory = true;
	      this.directory = true;
	
	      input.onclick = null;
	      input.click();
	      input.onclick = function (e) {
	        _this.directory = false;
	        input.directory = false;
	        input.webkitdirectory = false;
	      };
	    },
	    inputFilter: function inputFilter(newFile, oldFile, prevent) {
	      if (newFile && !oldFile) {
	        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
	          return prevent();
	        }
	
	        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
	          return prevent();
	        }
	
	        newFile.blob = '';
	        var URL = window.URL || window.webkitURL;
	        if (URL && URL.createObjectURL) {
	          newFile.blob = URL.createObjectURL(newFile.file);
	        }
	      }
	    },
	    inputFile: function inputFile(newFile, oldFile) {
	      if (newFile && oldFile) {
	
	        if (newFile.active && !oldFile.active) {
	          if (newFile.size >= 0 && newFile.size < 100 * 1024) {}
	        }
	
	        if (newFile.progress != oldFile.progress) {}
	
	        if (newFile.error && !oldFile.error) {}
	
	        if (newFile.success && !oldFile.success) {}
	      }
	
	      if (!newFile && oldFile) {}
	
	      if (newFile && !oldFile && this.auto && !this.$refs.upload.active) {
	        this.$refs.upload.active = true;
	      }
	    },
	    abort: function abort(file) {
	      this.$refs.upload.update(file, { active: false });
	    },
	    customError: function customError(file) {
	      this.$refs.upload.update(file, { error: 'custom' });
	    },
	    remove: function remove(file) {
	      this.$refs.upload.remove(file);
	    }
	  }
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(64);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _toConsumableArray2 = __webpack_require__(69);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _promise = __webpack_require__(66);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _extends2 = __webpack_require__(37);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _typeof2 = __webpack_require__(70);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _InputFile = __webpack_require__(111);
	
	var _InputFile2 = _interopRequireDefault(_InputFile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    InputFile: _InputFile2.default
	  },
	  props: {
	    inputId: {
	      type: String
	    },
	
	    name: {
	      type: String,
	      default: 'file'
	    },
	
	    accept: {
	      type: String
	    },
	
	    multiple: {
	      type: Boolean
	    },
	
	    directory: {
	      type: Boolean
	    },
	
	    postAction: {
	      type: String
	    },
	
	    putAction: {
	      type: String
	    },
	
	    headers: {
	      type: Object,
	      default: Object
	    },
	
	    data: {
	      type: Object,
	      default: Object
	    },
	
	    timeout: {
	      type: Number,
	      default: 0
	    },
	
	    drop: {
	      default: false
	    },
	
	    dropDirectory: {
	      type: Boolean,
	      default: true
	    },
	
	    size: {
	      type: Number,
	      default: 0
	    },
	
	    extensions: {
	      default: Array
	    },
	
	    value: {
	      type: Array,
	      default: Array
	    },
	
	    thread: {
	      type: Number,
	      default: 1
	    }
	  },
	
	  data: function data() {
	    return {
	      files: this.value,
	      features: {
	        html5: true,
	        directory: false,
	        drag: false
	      },
	
	      active: false,
	      dropActive: false,
	
	      uploading: 0,
	
	      destroy: false
	    };
	  },
	  mounted: function mounted() {
	    var input = document.createElement('input');
	    input.type = 'file';
	    input.multiple = true;
	
	    if (window.FormData && input.files) {
	      if (typeof input.webkitdirectory === 'boolean' || typeof input.directory === 'boolean') {
	        this.features.directory = true;
	      }
	
	      if (this.features.html5 && typeof input.ondrop !== 'undefined') {
	        this.features.drop = true;
	      }
	    } else {
	      this.features.html5 = false;
	    }
	
	    this.maps = {};
	
	    this.$nextTick(function () {
	      if (this.$parent) {
	        this.$parent.$forceUpdate();
	      }
	
	      this.watchDrop(this.drop);
	    });
	  },
	  beforeDestroy: function beforeDestroy() {
	    this.destroy = true;
	
	    this.active = false;
	  },
	
	
	  computed: {
	    uploaded: function uploaded() {
	      var file = void 0;
	      for (var i = 0; i < this.files.length; i++) {
	        file = this.files[i];
	        if (!file.error && !file.success) {
	          return false;
	        }
	      }
	      return true;
	    },
	    className: function className() {
	      return ['file-uploads', this.features.html5 ? 'file-uploads-html5' : 'file-uploads-html4', this.features.directory && this.directory ? 'file-uploads-directory' : undefined, this.features.drop && this.drop ? 'file-uploads-drop' : undefined];
	    }
	  },
	
	  watch: {
	    active: function active(_active) {
	      this.watchActive(_active);
	    },
	    dropActive: function dropActive() {
	      if (this.$parent) {
	        this.$parent.$forceUpdate();
	      }
	    },
	    drop: function drop(value) {
	      this.watchDrop(value);
	    },
	    value: function value(files) {
	      if (this.files === files) {
	        return;
	      }
	
	      var oldFiles = this.files;
	      this.files = files;
	
	      var oldMaps = this.maps;
	
	      this.maps = {};
	      for (var i = 0; i < this.files.length; i++) {
	        var file = this.files[i];
	        this.maps[file.id] = file;
	      }
	
	      for (var key in this.maps) {
	        var newFile = this.maps[key];
	        var oldFile = oldMaps[key];
	        if (newFile !== oldFile) {
	          this.emitFile(newFile, oldFile);
	        }
	      }
	
	      for (var _key in oldMaps) {
	        if (!this.maps[_key]) {
	          this.emitFile(undefined, oldMaps[_key]);
	        }
	      }
	    }
	  },
	
	  methods: {
	    clear: function clear() {
	      if (this.files.length) {
	        var files = this.files;
	        this.files = [];
	
	        this.maps = {};
	
	        this.emitInput();
	        for (var i = 0; i < files.length; i++) {
	          this.emitFile(undefined, files[i]);
	        }
	      }
	      return true;
	    },
	    get: function get(id) {
	      if (!id) {
	        return false;
	      }
	
	      if ((typeof id === 'undefined' ? 'undefined' : (0, _typeof3.default)(id)) === 'object') {
	        id = id.id;
	      }
	
	      return this.maps[id] || false;
	    },
	    add: function add(files, start) {
	      var isArray = files instanceof Array;
	
	      if (!isArray) {
	        files = [files];
	      }
	
	      var addFiles = [];
	      for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        if (this.features.html5 && file instanceof File) {
	          file = {
	            file: file,
	            size: file.size,
	            name: file.webkitRelativePath || file.relativePath || file.name,
	            type: file.type
	          };
	        }
	        file = (0, _extends3.default)({
	          size: -1,
	          name: 'Filename',
	          type: '',
	          active: false,
	          error: '',
	          success: false,
	          putAction: this.putAction,
	          postAction: this.postAction,
	          timeout: this.timeout
	        }, file, {
	          response: {},
	
	          progress: '0.00',
	          speed: 0 });
	
	        file.data = (0, _extends3.default)({}, this.data, file.data ? file.data : {});
	
	        file.headers = (0, _extends3.default)({}, this.headers, file.headers ? file.headers : {});
	
	        if (!file.id) {
	          file.id = Math.random().toString(36).substr(2);
	        }
	
	        if (this.emitFilter(file, undefined)) {
	          continue;
	        }
	
	        addFiles.push(file);
	
	        if (!this.multiple) {
	          break;
	        }
	      }
	
	      if (!addFiles.length) {
	        return false;
	      }
	
	      if (!this.multiple) {
	        this.clear();
	      }
	
	      var newFiles = void 0;
	      if (start) {
	        newFiles = addFiles.concat(this.files);
	      } else {
	        newFiles = this.files.concat(addFiles);
	      }
	
	      this.files = newFiles;
	
	      for (var _i = 0; _i < addFiles.length; _i++) {
	        var _file = addFiles[_i];
	        this.maps[_file.id] = _file;
	      }
	
	      this.emitInput();
	      for (var _i2 = 0; _i2 < addFiles.length; _i2++) {
	        this.emitFile(addFiles[_i2], undefined);
	      }
	
	      return isArray ? addFiles : addFiles[0];
	    },
	    addInputFile: function addInputFile(el) {
	      var files = [];
	      if (el.files) {
	        for (var i = 0; i < el.files.length; i++) {
	          var file = el.files[i];
	          files.push({
	            size: file.size,
	            name: file.webkitRelativePath || file.relativePath || file.name,
	            type: file.type,
	            file: file,
	            el: el
	          });
	        }
	      } else {
	        files.push({
	          name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'),
	          el: el
	        });
	      }
	      return this.add(files);
	    },
	    addDataTransfer: function addDataTransfer(dataTransfer) {
	      var files = [];
	      if (dataTransfer.items && dataTransfer.items.length) {
	        var items = [];
	        for (var i = 0; i < dataTransfer.items.length; i++) {
	          var item = dataTransfer.items[i];
	          if (item.getAsEntry) {
	            item = item.getAsEntry();
	          } else if (item.webkitGetAsEntry) {
	            item = item.webkitGetAsEntry();
	          } else {
	            item = item.getAsFile();
	          }
	          if (item) {
	            items.push(item);
	          }
	        }
	
	        return new _promise2.default(function (resolve, reject) {
	          var _this = this;
	
	          var forEach = function forEach(i) {
	            var item = items[i];
	
	            if (!item || !_this.multiple && files.length) {
	              return resolve(_this.add(files));
	            }
	            _this.getEntry(item).then(function (results) {
	              files.push.apply(files, (0, _toConsumableArray3.default)(results));
	              forEach(i + 1);
	            });
	          };
	          forEach(0);
	        });
	      }
	
	      if (dataTransfer.files.length) {
	        for (var _i3 = 0; _i3 < dataTransfer.files.length; _i3++) {
	          files.push(dataTransfer.files[_i3]);
	          if (!this.multiple) {
	            break;
	          }
	        }
	        return _promise2.default.resolve(this.add(files));
	      }
	
	      return _promise2.default.resolve([]);
	    },
	    getEntry: function getEntry(entry) {
	      var _this2 = this;
	
	      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	      return new _promise2.default(function (resolve, reject) {
	        if (entry.isFile) {
	          entry.file(function (file) {
	            resolve([{
	              size: file.size,
	              name: path + file.name,
	              type: file.type,
	              file: file
	            }]);
	          });
	        } else if (entry.isDirectory && _this2.dropDirectory) {
	          entry.createReader().readEntries(function (entries) {
	            var files = [];
	            var forEach = function forEach(i) {
	              if (!entries[i] || files.length && !_this2.multiple) {
	                return resolve(files);
	              }
	              _this2.getEntry(entries[i], path + entry.name + '/').then(function (results) {
	                files.push.apply(files, (0, _toConsumableArray3.default)(results));
	                forEach(i + 1);
	              });
	            };
	            forEach(0);
	          });
	        } else {
	          resolve([]);
	        }
	      });
	    },
	    remove: function remove(file) {
	      file = this.get(file);
	      if (file) {
	        if (this.emitFilter(undefined, file)) {
	          return false;
	        }
	        var files = this.files.concat([]);
	        var index = files.indexOf(file);
	        if (index === -1) {
	          console.error('remove', file);
	          return false;
	        }
	        files.splice(index, 1);
	        this.files = files;
	
	        delete this.maps[file.id];
	
	        this.emitInput();
	        this.emitFile(undefined, file);
	      }
	      return file;
	    },
	    update: function update(file, data) {
	      file = this.get(file);
	      if (file) {
	        var newFile = (0, _extends3.default)({}, file, data);
	
	        if (file.active && !newFile.active && !newFile.error && !newFile.success) {
	          newFile.error = 'abort';
	        }
	
	        if (this.emitFilter(newFile, file)) {
	          return false;
	        }
	
	        var files = this.files.concat([]);
	        var index = files.indexOf(file);
	        if (index === -1) {
	          console.error('update', file);
	          return false;
	        }
	        files.splice(index, 1, newFile);
	        this.files = files;
	
	        this.maps[file.id] = newFile;
	
	        this.emitInput();
	        this.emitFile(newFile, file);
	        return newFile;
	      }
	      return false;
	    },
	    emitFilter: function emitFilter(newFile, oldFile) {
	      var isPrevent = false;
	      this.$emit('input-filter', newFile, oldFile, function () {
	        isPrevent = true;
	        return isPrevent;
	      });
	      return isPrevent;
	    },
	    emitFile: function emitFile(newFile, oldFile) {
	      this.$emit('input-file', newFile, oldFile);
	      if (newFile && newFile.active && (!oldFile || !oldFile.active)) {
	        this.uploading++;
	
	        this.$nextTick(function () {
	          var _this3 = this;
	
	          setTimeout(function () {
	            _this3.upload(newFile).then(function () {
	              newFile = _this3.get(newFile);
	              if (newFile) {
	                _this3.update(newFile, { active: false, success: !newFile.error });
	              }
	            }).catch(function (e) {
	              _this3.update(newFile, { active: false, success: false, error: e.code || e.error || e.message || e });
	            });
	          }, parseInt(Math.random() * 50 + 50));
	        });
	      } else if ((!newFile || !newFile.active) && oldFile && oldFile.active) {
	        this.uploading--;
	      }
	
	      if (this.active && (Boolean(newFile) !== Boolean(oldFile) || newFile.active !== oldFile.active)) {
	        this.watchActive(true);
	      }
	    },
	    emitInput: function emitInput() {
	      this.$emit('input', this.files);
	    },
	    upload: function upload(file) {
	      if (!(file = this.get(file))) {
	        return _promise2.default.reject('not_exists');
	      }
	
	      if (file.error) {
	        return _promise2.default.reject(file.error);
	      }
	
	      if (file.success) {
	        return _promise2.default.resolve(file);
	      }
	
	      var extensions = this.extensions;
	      if (extensions && (extensions.length || typeof extensions.length == 'undefined')) {
	        if ((typeof extensions === 'undefined' ? 'undefined' : (0, _typeof3.default)(extensions)) != 'object' || !(extensions instanceof RegExp)) {
	          if (typeof extensions == 'string') {
	            extensions = extensions.split(',').map(function (value) {
	              return value.trim();
	            }).filter(function (value) {
	              return value;
	            });
	          }
	          extensions = new RegExp('\\.(' + extensions.join('|').replace(/\./g, '\\.') + ')$', 'i');
	        }
	        if (file.name.search(extensions) === -1) {
	          return _promise2.default.reject('extension');
	        }
	      }
	
	      if (this.size > 0 && file.size >= 0 && file.size > this.size) {
	        return _promise2.default.reject('size');
	      }
	
	      if (this.features.html5 && file.putAction) {
	        return this.uploadPut(file);
	      } else if (this.features.html5) {
	        return this.uploadHtml5(file);
	      } else {
	        return this.uploadHtml4(file);
	      }
	    },
	    uploadPut: function uploadPut(file) {
	      var querys = [];
	      var value = void 0;
	      for (var key in file.data) {
	        value = file.data[key];
	        if (value !== null && value !== undefined) {
	          querys.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	        }
	      }
	      var queryString = querys.length ? (file.putAction.indexOf('?') == -1 ? '?' : '&') + querys.join('&') : '';
	      var xhr = new XMLHttpRequest();
	      xhr.open('PUT', file.putAction + queryString);
	      return this.uploadXhr(xhr, file, file.file);
	    },
	    uploadHtml5: function uploadHtml5(file) {
	      var form = new window.FormData();
	      var value = void 0;
	      for (var key in file.data) {
	        value = file.data[key];
	        if (value && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && typeof value.toString !== 'function') {
	          form.append(key, (0, _stringify2.default)(value));
	        } else if (value !== null && value !== undefined) {
	          form.append(key, value);
	        }
	      }
	      form.append(this.name, file.file);
	      var xhr = new XMLHttpRequest();
	      xhr.open('POST', file.postAction);
	      return this.uploadXhr(xhr, file, form);
	    },
	    uploadXhr: function uploadXhr(xhr, file, data) {
	      var _this4 = this;
	
	      var speedTime = 0;
	      var speedLoaded = 0;
	
	      xhr.upload.onprogress = function (e) {
	        if (!e.lengthComputable || !(file = _this4.get(file)) || !file.active) {
	          return;
	        }
	
	        var speedTime2 = Math.round(Date.now() / 1000);
	        if (speedTime2 === speedTime) {
	          return;
	        }
	        speedTime = speedTime2;
	
	        file = _this4.update(file, {
	          progress: (e.loaded / e.total * 100).toFixed(2),
	          speed: e.loaded - speedLoaded
	        });
	        speedLoaded = e.loaded;
	      };
	
	      var interval = setInterval(function () {
	        file = _this4.get(file);
	        if (file && !file.success && !file.error && file.active) {
	          return;
	        }
	
	        if (interval) {
	          clearInterval(interval);
	          interval = false;
	        }
	
	        try {
	          xhr.abort();
	          xhr.timeout = 1;
	        } catch (e) {}
	      }, 100);
	
	      return new _promise2.default(function (resolve, reject) {
	        var complete = void 0;
	        var fn = function fn(e) {
	          if (complete) {
	            return;
	          }
	          complete = true;
	          if (interval) {
	            clearInterval(interval);
	            interval = false;
	          }
	
	          file = _this4.get(file);
	
	          if (!file) {
	            return reject('not_exists');
	          }
	
	          if (file.error) {
	            return reject(file.error);
	          }
	
	          if (!file.active) {
	            return reject('abort');
	          }
	
	          if (file.success) {
	            return resolve(file);
	          }
	
	          var data = {};
	
	          switch (e.type) {
	            case 'timeout':
	            case 'abort':
	              data.error = e.type;
	              break;
	            case 'error':
	              if (!xhr.status) {
	                data.error = 'network';
	              } else if (xhr.status >= 500) {
	                data.error = 'server';
	              } else if (xhr.status >= 400) {
	                data.error = 'denied';
	              }
	              break;
	            default:
	              if (xhr.status >= 500) {
	                data.error = 'server';
	              } else if (xhr.status >= 400) {
	                data.error = 'denied';
	              } else {
	                data.progress = '100.00';
	              }
	          }
	
	          if (xhr.responseText) {
	            var contentType = xhr.getResponseHeader('Content-Type');
	            if (contentType && contentType.indexOf('/json') != -1) {
	              data.response = JSON.parse(xhr.responseText);
	            } else {
	              data.response = xhr.responseText;
	            }
	          }
	
	          file = _this4.update(file, data);
	
	          if (file.error) {
	            return reject(file.error);
	          }
	
	          return resolve(file);
	        };
	
	        xhr.onload = fn;
	        xhr.onerror = fn;
	        xhr.onabort = fn;
	        xhr.ontimeout = fn;
	
	        if (file.timeout) {
	          xhr.timeout = file.timeout;
	        }
	
	        for (var key in file.headers) {
	          xhr.setRequestHeader(key, file.headers[key]);
	        }
	
	        file = _this4.update(file, { xhr: xhr });
	
	        xhr.send(data);
	      });
	    },
	    uploadHtml4: function uploadHtml4(file) {
	      var _this5 = this;
	
	      var onKeydown = function onKeydown(e) {
	        if (e.keyCode == 27) {
	          e.preventDefault();
	        }
	      };
	
	      var iframe = document.createElement('iframe');
	      iframe.id = 'upload-iframe-' + file.id;
	      iframe.name = 'upload-iframe-' + file.id;
	      iframe.src = 'about:blank';
	      iframe.setAttribute('style', 'width:1px;height:1px;top:-999em;position:absolute; margin-top:-999em;');
	
	      var form = document.createElement('form');
	
	      form.action = file.postAction;
	
	      form.name = 'upload-form-' + file.id;
	
	      form.setAttribute('method', 'POST');
	      form.setAttribute('target', 'upload-iframe-' + file.id);
	      form.setAttribute('enctype', 'multipart/form-data');
	
	      var value;
	      var input;
	      for (var key in file.data) {
	        value = file.data[key];
	        if (value && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) == 'object' && typeof value.toString != 'function') {
	          value = (0, _stringify2.default)(value);
	        }
	        if (value !== null && value !== undefined) {
	          input = document.createElement('input');
	          input.type = 'hidden';
	          input.name = key;
	          form.appendChild(input);
	        }
	      }
	      form.appendChild(file.el);
	
	      document.body.appendChild(iframe).appendChild(form);
	
	      var getResponseData = function getResponseData() {
	        var doc = void 0;
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
	
	      return new _promise2.default(function (resolve, reject) {
	        setTimeout(function () {
	          if (!(file = _this5.update(file, { iframe: iframe }))) {
	            return reject('not_exists');
	          }
	
	          var interval = setInterval(function () {
	            file = _this5.get(file);
	            if (file && !file.success && !file.error && file.active) {
	              return;
	            }
	            if (interval) {
	              clearInterval(interval);
	              interval = false;
	            }
	
	            if (!file || file.error) {
	              iframe.onabort({ type: file ? 'abort' : 'not_exists' });
	            }
	          }, 100);
	
	          var complete;
	          var fn = function fn(e) {
	            if (complete) {
	              return;
	            }
	            complete = true;
	
	            if (interval) {
	              clearInterval(interval);
	              interval = false;
	            }
	
	            document.body.removeEventListener('keydown', onKeydown);
	
	            file = _this5.get(file);
	
	            if (!file) {
	              return reject('not_exists');
	            }
	
	            if (file.error) {
	              return reject(file.error);
	            }
	
	            if (!file.active) {
	              return reject('abort');
	            }
	
	            if (file.success) {
	              return resolve(file);
	            }
	
	            var response = getResponseData();
	            var data = {};
	            switch (e.type) {
	              case 'abort':
	                data.error = 'abort';
	                break;
	              case 'error':
	                if (file.error) {
	                  data.error = file.error;
	                } else if (response === null) {
	                  data.error = 'network';
	                } else {
	                  data.error = 'denied';
	                }
	                break;
	              default:
	                if (file.error) {
	                  data.error = file.error;
	                } else if (data === null) {
	                  data.error = 'network';
	                } else {
	                  data.progress = '100.00';
	                }
	            }
	
	            if (response !== null) {
	              if (response && response.substr(0, 1) == '{' && response.substr(response.length - 1, 1) == '}') {
	                try {
	                  response = JSON.parse(response);
	                } catch (err) {}
	              }
	              data.response = response;
	            }
	
	            file = _this5.update(file, data);
	
	            if (file.error) {
	              return reject(file.error);
	            }
	
	            return resolve(file);
	          };
	
	          iframe.onload = fn;
	          iframe.onerror = fn;
	          iframe.onabort = fn;
	
	          document.body.addEventListener('keydown', onKeydown);
	
	          form.submit();
	        }, 50);
	      }).then(function (res) {
	        iframe.parentNode && iframe.parentNode.removeChild(iframe);
	        return res;
	      }).catch(function (res) {
	        iframe.parentNode && iframe.parentNode.removeChild(iframe);
	        return res;
	      });
	    },
	    watchActive: function watchActive(active) {
	      var file;
	      var index = 0;
	      while (file = this.files[index]) {
	        index++;
	        if (active && !this.destroy) {
	          if (this.uploading >= this.thread || this.uploading && !this.features.html5) {
	            break;
	          }
	          if (!file.active && !file.error && !file.success) {
	            this.update(file, { active: true });
	          }
	        } else {
	          if (file.active) {
	            this.update(file, { active: false });
	          }
	        }
	      }
	      if (this.uploading === 0) {
	        this.active = false;
	      }
	    },
	    watchDrop: function watchDrop(el) {
	      if (!this.features.drop) {
	        return;
	      }
	
	      if (this.dropElement) {
	        try {
	          window.document.removeEventListener('dragenter', this.onDragenter, false);
	          window.document.removeEventListener('dragleave', this.onDragleave, false);
	          this.dropElement.removeEventListener('dragover', this.onDragover, false);
	          this.dropElement.removeEventListener('drop', this.onDrop, false);
	        } catch (e) {}
	      }
	
	      if (!el) {
	        el = false;
	      } else if (typeof el == 'string') {
	        el = document.querySelector(el) || this.$root.$el.querySelector(el);
	      } else if (el === true) {
	        el = this.$parent.$el;
	      }
	
	      this.dropElement = el;
	
	      if (this.dropElement) {
	        window.document.addEventListener('dragenter', this.onDragenter, false);
	        window.document.addEventListener('dragleave', this.onDragleave, false);
	        this.dropElement.addEventListener('dragover', this.onDragover, false);
	        this.dropElement.addEventListener('drop', this.onDrop, false);
	      }
	    },
	    onDragenter: function onDragenter(e) {
	      e.preventDefault();
	      if (!this.dropActive) {
	        this.dropActive = true;
	      }
	    },
	    onDragleave: function onDragleave(e) {
	      e.preventDefault();
	      if (e.target.nodeName === 'HTML' || e.screenX == 0 && e.screenY == 0 && e.screenY == 0 && !e.fromElement && e.offsetX < 0) {
	        this.dropActive = false;
	      }
	    },
	    onDragover: function onDragover(e) {
	      e.preventDefault();
	    },
	    onDrop: function onDrop(e) {
	      e.preventDefault();
	      this.dropActive = false;
	      this.addDataTransfer(e.dataTransfer);
	    }
	  }
	};

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  methods: {
	    change: function change(e) {
	      this.$destroy();
	      this.$parent.addInputFile(e.target);
	      new this.constructor({
	        parent: this.$parent,
	        el: this.$el
	      });
	    }
	  }
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(110);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(63);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(68);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(67);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	__webpack_require__(100);
	module.exports = __webpack_require__(3).Array.from;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(102);
	module.exports = __webpack_require__(3).Object.assign;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(52);
	__webpack_require__(35);
	__webpack_require__(53);
	__webpack_require__(103);
	module.exports = __webpack_require__(3).Promise;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	__webpack_require__(52);
	__webpack_require__(105);
	__webpack_require__(106);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	__webpack_require__(53);
	module.exports = __webpack_require__(34).f('iterator');

/***/ }),
/* 77 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(9)
	  , toLength  = __webpack_require__(30)
	  , toIndex   = __webpack_require__(99);
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

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(4)
	  , createDesc      = __webpack_require__(17);
	
	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(16)
	  , gOPS    = __webpack_require__(26)
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

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(11)
	  , call        = __webpack_require__(43)
	  , isArrayIter = __webpack_require__(42)
	  , anObject    = __webpack_require__(5)
	  , toLength    = __webpack_require__(30)
	  , getIterFn   = __webpack_require__(51)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ }),
/* 83 */
/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(10);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(46)
	  , descriptor     = __webpack_require__(17)
	  , setToStringTag = __webpack_require__(20)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(8)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(16)
	  , toIObject = __webpack_require__(9);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(21)('meta')
	  , isObject = __webpack_require__(14)
	  , has      = __webpack_require__(7)
	  , setDesc  = __webpack_require__(4).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(13)(function(){
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

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(2)
	  , macrotask = __webpack_require__(50).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(10)(process) == 'process';
	
	module.exports = function(){
	  var head, last, notify;
	
	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };
	
	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(16)
	  , gOPS     = __webpack_require__(26)
	  , pIE      = __webpack_require__(19)
	  , toObject = __webpack_require__(31)
	  , IObject  = __webpack_require__(41)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(13)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(4)
	  , anObject = __webpack_require__(5)
	  , getKeys  = __webpack_require__(16);
	
	module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(19)
	  , createDesc     = __webpack_require__(17)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(32)
	  , has            = __webpack_require__(7)
	  , IE8_DOM_DEFINE = __webpack_require__(40)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(9)
	  , gOPN      = __webpack_require__(47).f
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


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(7)
	  , toObject    = __webpack_require__(31)
	  , IE_PROTO    = __webpack_require__(27)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(8);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(2)
	  , core        = __webpack_require__(3)
	  , dP          = __webpack_require__(4)
	  , DESCRIPTORS = __webpack_require__(6)
	  , SPECIES     = __webpack_require__(1)('species');
	
	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(5)
	  , aFunction = __webpack_require__(22)
	  , SPECIES   = __webpack_require__(1)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29)
	  , defined   = __webpack_require__(23);
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

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(11)
	  , $export        = __webpack_require__(12)
	  , toObject       = __webpack_require__(31)
	  , call           = __webpack_require__(43)
	  , isArrayIter    = __webpack_require__(42)
	  , toLength       = __webpack_require__(30)
	  , createProperty = __webpack_require__(80)
	  , getIterFn      = __webpack_require__(51);
	
	$export($export.S + $export.F * !__webpack_require__(45)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(77)
	  , step             = __webpack_require__(86)
	  , Iterators        = __webpack_require__(15)
	  , toIObject        = __webpack_require__(9);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(44)(Array, 'Array', function(iterated, kind){
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

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(12);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(90)});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(18)
	  , global             = __webpack_require__(2)
	  , ctx                = __webpack_require__(11)
	  , classof            = __webpack_require__(38)
	  , $export            = __webpack_require__(12)
	  , isObject           = __webpack_require__(14)
	  , aFunction          = __webpack_require__(22)
	  , anInstance         = __webpack_require__(78)
	  , forOf              = __webpack_require__(82)
	  , speciesConstructor = __webpack_require__(97)
	  , task               = __webpack_require__(50).set
	  , microtask          = __webpack_require__(89)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;
	
	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();
	
	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};
	
	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(95)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(20)($Promise, PROMISE);
	__webpack_require__(96)(PROMISE);
	Wrapper = __webpack_require__(3)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(45)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(2)
	  , has            = __webpack_require__(7)
	  , DESCRIPTORS    = __webpack_require__(6)
	  , $export        = __webpack_require__(12)
	  , redefine       = __webpack_require__(49)
	  , META           = __webpack_require__(88).KEY
	  , $fails         = __webpack_require__(13)
	  , shared         = __webpack_require__(28)
	  , setToStringTag = __webpack_require__(20)
	  , uid            = __webpack_require__(21)
	  , wks            = __webpack_require__(1)
	  , wksExt         = __webpack_require__(34)
	  , wksDefine      = __webpack_require__(33)
	  , keyOf          = __webpack_require__(87)
	  , enumKeys       = __webpack_require__(81)
	  , isArray        = __webpack_require__(84)
	  , anObject       = __webpack_require__(5)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(32)
	  , createDesc     = __webpack_require__(17)
	  , _create        = __webpack_require__(46)
	  , gOPNExt        = __webpack_require__(93)
	  , $GOPD          = __webpack_require__(92)
	  , $DP            = __webpack_require__(4)
	  , $keys          = __webpack_require__(16)
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
	  __webpack_require__(47).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(19).f  = $propertyIsEnumerable;
	  __webpack_require__(26).f = $getOwnPropertySymbols;
	
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(33)('asyncIterator');

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(33)('observable');

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(54)();
	// imports
	
	
	// module
	exports.push([module.id, ".home{position:relative}.file-uploads{font-size:18px;padding:.6em;font-weight:700;border:1px solid #888;background:#f3f3f3}.drop-active{top:0;bottom:0;right:0;left:0;position:absolute;opacity:.4;background:#000}button{padding:.6em}table{margin-bottom:2em}table td,table th{padding:.4em;border:1px solid #ddd}", ""]);
	
	// exports


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(54)();
	// imports
	
	
	// module
	exports.push([module.id, ".file-uploads{overflow:hidden;position:relative;text-align:center;display:inline-block}.file-uploads.file-uploads-html4 input[type=file]{opacity:0;font-size:20em;z-index:1;top:0;left:0;right:0;bottom:0;position:absolute;width:100%;height:100%}.file-uploads.file-uploads-html5 input[type=file]{overflow:hidden;position:fixed;width:1px;height:1px;z-index:-1;opacity:0}", ""]);
	
	// exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	
	/* styles */
	__webpack_require__(115)
	
	var Component = __webpack_require__(36)(
	  /* script */
	  __webpack_require__(59),
	  /* template */
	  __webpack_require__(113),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	
	module.exports = Component.exports


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	
	/* styles */
	__webpack_require__(116)
	
	var Component = __webpack_require__(36)(
	  /* script */
	  __webpack_require__(60),
	  /* template */
	  __webpack_require__(114),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	
	module.exports = Component.exports


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	var Component = __webpack_require__(36)(
	  /* script */
	  __webpack_require__(61),
	  /* template */
	  __webpack_require__(112),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	
	module.exports = Component.exports


/***/ }),
/* 112 */
/***/ (function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('input', {
	    attrs: {
	      "type": "file",
	      "name": _vm.$parent.name,
	      "id": _vm.$parent.inputId || _vm.$parent.name,
	      "accept": _vm.$parent.accept,
	      "webkitdirectory": _vm.$parent.directory && _vm.$parent.features.directory,
	      "directory": _vm.$parent.directory && _vm.$parent.features.directory,
	      "allowdir": _vm.$parent.directory && _vm.$parent.features.directory,
	      "multiple": _vm.$parent.multiple && _vm.$parent.features.html5
	    },
	    on: {
	      "change": _vm.change
	    }
	  })
	},staticRenderFns: []}

/***/ }),
/* 113 */
/***/ (function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('main', {
	    staticClass: "home"
	  }, [_c('div', {
	    attrs: {
	      "id": "lists"
	    }
	  }, [_c('table', [_vm._m(0), _vm._v(" "), _c('tbody', _vm._l((_vm.files), function(file, index) {
	    return _c('tr', {
	      key: file.id
	    }, [_c('td', [_vm._v(_vm._s(index))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.id))]), _vm._v(" "), (file.type.substr(0, 6) == 'image/' && file.blob) ? _c('td', [_c('img', {
	      attrs: {
	        "src": file.blob,
	        "width": "50",
	        "height": "auto"
	      }
	    })]) : _c('td'), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.name))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.progress))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm._f("formatSize")(file.speed)))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.active))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.error))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(file.success))]), _vm._v(" "), _c('td', [_c('button', {
	      attrs: {
	        "type": "button"
	      },
	      on: {
	        "click": function($event) {
	          $event.preventDefault();
	          _vm.abort(file)
	        }
	      }
	    }, [_vm._v("Abort")])]), _vm._v(" "), _c('td', [_c('button', {
	      attrs: {
	        "type": "button"
	      },
	      on: {
	        "click": function($event) {
	          $event.preventDefault();
	          _vm.customError(file)
	        }
	      }
	    }, [_vm._v("custom error")])]), _vm._v(" "), _c('td', [_c('button', {
	      attrs: {
	        "type": "button"
	      },
	      on: {
	        "click": function($event) {
	          $event.preventDefault();
	          _vm.remove(file)
	        }
	      }
	    }, [_vm._v("x")])])])
	  }))])]), _vm._v(" "), _c('div', {
	    attrs: {
	      "id": "options"
	    }
	  }, [_c('table', [_c('tbody', [_c('tr', [_c('td', [_c('file-upload', {
	    ref: "upload",
	    attrs: {
	      "post-action": _vm.postAction,
	      "put-action": _vm.putAction,
	      "extensions": _vm.extensions,
	      "accept": _vm.accept,
	      "multiple": _vm.multiple,
	      "directory": _vm.directory,
	      "size": _vm.size || 0,
	      "thread": _vm.thread < 1 ? 1 : (_vm.thread > 5 ? 5 : _vm.thread),
	      "headers": _vm.headers,
	      "data": _vm.data,
	      "drop": _vm.drop,
	      "drop-directory": _vm.dropDirectory
	    },
	    on: {
	      "input-filter": _vm.inputFilter,
	      "input-file": _vm.inputFile
	    },
	    model: {
	      value: (_vm.files),
	      callback: function($$v) {
	        _vm.files = $$v
	      },
	      expression: "files"
	    }
	  }, [_vm._v("\n              Add upload files\n            ")])], 1), _vm._v(" "), _c('td', [_c('button', {
	    on: {
	      "click": function($event) {
	        $event.preventDefault();
	        _vm.addDirectory($event)
	      }
	    }
	  }, [_vm._v("Add upload directory")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('span', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.$refs.upload && !_vm.$refs.upload.features.directory),
	      expression: "$refs.upload && !$refs.upload.features.directory"
	    }]
	  }, [_vm._v("Your browser does not support")])]), _vm._v(" "), _c('td', [_c('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!_vm.$refs.upload || !_vm.$refs.upload.active),
	      expression: "!$refs.upload || !$refs.upload.active"
	    }],
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        $event.preventDefault();
	        _vm.$refs.upload.active = true
	      }
	    }
	  }, [_vm._v("Start upload")]), _vm._v(" "), _c('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.$refs.upload && _vm.$refs.upload.active),
	      expression: "$refs.upload && $refs.upload.active"
	    }],
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        $event.preventDefault();
	        _vm.$refs.upload.active = false
	      }
	    }
	  }, [_vm._v("Stop upload")])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n                Auto start: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.auto),
	      expression: "auto"
	    }],
	    attrs: {
	      "type": "checkbox",
	      "id": "checkbox"
	    },
	    domProps: {
	      "checked": Array.isArray(_vm.auto) ? _vm._i(_vm.auto, null) > -1 : (_vm.auto)
	    },
	    on: {
	      "__c": function($event) {
	        var $$a = _vm.auto,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _vm._i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_vm.auto = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_vm.auto = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _vm.auto = $$c
	        }
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Accept: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.accept),
	      expression: "accept"
	    }],
	    attrs: {
	      "type": "text"
	    },
	    domProps: {
	      "value": (_vm.accept)
	    },
	    on: {
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.accept = $event.target.value
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Extensions: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.extensions),
	      expression: "extensions"
	    }],
	    attrs: {
	      "type": "text"
	    },
	    domProps: {
	      "value": (_vm.extensions)
	    },
	    on: {
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.extensions = $event.target.value
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Drop: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.drop),
	      expression: "drop"
	    }],
	    attrs: {
	      "type": "checkbox",
	      "id": "checkbox"
	    },
	    domProps: {
	      "checked": Array.isArray(_vm.drop) ? _vm._i(_vm.drop, null) > -1 : (_vm.drop)
	    },
	    on: {
	      "__c": function($event) {
	        var $$a = _vm.drop,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _vm._i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_vm.drop = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_vm.drop = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _vm.drop = $$c
	        }
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Max file size: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model.number",
	      value: (_vm.size),
	      expression: "size",
	      modifiers: {
	        "number": true
	      }
	    }],
	    attrs: {
	      "type": "text"
	    },
	    domProps: {
	      "value": (_vm.size)
	    },
	    on: {
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.size = _vm._n($event.target.value)
	      },
	      "blur": function($event) {
	        _vm.$forceUpdate()
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Multiple: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.multiple),
	      expression: "multiple"
	    }],
	    attrs: {
	      "type": "checkbox",
	      "id": "checkbox"
	    },
	    domProps: {
	      "checked": Array.isArray(_vm.multiple) ? _vm._i(_vm.multiple, null) > -1 : (_vm.multiple)
	    },
	    on: {
	      "__c": function($event) {
	        var $$a = _vm.multiple,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _vm._i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_vm.multiple = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_vm.multiple = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _vm.multiple = $$c
	        }
	      }
	    }
	  })])]), _vm._v(" "), _c('td', [_c('label', [_vm._v("\n              Thread: "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model.number",
	      value: (_vm.thread),
	      expression: "thread",
	      modifiers: {
	        "number": true
	      }
	    }],
	    attrs: {
	      "type": "text"
	    },
	    domProps: {
	      "value": (_vm.thread)
	    },
	    on: {
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.thread = _vm._n($event.target.value)
	      },
	      "blur": function($event) {
	        _vm.$forceUpdate()
	      }
	    }
	  })])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("\n            Auto start: " + _vm._s(_vm.auto) + "\n          ")]), _vm._v(" "), _c('td', [_vm._v("\n            Active: " + _vm._s(_vm.$refs.upload ? _vm.$refs.upload.active : false) + "\n          ")]), _vm._v(" "), _c('td', [_vm._v("\n            Uploaded: " + _vm._s(_vm.$refs.upload ? _vm.$refs.upload.uploaded : true) + "\n          ")]), _vm._v(" "), _c('td', [_vm._v("\n            Drop active: " + _vm._s(_vm.$refs.upload ? _vm.$refs.upload.dropActive : false) + "\n          ")]), _vm._v(" "), _c('td', [_c('label', {
	    attrs: {
	      "for": _vm.name
	    }
	  }, [_vm._v("Click")])])])])])]), _vm._v(" "), _c('h1', [_vm._v("Allow to drag and drop")]), _vm._v(" "), _c('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.$refs.upload && _vm.$refs.upload.dropActive),
	      expression: "$refs.upload && $refs.upload.dropActive"
	    }],
	    staticClass: "drop-active"
	  }, [_vm._v("\n    Drop ing\n  ")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('button', {
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        $event.preventDefault();
	        _vm.files = []
	      }
	    }
	  }, [_vm._v("Test overwrite files")])])
	},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('thead', [_c('tr', [_c('th', [_vm._v("Index")]), _vm._v(" "), _c('th', [_vm._v("ID")]), _vm._v(" "), _c('th', [_vm._v("Image")]), _vm._v(" "), _c('th', [_vm._v("Name")]), _vm._v(" "), _c('th', [_vm._v("Size")]), _vm._v(" "), _c('th', [_vm._v("Progress")]), _vm._v(" "), _c('th', [_vm._v("Speed")]), _vm._v(" "), _c('th', [_vm._v("Active")]), _vm._v(" "), _c('th', [_vm._v("Error")]), _vm._v(" "), _c('th', [_vm._v("Success")]), _vm._v(" "), _c('th', [_vm._v("Abort")]), _vm._v(" "), _c('th', [_vm._v("customError")]), _vm._v(" "), _c('th', [_vm._v("Delete")])])])
	}]}

/***/ }),
/* 114 */
/***/ (function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('label', {
	    class: _vm.className
	  }, [_c('input-file'), _vm._v(" "), _vm._t("default")], 2)
	},staticRenderFns: []}

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(107);
	if(typeof content === 'string') content = [[module.id, content, '']];
	if(content.locals) module.exports = content.locals;
	// add the styles to the DOM
	var update = __webpack_require__(55)("66054214", content, true);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(108);
	if(typeof content === 'string') content = [[module.id, content, '']];
	if(content.locals) module.exports = content.locals;
	// add the styles to the DOM
	var update = __webpack_require__(55)("2bbec363", content, true);

/***/ }),
/* 117 */
/***/ (function(module, exports) {

	/**
	 * Translates the list format produced by css-loader into something
	 * easier to manipulate.
	 */
	module.exports = function listToStyles (parentId, list) {
	  var styles = []
	  var newStyles = {}
	  for (var i = 0; i < list.length; i++) {
	    var item = list[i]
	    var id = item[0]
	    var css = item[1]
	    var media = item[2]
	    var sourceMap = item[3]
	    var part = {
	      id: parentId + ':' + i,
	      css: css,
	      media: media,
	      sourceMap: sourceMap
	    }
	    if (!newStyles[id]) {
	      styles.push(newStyles[id] = { id: id, parts: [part] })
	    } else {
	      newStyles[id].parts.push(part)
	    }
	  }
	  return styles
	}


/***/ }),
/* 118 */
/***/ (function(module, exports) {

	module.exports = Vuex;

/***/ })
/******/ ]);
//# sourceMappingURL=example.js.map