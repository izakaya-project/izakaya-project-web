(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":5}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":6}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":7}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":8}],5:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":37}],6:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":13,"../modules/es6.object.to-string":62,"../modules/es6.promise":63,"../modules/es6.string.iterator":64,"../modules/web.dom.iterable":66}],7:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":13,"../../modules/es6.symbol":65}],8:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":59,"../../modules/es6.string.iterator":64,"../../modules/web.dom.iterable":66}],9:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],10:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":30}],11:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":12,"./$.wks":59}],12:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],13:[function(require,module,exports){
var core = module.exports = {version: '1.2.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],14:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
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
},{"./$.a-function":9}],15:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":13,"./$.global":22}],16:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],17:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":22,"./$.is-object":30}],18:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":37}],19:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],20:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":10,"./$.ctx":14,"./$.is-array-iter":28,"./$.iter-call":31,"./$.to-length":56,"./core.get-iterator-method":60}],21:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":37,"./$.to-iobject":55}],22:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],23:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],24:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":37,"./$.property-desc":42,"./$.support-desc":51}],25:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":22}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":12}],28:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":36,"./$.wks":59}],29:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":12}],30:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],31:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
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
},{"./$.an-object":10}],32:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":37,"./$.hide":24,"./$.property-desc":42,"./$.tag":52,"./$.wks":59}],33:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      keys:    IS_SET            ? _default : createMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":37,"./$.def":15,"./$.has":23,"./$.hide":24,"./$.iter-create":32,"./$.iterators":36,"./$.library":39,"./$.redef":43,"./$.tag":52,"./$.wks":59}],34:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":59}],35:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],36:[function(require,module,exports){
module.exports = {};
},{}],37:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],38:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":37,"./$.to-iobject":55}],39:[function(require,module,exports){
module.exports = true;
},{}],40:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
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
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
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

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":12,"./$.global":22,"./$.task":53}],41:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":43}],42:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],43:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":24}],44:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],45:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":37,"./$.an-object":10,"./$.ctx":14,"./$.is-object":30}],46:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":22}],47:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":9,"./$.an-object":10,"./$.wks":59}],48:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":37,"./$.support-desc":51,"./$.wks":59}],49:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],50:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":16,"./$.to-integer":54}],51:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":19}],52:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":37,"./$.has":23,"./$.wks":59}],53:[function(require,module,exports){
'use strict';
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
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
var listner = function(event){
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
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
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
},{"./$.cof":12,"./$.ctx":14,"./$.dom-create":17,"./$.global":22,"./$.html":25,"./$.invoke":26}],54:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],55:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":16,"./$.iobject":27}],56:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":54}],57:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],58:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],59:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":22,"./$.shared":46,"./$.uid":57}],60:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":11,"./$.core":13,"./$.iterators":36,"./$.wks":59}],61:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
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

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":33,"./$.iter-step":35,"./$.iterators":36,"./$.to-iobject":55,"./$.unscope":58}],62:[function(require,module,exports){

},{}],63:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $def       = require('./$.def')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same')
  , species    = require('./$.species')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , RECORD     = require('./$.uid')('record')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.support-desc')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (speciesConstructor(this, P))(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
require('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = require('./$.core')[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":37,"./$.a-function":9,"./$.an-object":10,"./$.classof":11,"./$.core":13,"./$.ctx":14,"./$.def":15,"./$.for-of":20,"./$.global":22,"./$.is-object":30,"./$.iter-detect":34,"./$.library":39,"./$.microtask":40,"./$.mix":41,"./$.same":44,"./$.set-proto":45,"./$.species":48,"./$.species-constructor":47,"./$.strict-new":49,"./$.support-desc":51,"./$.tag":52,"./$.uid":57,"./$.wks":59}],64:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
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
},{"./$.iter-define":33,"./$.string-at":50}],65:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , SUPPORT_DESC   = require('./$.support-desc')
  , $def           = require('./$.def')
  , $redef         = require('./$.redef')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setTag         = require('./$.tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = SUPPORT_DESC && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
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
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !require('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
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
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"./$":37,"./$.an-object":10,"./$.def":15,"./$.enum-keys":18,"./$.fails":19,"./$.get-names":21,"./$.global":22,"./$.has":23,"./$.is-array":29,"./$.keyof":38,"./$.library":39,"./$.property-desc":42,"./$.redef":43,"./$.shared":46,"./$.support-desc":51,"./$.tag":52,"./$.to-iobject":55,"./$.uid":57,"./$.wks":59}],66:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":36,"./es6.array.iterator":61}],67:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

var _Symbol$iterator = require("babel-runtime/core-js/symbol/iterator")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Promise = require("babel-runtime/core-js/promise")["default"];

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof _Symbol === "function" && _Symbol$iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = _Object$create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(innerFn, self || null, new Context(tryLocsList || []));

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = _Object$create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument ? _Promise.resolve(value.arg).then(invokeNext, invokeThrow) : _Promise.resolve(value).then(function (unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration. If the Promise is rejected, however, the
        // result for this iteration will be rejected with the same
        // reason. Note that rejections of yielded Promises are not
        // thrown back into the generator function, as is the case
        // when an awaited Promise is rejected. This difference in
        // behavior between yield and await is important, because it
        // allows the consumer to decide what to do with the yielded
        // rejection (swallow it and continue, manually .throw it back
        // into the generator, abandon iteration, whatever). With
        // await, by contrast, there is no opportunity to examine the
        // rejection reason outside the generator function, so the
        // only option is to throw it from the await expression, and
        // let the generator function handle the exception.
        result.value = unwrapped;
        return result;
      });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(function () {
        return invoke(method, arg);
      }) : new _Promise(function (resolve) {
        resolve(invoke(method, arg));
      });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator.
      previousPromise = enqueueResult["catch"](function (ignored) {});

      return enqueueResult;
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":68,"babel-runtime/core-js/object/create":1,"babel-runtime/core-js/promise":2,"babel-runtime/core-js/symbol":3,"babel-runtime/core-js/symbol/iterator":4}],68:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

var GachaImages = [{ id: 'item0', src: '../images/gacha/beer2.png' }, { id: 'item1', src: '../images/gacha/beer2.png' }, { id: 'item2', src: '../images/gacha/beer2.png' }, { id: 'item3', src: '../images/gacha/beer2.png' }, { id: 'item4', src: '../images/gacha/beer2.png' }, { id: 'item5', src: '../images/gacha/beer2.png' }];

exports['default'] = GachaImages;
module.exports = exports['default'];

},{"../common/constants":73}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _gachaImages = require('./gacha-images');

var _gachaImages2 = _interopRequireDefault(_gachaImages);

var _gachaSounds = require('./gacha-sounds');

var _gachaSounds2 = _interopRequireDefault(_gachaSounds);

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

var _envEnv = require('../env/env');

var _envEnv2 = _interopRequireDefault(_envEnv);

var _commonUa = require('../common/ua');

var _commonUa2 = _interopRequireDefault(_commonUa);

var GachaSetup = (function () {
  function GachaSetup() {
    _classCallCheck(this, GachaSetup);

    this.loader = undefined;
    this.loadManifest = undefined;
  }

  _createClass(GachaSetup, null, [{
    key: 'getLoader',
    value: function getLoader() {
      return this.loader;
    }
  }, {
    key: 'preload',
    value: function preload() {
      var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      var dfd = $.Deferred();

      // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
      // Android4.2以下のBrowserだと、trueでは動かないのでfalseにしておく
      this.loader = new createjs.LoadQueue(false);
      this.loadManifest = _.union(_gachaImages2['default'], _gachaSounds2['default']);

      // Android4.2以下のBrowserだと、mp3再生ができないためデフォルトはoggを使うようにして、
      // oggが再生できない場合はmp3を使うようにしておく
      // via http://createjs.com/docs/soundjs/classes/Sound.html
      // Android Browserの場合、WebAudioPluginに対応していないと音が出ないので、
      // createjs.Sound.registerPluginsに渡す時点で分岐しておく
      // これをしないと、以下のようにAndroid Browserで音が出ない
      //iPhone5 7.1.2
      //  Safari ◯
      //iPhone6 8.3
      //  Safari ◯
      //
      //GALAXY S 4.4.2
      //  Browser ◯
      //  Chrome ◯
      //ARROWS NX 4.2.2
      //  Browser ◯
      //  Chrome ◯
      //htc 4.4.2
      //  Browser ☓
      //  Chrome ◯
      //XPERIA
      //  Browser ☓
      //  Chrome ◯
      if (_commonUa2['default'].isIPhone() || _commonUa2['default'].isIPad()) {
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
      } else {
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
      }
      createjs.Sound.alternateExtensions = ['mp3'];
      this.loader.installPlugin(createjs.Sound);

      // http1.1の仕様だと、
      // Safari mobile	6
      // Android browser	4
      // Chrome mobile	6
      // Firefox mobile	4
      // しか同時にリクエストできないため、6にしておく
      // via http://www.mobify.com/blog/domain-sharding-bad-news-mobile-performance/
      this.loader.setMaxConnections(6);

      // それぞれがロードされたタイミング
      this.loader.addEventListener('fileload', function (event) {
        //console.log('fileload: ', event);
      });

      // すべてのロードが終わったタイミング
      this.loader.addEventListener('complete', function (event) {
        console.log('fileload complete', event);

        dfd.resolve();

        cb();
      });

      this.loader.loadManifest(this.loadManifest);
      return dfd.promise();
    }
  }]);

  return GachaSetup;
})();

exports['default'] = GachaSetup;
module.exports = exports['default'];

},{"../common/constants":73,"../common/ua":74,"../env/env":78,"./gacha-images":69,"./gacha-sounds":71}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

var GachaSounds = [{ id: 'drop', src: '../sounds/stagecomplete.ogg' }];

exports['default'] = GachaSounds;
module.exports = exports['default'];

},{"../common/constants":73}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Gacha = (function () {
  function Gacha() {
    _classCallCheck(this, Gacha);
  }

  _createClass(Gacha, null, [{
    key: 'init',
    value: function init(selector, data) {
      console.log('gacha init');
      //init(selector);
    }
  }]);

  return Gacha;
})();

exports['default'] = Gacha;
module.exports = exports['default'];

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Constants = {
  okamisanWidth: 1440,
  okamisanHeight: 990,
  ojisanWidth: 375,
  ojisanHeight: 667,
  counterItemRect: 1200
};

exports["default"] = Constants;
module.exports = exports["default"];

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UA = (function () {
  function UA() {
    _classCallCheck(this, UA);

    this.userAgent = window.navigator.userAgent.toLowerCase();
  }

  _createClass(UA, [{
    key: 'lteIE9',
    value: function lteIE9() {
      return document.uniqueID && typeof window.matchMedia === 'undefined';
    }
  }, {
    key: 'isIE10',
    value: function isIE10() {
      return document.uniqueID && document.documentMode === 10;
    }
  }, {
    key: 'isIPhone',
    value: function isIPhone() {
      if (this.userAgent.match(/iPhone/i)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isIPad',
    value: function isIPad() {
      if (this.userAgent.match(/iPad/i)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isAndroid',
    value: function isAndroid() {
      if (this.userAgent.match(/Android/i)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isTablet',
    value: function isTablet() {
      if (this.userAgent.match(/Android/i) && !this.userAgent.match(/Mobile/i) || this.userAgent.match(/iPad/i)) {
        //console.log('tablet');
        return true;
      }

      return false;
    }
  }, {
    key: 'isSmartPhone',
    value: function isSmartPhone() {
      if (this.userAgent.match(/iPhone/i) && !this.userAgent.match(/iPad/i) || this.userAgent.match(/iPod/i) || this.userAgent.match(/Android/i) && this.userAgent.match(/Mobile/i)) {
        return true;
      }

      return false;
    }
  }]);

  return UA;
})();

exports['default'] = new UA();
module.exports = exports['default'];

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require("babel-runtime/regenerator/runtime");

var _pixiGachaBackground = require('../pixi/gacha-background');

var _pixiGachaBackground2 = _interopRequireDefault(_pixiGachaBackground);

var _canvasGacha = require('../canvas/gacha');

var _canvasGacha2 = _interopRequireDefault(_canvasGacha);

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

var _envEnv = require('../env/env');

var _envEnv2 = _interopRequireDefault(_envEnv);

var GachaComponent = React.createClass({
  displayName: 'GachaComponent',

  getInitialState: function getInitialState() {
    return {
      gachaImage: ''
    };
  },
  propTypes: {},
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  componentDidMount: function componentDidMount() {
    $(this.refs.gachaWrapper.getDOMNode()).hide();

    _pixiGachaBackground2['default'].init();
  },
  gachaStart: function gachaStart() {
    var _this = this;

    this.requestGacha(function (data) {
      var star = data.data.star;
      console.log('レア度：', star, data.data.gachaName);

      _this.setState({
        gachaImage: './images/gacha/' + data.data.gachaId + '_l.png'
      });
      _this.reset(_this.refs.resultStar2.getDOMNode());
      _this.reset(_this.refs.resultStar3.getDOMNode());
      _this.reset(_this.refs.resultStar4.getDOMNode());

      setTimeout(function () {
        _pixiGachaBackground2['default'].showEmitter();
      }, 900);

      $(_this.refs.gachaWrapper.getDOMNode()).fadeIn(function () {
        _this.animation(_this.refs['resultStar' + star].getDOMNode());
      });
    });

    var delay = function delay(t) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, t);
      });
    };
    var self = this;
    function gachaSceneHide() {
      return regeneratorRuntime.async(function gachaSceneHide$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(delay(8000));

          case 2:
            _pixiGachaBackground2['default'].hideEmitter();
            $(self.refs.gachaWrapper.getDOMNode()).fadeOut();

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
    gachaSceneHide();
  },
  requestGacha: function requestGacha(cb) {
    var xhr = $.ajax({
      url: _envEnv2['default'].serverDomain + this.props.source,
      type: 'POST',
      crossDomain: true,
      data: {},
      dataType: 'json'
    });

    xhr.done(function (data) {
      if (data.error) {
        console.log(data.error);
        return;
      }

      console.log(data);
      cb(data);

      //Gacha.init('make-gacha', data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    });
  },
  reset: function reset(element) {
    var result = $(element);
    var item = result.find('.item--li');
    $(item).velocity({
      translateY: '-1000px',
      rotateZ: 360
    }, {
      duration: 0
    }).css({
      left: 0
    });

    var star = result.find('.star--li');
    $(star).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });

    var message = result.find('.message--li');
    $(message).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });

    var g = result.find('.get--li');
    $(g).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });
  },
  animation: function animation(element) {
    var result = $(element);
    var item = result.find('.item--li');
    $(item).velocity({
      translateY: '+=1000px',
      rotateZ: 0
    }, {
      loop: false,
      duration: 1000,
      delay: 0,
      easing: 'spring',
      complete: function complete(elements) {}
    });

    var star = result.find('.star--li');
    setTimeout(function () {
      _.forEach(star, function (element, index) {
        $(element).velocity({
          scale: 1.5,
          opacity: 1,
          rotateZ: 0
        }, {
          loop: false,
          duration: 500,
          delay: 150 * index,
          easing: 'easeInExpo',
          complete: function complete(elements) {
            $(element).velocity({
              scale: 1
            }, {
              loop: false,
              duration: 500,
              delay: 100 * index,
              easing: 'easeInExpo',
              complete: function complete(elements) {}
            });
          }
        });
      });
    }, 1000);

    var message = result.find('.message--li');
    setTimeout(function () {
      _.forEach(message, function (element, index) {
        $(element).velocity({
          scale: 1.5,
          opacity: 1,
          rotateZ: 0
        }, {
          loop: false,
          duration: 500,
          delay: 150 * index,
          easing: 'easeInExpo',
          complete: function complete(elements) {
            $(element).velocity({
              scale: 1
            }, {
              loop: false,
              duration: 500,
              delay: 100 * index,
              easing: 'easeInExpo',
              complete: function complete(elements) {}
            });
          }
        });
      });
    }, 2500);

    var g = result.find('.get--li');
    setTimeout(function () {
      $(g).velocity({
        scale: 1.0,
        opacity: 1,
        rotateZ: 0
      }, {
        loop: false,
        duration: 1000,
        delay: 0,
        easing: 'swing',
        complete: function complete(elements) {}
      });
    }, 3500);
  },
  _beforeScene: function _beforeScene(e) {
    this.props.beforeScene(e);
  },
  render: function render() {
    return React.createElement(
      'div',
      { ref: 'gachaWrapper', className: 'gacha--wrapper' },
      React.createElement(
        'div',
        { className: 'gacha--background' },
        React.createElement(
          'p',
          null,
          React.createElement('img', { src: './images/ojisan/background.png', width: _commonConstants2['default'].ojisanWidth, height: _commonConstants2['default'].ojisanHeight })
        )
      ),
      React.createElement(
        'div',
        { className: 'gacha--canvas--wrapper' },
        React.createElement('canvas', { ref: 'makeGacha', id: 'gacha-canvas', className: 'gacha--canvas', width: _commonConstants2['default'].ojisanWidth, height: _commonConstants2['default'].ojisanHeight })
      ),
      React.createElement(
        'div',
        { className: 'gacha--object' },
        React.createElement(
          'div',
          { ref: 'resultStar2', className: 'gacha--object--star2' },
          React.createElement(
            'ul',
            { className: 'gacha--object--star2--stars' },
            React.createElement(
              'li',
              { className: 'gacha--object--star2--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star2--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star2--item' },
            React.createElement(
              'li',
              { className: 'gacha--object--star2--item-li item--li' },
              React.createElement('img', { src: this.state.gachaImage, width: '600', height: '415' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star2--message' },
            React.createElement(
              'li',
              { className: 'gacha--object--star2--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt3.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star2--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt4.png', width: '75', height: '75' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star2--get' },
            React.createElement(
              'li',
              { className: 'gacha--object--star2--get-li get--li' },
              React.createElement('img', { src: './images/ojisan/txt5.png', width: '289', height: '121' })
            )
          )
        ),
        React.createElement(
          'div',
          { ref: 'resultStar3', className: 'gacha--object--star3' },
          React.createElement(
            'ul',
            { className: 'gacha--object--star3--stars' },
            React.createElement(
              'li',
              { className: 'gacha--object--star3--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star3--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star3--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star3--item' },
            React.createElement(
              'li',
              { className: 'gacha--object--star3--item-li item--li' },
              React.createElement('img', { src: this.state.gachaImage, width: '600', height: '415' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star3--message' },
            React.createElement(
              'li',
              { className: 'gacha--object--star3--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt2.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star3--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt3.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star3--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt4.png', width: '75', height: '75' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star3--get' },
            React.createElement(
              'li',
              { className: 'gacha--object--star3--get-li get--li' },
              React.createElement('img', { src: './images/ojisan/txt5.png', width: '289', height: '121' })
            )
          )
        ),
        React.createElement(
          'div',
          { ref: 'resultStar4', className: 'gacha--object--star4' },
          React.createElement(
            'ul',
            { className: 'gacha--object--star4--stars' },
            React.createElement(
              'li',
              { className: 'gacha--object--star4--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--stars-li star--li' },
              React.createElement('img', { src: './images/ojisan/star.png', width: '78', height: '76' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star4--item' },
            React.createElement(
              'li',
              { className: 'gacha--object--star4--item-li item--li' },
              React.createElement('img', { src: this.state.gachaImage, width: '600', height: '415' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star4--message' },
            React.createElement(
              'li',
              { className: 'gacha--object--star4--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt1.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt2.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt3.png', width: '75', height: '75' })
            ),
            React.createElement(
              'li',
              { className: 'gacha--object--star4--message-li message--li' },
              React.createElement('img', { src: './images/ojisan/txt4.png', width: '75', height: '75' })
            )
          ),
          React.createElement(
            'ul',
            { className: 'gacha--object--star4--get' },
            React.createElement(
              'li',
              { className: 'gacha--object--star4--get-li get--li' },
              React.createElement('img', { src: './images/ojisan/txt5.png', width: '289', height: '121' })
            )
          )
        )
      )
    );
  }
});

exports['default'] = GachaComponent;
module.exports = exports['default'];

},{"../canvas/gacha":72,"../common/constants":73,"../env/env":78,"../pixi/gacha-background":80,"babel-runtime/regenerator/runtime":67}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require("babel-runtime/regenerator/runtime");

var _envEnvJs = require('../env/env.js');

var _envEnvJs2 = _interopRequireDefault(_envEnvJs);

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

// react
var LoadingComponent = React.createClass({
  displayName: 'LoadingComponent',

  propTypes: {},
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  getInitialState: function getInitialState() {
    return {};
  },
  componentDidMount: function componentDidMount() {
    this.animationStart();
  },
  animationStart: function animationStart() {
    var loading = $(this.refs.logo.getDOMNode());
    var wrapper = $(this.refs.wrapper.getDOMNode());

    $(loading).velocity({
      opacity: 1
    }, {
      loop: false,
      duration: 3000,
      delay: 0,
      easing: 'easeInOutCubic',
      complete: function complete(elements) {
        $(loading).velocity({
          opacity: 0
        }, {
          loop: false,
          duration: 3000,
          delay: 0,
          easing: 'easeInOutCubic',
          complete: function complete(elements) {}
        });

        $(wrapper).velocity({
          opacity: 0
        }, {
          loop: false,
          duration: 3000,
          delay: 0,
          easing: 'easeInOutCubic',
          complete: function complete(elements) {
            $(wrapper).hide();
          }
        });
      }
    });

    var delay = function delay(t) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, t);
      });
    };
    var self = this;
    function nextScene() {
      return regeneratorRuntime.async(function nextScene$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            console.log('start');
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(delay(6000));

          case 3:
            self.props.nextScene();
            console.log('end');

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
    nextScene();
  },
  animationStop: function animationStop() {},
  render: function render() {
    return React.createElement(
      'div',
      { ref: 'wrapper', className: 'loading--wrapper' },
      React.createElement(
        'div',
        { ref: 'logo', className: 'loading--logo' },
        React.createElement('img', { src: './images/ojisan/logo_splash.png', width: '240', height: '165' })
      )
    );
  }
});

exports['default'] = LoadingComponent;
module.exports = exports['default'];

},{"../common/constants":73,"../env/env.js":78,"babel-runtime/regenerator/runtime":67}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _canvasGachaSetup = require('../canvas/gacha-setup');

var _canvasGachaSetup2 = _interopRequireDefault(_canvasGachaSetup);

var _pixiOjisanBackground = require('../pixi/ojisan-background');

var _pixiOjisanBackground2 = _interopRequireDefault(_pixiOjisanBackground);

var _envEnvJs = require('../env/env.js');

var _envEnvJs2 = _interopRequireDefault(_envEnvJs);

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

// キャッシュをさせない（IEでは必須）
$.ajaxSetup({
  cache: false
});

// react
var OjisanComponent = React.createClass({
  displayName: 'OjisanComponent',

  propTypes: {
    source: React.PropTypes.string.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      source: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      results: []
    };
  },
  componentDidMount: function componentDidMount() {},
  _startGacha: function _startGacha(e) {
    createjs.Sound.play('drop', 'none', 0, 0, 0, 0.8, 0);

    this.props.nextScene(e);
  },
  reset: function reset(element) {
    $(element).velocity({
      translateY: '-1000px',
      opacity: 1
    }, {
      duration: 0
    });
  },
  ojisanAnimation: function ojisanAnimation(element) {
    var _this = this;

    $(element).velocity({
      translateY: '+=1000px'
    }, {
      loop: false,
      duration: 1000,
      delay: 0,
      easing: 'easeInExpo',
      complete: function complete(elements) {
        var ui = $(_this.refs.ui.getDOMNode());
        $(ui).fadeIn(1000);
      }
    });
  },
  animationStart: function animationStart() {
    var _this2 = this;

    $.when(_canvasGachaSetup2['default'].preload(function () {})).then(function () {
      var ojisan = $(_this2.refs.ojisan.getDOMNode());
      _this2.reset(ojisan);
      _this2.ojisanAnimation(ojisan);

      _pixiOjisanBackground2['default'].init();
    }, function () {
      return;
    });
  },
  animationStop: function animationStop() {},
  render: function render() {
    return React.createElement(
      'div',
      { className: 'ojisan--wrapper' },
      React.createElement(
        'div',
        { className: 'ojisan--background' },
        React.createElement(
          'p',
          null,
          React.createElement('img', { src: './images/ojisan/background.png', width: _commonConstants2['default'].ojisanWidth, height: _commonConstants2['default'].ojisanHeight })
        )
      ),
      React.createElement(
        'div',
        { className: 'ojisan--canvas' },
        React.createElement(
          'p',
          null,
          React.createElement('canvas', { id: 'ojisan-canvas', width: _commonConstants2['default'].ojisanWidth, height: _commonConstants2['default'].ojisanHeight })
        )
      ),
      React.createElement(
        'div',
        { className: 'ojisan--ojisan' },
        React.createElement(
          'p',
          { ref: 'ojisan', className: 'ojisan--ojisan--character' },
          React.createElement('img', { src: './images/ojisan/ojisan.png', width: '243', height: '226' })
        )
      ),
      React.createElement(
        'div',
        { className: 'ojisan--counter' },
        React.createElement(
          'p',
          null,
          React.createElement('img', { src: './images/ojisan/counter.png', width: _commonConstants2['default'].ojisanWidth, height: _commonConstants2['default'].ojisanHeight })
        )
      ),
      React.createElement(
        'div',
        { className: 'ojisan--message' },
        React.createElement(
          'p',
          { className: 'ojisan--message--title' },
          React.createElement('img', { src: './images/ojisan/logo.png', width: '240', height: '165' })
        )
      ),
      React.createElement(
        'div',
        { className: 'ojisan--ui' },
        React.createElement(
          'ul',
          { ref: 'ui', className: 'ojisan--ui--button' },
          React.createElement(
            'li',
            { className: 'ojisan--ui--button--li' },
            React.createElement('p', { className: 'ojisan--ui--button__koban' })
          ),
          React.createElement(
            'li',
            { className: 'ojisan--ui--button--li' },
            React.createElement('button', { className: 'ojisan--ui--button__gacha', onClick: this._startGacha })
          )
        )
      )
    );
  }
});

exports['default'] = OjisanComponent;
module.exports = exports['default'];

},{"../canvas/gacha-setup":70,"../common/constants":73,"../env/env.js":78,"../pixi/ojisan-background":81}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Env = {
  envName: 'local',
  serverDomain: [location.protocol, '//', document.domain, ':', '3000'].join('')
};

exports['default'] = Env;
module.exports = exports['default'];

},{}],79:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsOjisanComponent = require('./components/ojisan-component');

var _componentsOjisanComponent2 = _interopRequireDefault(_componentsOjisanComponent);

var _componentsGachaComponent = require('./components/gacha-component');

var _componentsGachaComponent2 = _interopRequireDefault(_componentsGachaComponent);

var _componentsLoadingComponent = require('./components/loading-component');

var _componentsLoadingComponent2 = _interopRequireDefault(_componentsLoadingComponent);

console.log('ojisan');

var Ojisan = React.createClass({
  displayName: 'Ojisan',

  getInitialState: function getInitialState() {
    return {};
  },
  propTypes: {},
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  componentDidMount: function componentDidMount() {},
  init: function init() {
    this.refs.ojisan.animationStart();
  },
  nextScene: function nextScene() {
    this.refs.gacha.gachaStart();
  },
  beforeScene: function beforeScene(e) {
    e.preventDefault();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(_componentsOjisanComponent2['default'], { ref: 'ojisan',
        nextScene: this.nextScene
      }),
      React.createElement(_componentsGachaComponent2['default'], { ref: 'gacha',
        beforeScene: this.beforeScene,
        source: '/gacha'
      }),
      React.createElement(_componentsLoadingComponent2['default'], { ref: 'loading',
        nextScene: this.init
      })
    );
  }
});

var component = React.render(React.createElement(Ojisan, null), document.getElementById('contents'));

function init() {
  //component.init();

  // 画面の要素を選択できないようにする
  $('body').on('selectstart', function (e) {
    e.preventDefault();
  });
}

init();

},{"./components/gacha-component":75,"./components/loading-component":76,"./components/ojisan-component":77}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _commonConstants = require('../common/constants');

var _commonConstants2 = _interopRequireDefault(_commonConstants);

var O = (function () {
  function O() {
    _classCallCheck(this, O);
  }

  _createClass(O, null, [{
    key: 'init',
    value: function init() {
      var _this = this;

      /* the window.onload is ABSOLUTELY essential, otherwise opening and closing Iframes does not work;*/
      var myView = document.getElementById('gacha-canvas');
      var renderer = PIXI.autoDetectRenderer(375, 667, { view: myView, transparent: true });
      //document.body.appendChild(renderer.view);

      // create the root of the scene graph
      var stage = new PIXI.Container();

      // create a new background sprite
      //var background = new PIXI.Sprite.fromImage('./images/ojisan/BGrotate2.jpg');
      //stage.addChild(background);

      var emitterContainer = new PIXI.ParticleContainer();
      emitterContainer.setProperties({
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
      });
      stage.addChild(emitterContainer);

      this.emitter = new cloudkid.Emitter(emitterContainer, [PIXI.Texture.fromImage('./images/gacha/particle.png')], {
        "alpha": {
          "start": 1,
          "end": 0
        },
        "scale": {
          "start": 0.5,
          "end": 1.0,
          "minimumScaleMultiplier": 1
        },
        "color": {
          "start": "#e4f9ff",
          "end": "#3fcbff"
        },
        "speed": {
          "start": 500,
          "end": 800
        },
        "acceleration": {
          "x": 0,
          "y": 50
        },
        "startRotation": {
          "min": 0,
          "max": 360
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 0.2,
          "max": 1.0
        },
        "blendMode": "normal",
        "frequency": 0.005,
        "emitterLifetime": -1,
        "maxParticles": 400,
        "pos": {
          "x": _commonConstants2['default'].ojisanWidth / 2,
          "y": _commonConstants2['default'].ojisanHeight / 2
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 0
        }
      });

      // Calculate the current time
      var elapsed = Date.now();

      // Update function every frame
      var update = function update() {

        // Update the next frame
        requestAnimationFrame(update);

        var now = Date.now();

        // The emitter requires the elapsed
        // number of seconds since the last update
        _this.emitter.update((now - elapsed) * 0.001);
        elapsed = now;

        // Should re-render the PIXI Stage
        renderer.render(stage);
      };

      this.emitter.emit = false;

      // Start the update
      update();
    }
  }, {
    key: 'showEmitter',
    value: function showEmitter() {
      this.emitter.emit = true;
    }
  }, {
    key: 'hideEmitter',
    value: function hideEmitter() {
      this.emitter.emit = false;
    }
  }]);

  return O;
})();

exports['default'] = O;
module.exports = exports['default'];

},{"../common/constants":73}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var O = (function () {
  function O() {
    _classCallCheck(this, O);
  }

  _createClass(O, null, [{
    key: 'init',
    value: function init() {
      /* the window.onload is ABSOLUTELY essential, otherwise opening and closing Iframes does not work;*/
      var myView = document.getElementById('ojisan-canvas');
      var renderer = PIXI.autoDetectRenderer(375, 667, { view: myView, transparent: true });
      //document.body.appendChild(renderer.view);

      // create the root of the scene graph
      var stage = new PIXI.Container();

      // create a new background sprite
      //var background = new PIXI.Sprite.fromImage('./images/ojisan/BGrotate2.jpg');
      //stage.addChild(background);

      // create an array to store a reference to the dudes
      var dudeArray = [];

      var totaldudes = 8;

      for (var i = 1; i <= totaldudes; i++) {
        // create a new Sprite that uses the image name that we just generated as its source
        var dude = PIXI.Sprite.fromImage('./images/gacha/item' + _.padLeft(i, 2, '0') + '_s.png');

        dude.anchor.set(0.5);

        // set a random scale for the dude
        dude.scale.set(0.8 + Math.random() * 0.3);

        // finally let's set the dude to be at a random position...
        dude.position.x = Math.floor(Math.random() * renderer.width);
        dude.position.y = Math.floor(Math.random() * renderer.height);

        // The important bit of this example, this is how you change the default blend mode of the sprite
        dude.blendMode = PIXI.BLEND_MODES.ADD;

        // create some extra properties that will control movement
        dude.direction = Math.random() * Math.PI * 2;

        // this number will be used to modify the direction of the dude over time
        dude.turningSpeed = Math.random() - 0.8;

        // create a random speed for the dude between 0 - 2
        dude.speed = 2 + Math.random() * 2;

        // finally we push the dude into the dudeArray so it it can be easily accessed later
        dudeArray.push(dude);

        stage.addChild(dude);
      }

      // create a bounding box box for the little dudes
      var dudeBoundsPadding = 100;

      var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding, -dudeBoundsPadding, renderer.width + dudeBoundsPadding * 2, renderer.height + dudeBoundsPadding * 2);

      var tick = 0;

      requestAnimationFrame(animate);

      function animate() {
        // iterate through the dudes and update the positions
        for (var i = 0; i < dudeArray.length; i++) {
          var dude = dudeArray[i];
          dude.direction += dude.turningSpeed * 0.01;
          dude.position.x += Math.sin(dude.direction) * dude.speed;
          dude.position.y += Math.cos(dude.direction) * dude.speed;
          dude.rotation = -dude.direction - Math.PI / 2;

          // wrap the dudes by testing their bounds...
          if (dude.position.x < dudeBounds.x) {
            dude.position.x += dudeBounds.width;
          } else if (dude.position.x > dudeBounds.x + dudeBounds.width) {
            dude.position.x -= dudeBounds.width;
          }

          if (dude.position.y < dudeBounds.y) {
            dude.position.y += dudeBounds.height;
          } else if (dude.position.y > dudeBounds.y + dudeBounds.height) {
            dude.position.y -= dudeBounds.height;
          }
        }

        // increment the ticker
        tick += 0.1;

        // time to render the stage !
        renderer.render(stage);

        // request another animation frame...
        requestAnimationFrame(animate);
      }
    }
  }]);

  return O;
})();

exports['default'] = O;
module.exports = exports['default'];

},{}]},{},[79])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmN0eC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZmluZWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLXN0ZXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1peC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnByb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5yZWRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNhbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmljdC1uZXcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdXBwb3J0LWRlc2MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50YWcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50YXNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC51aWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9jYW52YXMvZ2FjaGEtaW1hZ2VzLmpzIiwiL1VzZXJzL3loaXNhbWF0c3UvXy9qcy1kZXYvaXpha2F5YS1wcm9qZWN0LWRldmVsb3Avc291cmNlL2phdmFzY3JpcHRzL2NhbnZhcy9nYWNoYS1zZXR1cC5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9jYW52YXMvZ2FjaGEtc291bmRzLmpzIiwiL1VzZXJzL3loaXNhbWF0c3UvXy9qcy1kZXYvaXpha2F5YS1wcm9qZWN0LWRldmVsb3Avc291cmNlL2phdmFzY3JpcHRzL2NhbnZhcy9nYWNoYS5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9jb21tb24vY29uc3RhbnRzLmpzIiwiL1VzZXJzL3loaXNhbWF0c3UvXy9qcy1kZXYvaXpha2F5YS1wcm9qZWN0LWRldmVsb3Avc291cmNlL2phdmFzY3JpcHRzL2NvbW1vbi91YS5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9jb21wb25lbnRzL2dhY2hhLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9jb21wb25lbnRzL2xvYWRpbmctY29tcG9uZW50LmpzIiwiL1VzZXJzL3loaXNhbWF0c3UvXy9qcy1kZXYvaXpha2F5YS1wcm9qZWN0LWRldmVsb3Avc291cmNlL2phdmFzY3JpcHRzL2NvbXBvbmVudHMvb2ppc2FuLWNvbXBvbmVudC5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9lbnYvZW52LmpzIiwiL1VzZXJzL3loaXNhbWF0c3UvXy9qcy1kZXYvaXpha2F5YS1wcm9qZWN0LWRldmVsb3Avc291cmNlL2phdmFzY3JpcHRzL29qaXNhbi5qcyIsIi9Vc2Vycy95aGlzYW1hdHN1L18vanMtZGV2L2l6YWtheWEtcHJvamVjdC1kZXZlbG9wL3NvdXJjZS9qYXZhc2NyaXB0cy9waXhpL2dhY2hhLWJhY2tncm91bmQuanMiLCIvVXNlcnMveWhpc2FtYXRzdS9fL2pzLWRldi9pemFrYXlhLXByb2plY3QtZGV2ZWxvcC9zb3VyY2UvamF2YXNjcmlwdHMvcGl4aS9vamlzYW4tYmFja2dyb3VuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDam5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OytCQzNGYyxxQkFBcUI7Ozs7QUFFbkMsSUFBSSxXQUFX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Ozs7QUFHWixnQkFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7O0FBR3ZCLDZCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2hDO0tBQ0Y7OztTQWpHRyxDQUFDOzs7cUJBb0dRLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2xcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpe1xuICByZXR1cm4gJC5jcmVhdGUoUCwgRCk7XG59OyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLndrcycpKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuMyd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBjdHggPSBmdW5jdGlvbihmbiwgdGhhdCl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbnZhciAkZGVmID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgJGRlZi5HXG4gICAgLCBpc1Byb3RvICA9IHR5cGUgJiAkZGVmLlBcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiB0eXBlICYgJGRlZi5TXG4gICAgICAgID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gISh0eXBlICYgJGRlZi5GKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGlmKGlzR2xvYmFsICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nKWV4cCA9IHNvdXJjZVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5XICYmIHRhcmdldFtrZXldID09IG91dCkhZnVuY3Rpb24oQyl7XG4gICAgICBleHAgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIGV4cFtQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgIH0ob3V0KTtcbiAgICBlbHNlIGV4cCA9IGlzUHJvdG8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0XG4gICAgZXhwb3J0c1trZXldID0gZXhwO1xuICAgIGlmKGlzUHJvdG8pKGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pKVtrZXldID0gb3V0O1xuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcbiRkZWYuUyA9IDQ7ICAvLyBzdGF0aWNcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xuJGRlZi5CID0gMTY7IC8vIGJpbmRcbiRkZWYuVyA9IDMyOyAvLyB3cmFwXG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gJC5pc0VudW1cbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi8kLnRvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xuICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gIH1cbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGdldE5hbWVzICA9IHJlcXVpcmUoJy4vJCcpLmdldE5hbWVzO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbihpdCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdldE5hbWVzKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIGlmKHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nKXJldHVybiBnZXRXaW5kb3dOYW1lcyhpdCk7XG4gIHJldHVybiBnZXROYW1lcyh0b0lPYmplY3QoaXQpKTtcbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLnN1cHBvcnQtZGVzYycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIChJdGVyYXRvcnMuQXJyYXkgfHwgQXJyYXkucHJvdG90eXBlW0lURVJBVE9SXSkgPT09IGl0O1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpKDEsbmV4dCl9KTtcbiAgcmVxdWlyZSgnLi8kLnRhZycpKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgID0gcmVxdWlyZSgnLi8kLmxpYnJhcnknKVxuICAsICRkZWYgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZicpXG4gICwgaGlkZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIGhhcyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIEJVR0dZICAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgID0gJ3ZhbHVlcyc7XG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XG4gIHJlcXVpcmUoJy4vJC5pdGVyLWNyZWF0ZScpKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsIF9uYXRpdmUgID0gcHJvdG9bU1lNQk9MX0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgX2RlZmF1bHQgPSBfbmF0aXZlIHx8IGNyZWF0ZU1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKF9uYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvKF9kZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgcmVxdWlyZSgnLi8kLnRhZycpKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgIC8vIEZGIGZpeFxuICAgIGlmKCFMSUJSQVJZICYmIGhhcyhwcm90bywgRkZfSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIFNZTUJPTF9JVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCFMSUJSQVJZIHx8IEZPUkNFKWhpZGUocHJvdG8sIFNZTUJPTF9JVEVSQVRPUiwgX2RlZmF1bHQpO1xuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IF9kZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGQVVMVCA9PSBWQUxVRVMgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6IERFRkFVTFQgIT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoJ2VudHJpZXMnKVxuICAgIH07XG4gICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkcmVkZWYocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBCVUdHWSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbn07IiwidmFyIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyAgICA9IGZhbHNlO1xudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbU1lNQk9MX0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHNhZmUgPSB0cnVlOyB9O1xuICAgIGFycltTWU1CT0xfSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyICRPYmplY3QgPSBPYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiAgICAgJE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgICRPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG4gIGlzRW51bTogICAgIHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICBnZXREZXNjOiAgICAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgc2V0RGVzY3M6ICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICAkT2JqZWN0LmtleXMsXG4gIGdldE5hbWVzOiAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgZ2V0U3ltYm9sczogJE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGVhY2g6ICAgICAgIFtdLmZvckVhY2hcbn07IiwidmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaW5kZXggID0gMFxuICAgICwga2V5O1xuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vJC50YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGRvbWFpbjtcbiAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpe1xuICAgIHByb2Nlc3MuZG9tYWluID0gbnVsbDtcbiAgICBwYXJlbnQuZXhpdCgpO1xuICB9XG4gIHdoaWxlKGhlYWQpe1xuICAgIGRvbWFpbiA9IGhlYWQuZG9tYWluO1xuICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICBoZWFkLmZuLmNhbGwoKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gMVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAtdG9nZ2xlO1xuICB9O1xuLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbi8vIC0gc2V0SW1tZWRpYXRlXG4vLyAtIE1lc3NhZ2VDaGFubmVsXG4vLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4vLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuLy8gLSBzZXRUaW1lb3V0XG59IGVsc2Uge1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhc2FwKGZuKXtcbiAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWQsIGRvbWFpbjogaXNOb2RlICYmIHByb2Nlc3MuZG9tYWlufTtcbiAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICBpZighaGVhZCl7XG4gICAgaGVhZCA9IHRhc2s7XG4gICAgbm90aWZ5KCk7XG4gIH0gbGFzdCA9IHRhc2s7XG59OyIsInZhciAkcmVkZWYgPSByZXF1aXJlKCcuLyQucmVkZWYnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpJHJlZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIHJldHVybiB0YXJnZXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5oaWRlJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgZ2V0RGVzYyAgPSByZXF1aXJlKCcuLyQnKS5nZXREZXNjXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxyXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXHJcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXHJcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcclxuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xyXG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcclxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDKXtcbiAgaWYocmVxdWlyZSgnLi8kLnN1cHBvcnQtZGVzYycpICYmICEoU1BFQ0lFUyBpbiBDKSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXG4gICAgICB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpXG4gICwgU3ltYm9sID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLlN5bWJvbDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFN5bWJvbCAmJiBTeW1ib2xbbmFtZV0gfHwgKFN5bWJvbCB8fCByZXF1aXJlKCcuLyQudWlkJykpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBzZXRVbnNjb3BlID0gcmVxdWlyZSgnLi8kLnVuc2NvcGUnKVxuICAsIHN0ZXAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnNldFVuc2NvcGUoJ2tleXMnKTtcbnNldFVuc2NvcGUoJ3ZhbHVlcycpO1xuc2V0VW5zY29wZSgnZW50cmllcycpOyIsIiIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBMSUJSQVJZICAgID0gcmVxdWlyZSgnLi8kLmxpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjdHggICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY2xhc3NvZiAgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCAkZGVmICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgaXNPYmplY3QgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIHN0cmljdE5ldyAgPSByZXF1aXJlKCcuLyQuc3RyaWN0LW5ldycpXG4gICwgZm9yT2YgICAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHNldFByb3RvICAgPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0XG4gICwgc2FtZSAgICAgICA9IHJlcXVpcmUoJy4vJC5zYW1lJylcbiAgLCBzcGVjaWVzICAgID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxuICAsIFNQRUNJRVMgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vJC5zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCBSRUNPUkQgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpKCdyZWNvcmQnKVxuICAsIGFzYXAgICAgICAgPSByZXF1aXJlKCcuLyQubWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgID0gJ1Byb21pc2UnXG4gICwgcHJvY2VzcyAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgUCAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59O1xuXG52YXIgdXNlTmF0aXZlID0gZnVuY3Rpb24oKXtcbiAgdmFyIHdvcmtzID0gZmFsc2U7XG4gIGZ1bmN0aW9uIFAyKHgpe1xuICAgIHZhciBzZWxmID0gbmV3IFAoeCk7XG4gICAgc2V0UHJvdG8oc2VsZiwgUDIucHJvdG90eXBlKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuICB0cnkge1xuICAgIHdvcmtzID0gUCAmJiBQLnJlc29sdmUgJiYgdGVzdFJlc29sdmUoKTtcbiAgICBzZXRQcm90byhQMiwgUCk7XG4gICAgUDIucHJvdG90eXBlID0gJC5jcmVhdGUoUC5wcm90b3R5cGUsIHtjb25zdHJ1Y3Rvcjoge3ZhbHVlOiBQMn19KTtcbiAgICAvLyBhY3R1YWwgRmlyZWZveCBoYXMgYnJva2VuIHN1YmNsYXNzIHN1cHBvcnQsIHRlc3QgdGhhdFxuICAgIGlmKCEoUDIucmVzb2x2ZSg1KS50aGVuKGZ1bmN0aW9uKCl7fSkgaW5zdGFuY2VvZiBQMikpe1xuICAgICAgd29ya3MgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gYWN0dWFsIFY4IGJ1ZywgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxNjJcbiAgICBpZih3b3JrcyAmJiByZXF1aXJlKCcuLyQuc3VwcG9ydC1kZXNjJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzUHJvbWlzZSA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAodXNlTmF0aXZlID8gY2xhc3NvZihpdCkgPT0gJ1Byb21pc2UnIDogUkVDT1JEIGluIGl0KTtcbn07XG52YXIgc2FtZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oYSwgYil7XG4gIC8vIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgaWYoTElCUkFSWSAmJiBhID09PSBQICYmIGIgPT09IFdyYXBwZXIpcmV0dXJuIHRydWU7XG4gIHJldHVybiBzYW1lKGEsIGIpO1xufTtcbnZhciBnZXRDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdO1xuICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocmVjb3JkLCBpc1JlamVjdCl7XG4gIGlmKHJlY29yZC5uKXJldHVybjtcbiAgcmVjb3JkLm4gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgYXNhcChmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0KXtcbiAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXG4gICAgICAgICwgcmV0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoY2Ipe1xuICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XG4gICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xuICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XG4gICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xuICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcmVhY3QucmVqKGVycik7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICAgIHJlY29yZC5uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3Qpc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXG4gICAgLCBjaGFpbiAgPSByZWNvcmQuYSB8fCByZWNvcmQuY1xuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVhY3Q7XG4gIGlmKHJlY29yZC5oKXJldHVybiBmYWxzZTtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3QgPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0LmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0LlApKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXM7XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICByZWNvcmQudiA9IHZhbHVlO1xuICByZWNvcmQucyA9IDI7XG4gIHJlY29yZC5hID0gcmVjb3JkLmMuc2xpY2UoKTtcbiAgbm90aWZ5KHJlY29yZCwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIGFzYXAoZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCF1c2VOYXRpdmUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgcDogc3RyaWN0TmV3KHRoaXMsIFAsIFBST01JU0UpLCAgICAgICAgIC8vIDwtIHByb21pc2VcbiAgICAgIGM6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICAgIGE6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgICAgczogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgICBkOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gZG9uZVxuICAgICAgdjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICBoOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gaGFuZGxlZCByZWplY3Rpb25cbiAgICAgIG46IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgICB9O1xuICAgIHRoaXNbUkVDT1JEXSA9IHJlY29yZDtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5taXgnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3QgPSB7XG4gICAgICAgIG9rOiAgIHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlLFxuICAgICAgICBmYWlsOiB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcbiAgICAgIH07XG4gICAgICB2YXIgcHJvbWlzZSA9IHJlYWN0LlAgPSBuZXcgKHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBQKSkoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgICByZWFjdC5yZXMgPSByZXM7XG4gICAgICAgIHJlYWN0LnJlaiA9IHJlajtcbiAgICAgIH0pO1xuICAgICAgYUZ1bmN0aW9uKHJlYWN0LnJlcyk7XG4gICAgICBhRnVuY3Rpb24ocmVhY3QucmVqKTtcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzW1JFQ09SRF07XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0KTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3QpO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIGV4cG9ydFxuJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCB7UHJvbWlzZTogUH0pO1xucmVxdWlyZSgnLi8kLnRhZycpKFAsIFBST01JU0UpO1xuc3BlY2llcyhQKTtcbnNwZWNpZXMoV3JhcHBlciA9IHJlcXVpcmUoJy4vJC5jb3JlJylbUFJPTUlTRV0pO1xuXG4vLyBzdGF0aWNzXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uKHJlcywgcmVqKXsgcmVqKHIpOyB9KTtcbiAgfVxufSk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICghdXNlTmF0aXZlIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICByZXR1cm4gaXNQcm9taXNlKHgpICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKVxuICAgICAgPyB4IDogbmV3IHRoaXMoZnVuY3Rpb24ocmVzKXsgcmVzKHgpOyB9KTtcbiAgfVxufSk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICEodXNlTmF0aXZlICYmIHJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICBQLmFsbChpdGVyKVsnY2F0Y2gnXShmdW5jdGlvbigpe30pO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIHZhbHVlcyA9IFtdO1xuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXMocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlaik7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzKHJlc3VsdHMpO1xuICAgIH0pO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDID0gZ2V0Q29uc3RydWN0b3IodGhpcyk7XG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKHJlcywgcmVqKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhhcycpXG4gICwgU1VQUE9SVF9ERVNDICAgPSByZXF1aXJlKCcuLyQuc3VwcG9ydC1kZXNjJylcbiAgLCAkZGVmICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJylcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCBzZXRUYWcgICAgICAgICA9IHJlcXVpcmUoJy4vJC50YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgJG5hbWVzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vJC5lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIGdldERlc2MgICAgICAgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgICAgICAgPSAkLnNldERlc2NcbiAgLCBfY3JlYXRlICAgICAgICA9ICQuY3JlYXRlXG4gICwgZ2V0TmFtZXMgICAgICAgPSAkbmFtZXMuZ2V0XG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgc2V0dGVyICAgICAgICAgPSBmYWxzZVxuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBpc0VudW0gICAgICAgICA9ICQuaXNFbnVtXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIHVzZU5hdGl2ZSAgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IFNVUFBPUlRfREVTQyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoc2V0RGVzYyh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gc2V0RGVzYyh0aGlzLCAnYScsIHt2YWx1ZTogN30pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gIHZhciBwcm90b0Rlc2MgPSBnZXREZXNjKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIHNldERlc2MoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pc2V0RGVzYyhPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IHNldERlc2M7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24odGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpO1xuICBzeW0uX2sgPSB0YWc7XG4gIFNVUFBPUlRfREVTQyAmJiBzZXR0ZXIgJiYgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvSU9iamVjdChpdCksIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgLCBpICAgID0gMVxuICAgICwgJCQgICA9IGFyZ3VtZW50c1xuICAgICwgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgd2hpbGUoJCQubGVuZ3RoID4gaSlhcmdzLnB1c2goJCRbaSsrXSk7XG4gIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gIGlmKCRyZXBsYWNlciB8fCAhaXNBcnJheShyZXBsYWNlcikpcmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICBpZigkcmVwbGFjZXIpdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgfTtcbiAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG59O1xudmFyIGJ1Z2d5SlNPTiA9ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighdXNlTmF0aXZlKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKGlzU3ltYm9sKHRoaXMpKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG4gICAgcmV0dXJuIHdyYXAodWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKSk7XG4gIH07XG4gICRyZWRlZigkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgaXNTeW1ib2wgPSBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbiAgfTtcblxuICAkLmNyZWF0ZSAgICAgPSAkY3JlYXRlO1xuICAkLmlzRW51bSAgICAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gICQuZ2V0RGVzYyAgICA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICQuc2V0RGVzYyAgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgJC5zZXREZXNjcyAgID0gJGRlZmluZVByb3BlcnRpZXM7XG4gICQuZ2V0TmFtZXMgICA9ICRuYW1lcy5nZXQgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihTVVBQT1JUX0RFU0MgJiYgIXJlcXVpcmUoJy4vJC5saWJyYXJ5Jykpe1xuICAgICRyZWRlZihPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxufVxuXG52YXIgc3ltYm9sU3RhdGljcyA9IHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICByZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufTtcbi8vIDE5LjQuMi4yIFN5bWJvbC5oYXNJbnN0YW5jZVxuLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXG4vLyAxOS40LjIuNiBTeW1ib2wubWF0Y2hcbi8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXG4vLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcbi8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcbi8vIDE5LjQuMi4xMyBTeW1ib2wudG9TdHJpbmdUYWdcbi8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcbiQuZWFjaC5jYWxsKChcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCwnICtcbiAgJ3NwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHN5bSA9IHdrcyhpdCk7XG4gIHN5bWJvbFN0YXRpY3NbaXRdID0gdXNlTmF0aXZlID8gc3ltIDogd3JhcChzeW0pO1xufSk7XG5cbnNldHRlciA9IHRydWU7XG5cbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbiRkZWYoJGRlZi5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XG5cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoIXVzZU5hdGl2ZSB8fCBidWdneUpTT04pLCAnSlNPTicsIHtzdHJpbmdpZnk6ICRzdHJpbmdpZnl9KTtcblxuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKTtcbkl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEl0ZXJhdG9ycy5IVE1MQ29sbGVjdGlvbiA9IEl0ZXJhdG9ycy5BcnJheTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9TeW1ib2wgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfU3ltYm9sJGl0ZXJhdG9yID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wvaXRlcmF0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1Byb21pc2UgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2VcIilbXCJkZWZhdWx0XCJdO1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSB0eXBlb2YgX1N5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIF9TeW1ib2wkaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gX09iamVjdCRjcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYgfHwgbnVsbCwgbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIiA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IF9PYmplY3QkY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50YCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4gU29tZSBtYXkgY29uc2lkZXIgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgdG9vXG4gIC8vIGN1dGVzeSwgYnV0IHRoZXkgYXJlIGN1cm11ZGdlb25zLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBuZXcgQXdhaXRBcmd1bWVudChhcmcpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEF3YWl0QXJndW1lbnQoYXJnKSB7XG4gICAgdGhpcy5hcmcgPSBhcmc7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIC8vIFRoaXMgaW52b2tlIGZ1bmN0aW9uIGlzIHdyaXR0ZW4gaW4gYSBzdHlsZSB0aGF0IGFzc3VtZXMgc29tZVxuICAgIC8vIGNhbGxpbmcgZnVuY3Rpb24gKG9yIFByb21pc2UpIHdpbGwgaGFuZGxlIGV4Y2VwdGlvbnMuXG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gZ2VuZXJhdG9yW21ldGhvZF0oYXJnKTtcbiAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnQgPyBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlLmFyZykudGhlbihpbnZva2VOZXh0LCBpbnZva2VUaHJvdykgOiBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh1bndyYXBwZWQpIHtcbiAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy5kb21haW4pIHtcbiAgICAgIGludm9rZSA9IHByb2Nlc3MuZG9tYWluLmJpbmQoaW52b2tlKTtcbiAgICB9XG5cbiAgICB2YXIgaW52b2tlTmV4dCA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgIHZhciBpbnZva2VUaHJvdyA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJ0aHJvd1wiKTtcbiAgICB2YXIgaW52b2tlUmV0dXJuID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInJldHVyblwiKTtcbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgdmFyIGVucXVldWVSZXN1bHQgPVxuICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KSA6IG5ldyBfUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICByZXNvbHZlKGludm9rZShtZXRob2QsIGFyZykpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGVucXVldWVSZXN1bHQgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnlcbiAgICAgIC8vIGxhdGVyIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgIHByZXZpb3VzUHJvbWlzZSA9IGVucXVldWVSZXN1bHRbXCJjYXRjaFwiXShmdW5jdGlvbiAoaWdub3JlZCkge30pO1xuXG4gICAgICByZXR1cm4gZW5xdWV1ZVJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24gKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcih3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiIHx8IG1ldGhvZCA9PT0gXCJ0aHJvd1wiICYmIGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gQSByZXR1cm4gb3IgdGhyb3cgKHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyB0aHJvd1xuICAgICAgICAgICAgLy8gbWV0aG9kKSBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgICAgdmFyIHJldHVybk1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdO1xuICAgICAgICAgICAgaWYgKHJldHVybk1ldGhvZCkge1xuICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gocmV0dXJuTWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmV0dXJuIG1ldGhvZCB0aHJldyBhbiBleGNlcHRpb24sIGxldCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gZXhjZXB0aW9uIHByZXZhaWwgb3ZlciB0aGUgb3JpZ2luYWwgcmV0dXJuIG9yIHRocm93LlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgb3V0ZXIgcmV0dXJuLCBub3cgdGhhdCB0aGUgZGVsZWdhdGVcbiAgICAgICAgICAgICAgLy8gaXRlcmF0b3IgaGFzIGJlZW4gdGVybWluYXRlZC5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0sIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBMaWtlIHJldHVybmluZyBnZW5lcmF0b3IudGhyb3codW5jYXVnaHQpLCBidXQgd2l0aG91dCB0aGVcbiAgICAgICAgICAgIC8vIG92ZXJoZWFkIG9mIGFuIGV4dHJhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGVsZWdhdGUgZ2VuZXJhdG9yIHJhbiBhbmQgaGFuZGxlZCBpdHMgb3duIGV4Y2VwdGlvbnMgc29cbiAgICAgICAgICAvLyByZWdhcmRsZXNzIG9mIHdoYXQgdGhlIG1ldGhvZCB3YXMsIHdlIGNvbnRpbnVlIGFzIGlmIGl0IGlzXG4gICAgICAgICAgLy8gXCJuZXh0XCIgd2l0aCBhbiB1bmRlZmluZWQgYXJnLlxuICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcbiAgICAgICAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkWWllbGQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IGFyZztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmUgPyBHZW5TdGF0ZUNvbXBsZXRlZCA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC5kZWxlZ2F0ZSAmJiBtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgdGhpcy5zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiYgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiYgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gZGlzcGF0Y2hFeGNlcHRpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG4gICAgICAgIHJldHVybiAhIWNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbiBhYnJ1cHQodHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiYgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJiB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiYgKHR5cGUgPT09IFwiYnJlYWtcIiB8fCB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8IHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24gX2NhdGNoKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbiBkZWxlZ2F0ZVlpZWxkKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4vLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4vLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3Rcbi8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG50eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6IHVuZGVmaW5lZCk7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgQyBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJ1xuXG52YXIgR2FjaGFJbWFnZXMgPSBbXG4gIHtpZDogJ2l0ZW0wJyAsIHNyYzogJy4uL2ltYWdlcy9nYWNoYS9iZWVyMi5wbmcnfSxcbiAge2lkOiAnaXRlbTEnICwgc3JjOiAnLi4vaW1hZ2VzL2dhY2hhL2JlZXIyLnBuZyd9LFxuICB7aWQ6ICdpdGVtMicgLCBzcmM6ICcuLi9pbWFnZXMvZ2FjaGEvYmVlcjIucG5nJ30sXG4gIHtpZDogJ2l0ZW0zJyAsIHNyYzogJy4uL2ltYWdlcy9nYWNoYS9iZWVyMi5wbmcnfSxcbiAge2lkOiAnaXRlbTQnICwgc3JjOiAnLi4vaW1hZ2VzL2dhY2hhL2JlZXIyLnBuZyd9LFxuICB7aWQ6ICdpdGVtNScgLCBzcmM6ICcuLi9pbWFnZXMvZ2FjaGEvYmVlcjIucG5nJ31cbl07XG5cbmV4cG9ydCBkZWZhdWx0IEdhY2hhSW1hZ2VzO1xuIiwiaW1wb3J0IEdhY2hhSW1hZ2VzIGZyb20gJy4vZ2FjaGEtaW1hZ2VzJztcbmltcG9ydCBHYWNoYVNvdW5kcyBmcm9tICcuL2dhY2hhLXNvdW5kcyc7XG5pbXBvcnQgQyBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJ1xuaW1wb3J0IEVudiBmcm9tICcuLi9lbnYvZW52J1xuaW1wb3J0IFVBIGZyb20gJy4uL2NvbW1vbi91YSdcblxuY2xhc3MgR2FjaGFTZXR1cCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubG9hZGVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubG9hZE1hbmlmZXN0ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RhdGljIGdldExvYWRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkZXI7XG4gIH1cblxuICBzdGF0aWMgcHJlbG9hZChjYj1mdW5jdGlvbigpe30pIHtcbiAgICBsZXQgZGZkID0gJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAvLyDlvJXmlbDjgatmYWxzZeOCkuaMh+WumuOBmeOCi+OBqFhIUuOCkuS9v+OCj+OBmnRhZ+OBq+OCiOOCi+iqreOBv+i+vOOBv+OCkuihjOOBhOOBvuOBmVxuICAgIC8vIEFuZHJvaWQ0LjLku6XkuIvjga5Ccm93c2Vy44Gg44Go44CBdHJ1ZeOBp+OBr+WLleOBi+OBquOBhOOBruOBp2ZhbHNl44Gr44GX44Gm44GK44GPXG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTtcbiAgICB0aGlzLmxvYWRNYW5pZmVzdCA9IF8udW5pb24oR2FjaGFJbWFnZXMsIEdhY2hhU291bmRzKTtcblxuICAgIC8vIEFuZHJvaWQ0LjLku6XkuIvjga5Ccm93c2Vy44Gg44Go44CBbXAz5YaN55Sf44GM44Gn44GN44Gq44GE44Gf44KB44OH44OV44Kp44Or44OI44Gvb2dn44KS5L2/44GG44KI44GG44Gr44GX44Gm44CBXG4gICAgLy8gb2dn44GM5YaN55Sf44Gn44GN44Gq44GE5aC05ZCI44GvbXAz44KS5L2/44GG44KI44GG44Gr44GX44Gm44GK44GPXG4gICAgLy8gdmlhIGh0dHA6Ly9jcmVhdGVqcy5jb20vZG9jcy9zb3VuZGpzL2NsYXNzZXMvU291bmQuaHRtbFxuICAgIC8vIEFuZHJvaWQgQnJvd3NlcuOBruWgtOWQiOOAgVdlYkF1ZGlvUGx1Z2lu44Gr5a++5b+c44GX44Gm44GE44Gq44GE44Go6Z+z44GM5Ye644Gq44GE44Gu44Gn44CBXG4gICAgLy8gY3JlYXRlanMuU291bmQucmVnaXN0ZXJQbHVnaW5z44Gr5rih44GZ5pmC54K544Gn5YiG5bKQ44GX44Gm44GK44GPXG4gICAgLy8g44GT44KM44KS44GX44Gq44GE44Go44CB5Lul5LiL44Gu44KI44GG44GrQW5kcm9pZCBCcm93c2Vy44Gn6Z+z44GM5Ye644Gq44GEXG4gICAgLy9pUGhvbmU1IDcuMS4yXG4gICAgLy8gIFNhZmFyaSDil69cbiAgICAvL2lQaG9uZTYgOC4zXG4gICAgLy8gIFNhZmFyaSDil69cbiAgICAvL1xuICAgIC8vR0FMQVhZIFMgNC40LjJcbiAgICAvLyAgQnJvd3NlciDil69cbiAgICAvLyAgQ2hyb21lIOKXr1xuICAgIC8vQVJST1dTIE5YIDQuMi4yXG4gICAgLy8gIEJyb3dzZXIg4pevXG4gICAgLy8gIENocm9tZSDil69cbiAgICAvL2h0YyA0LjQuMlxuICAgIC8vICBCcm93c2VyIOKYk1xuICAgIC8vICBDaHJvbWUg4pevXG4gICAgLy9YUEVSSUFcbiAgICAvLyAgQnJvd3NlciDimJNcbiAgICAvLyAgQ2hyb21lIOKXr1xuICAgIGlmIChVQS5pc0lQaG9uZSgpIHx8IFVBLmlzSVBhZCgpKSB7XG4gICAgICBjcmVhdGVqcy5Tb3VuZC5yZWdpc3RlclBsdWdpbnMoW2NyZWF0ZWpzLldlYkF1ZGlvUGx1Z2luLCBjcmVhdGVqcy5IVE1MQXVkaW9QbHVnaW5dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3JlYXRlanMuU291bmQucmVnaXN0ZXJQbHVnaW5zKFtjcmVhdGVqcy5IVE1MQXVkaW9QbHVnaW5dKTtcbiAgICB9XG4gICAgY3JlYXRlanMuU291bmQuYWx0ZXJuYXRlRXh0ZW5zaW9ucyA9IFsnbXAzJ107XG4gICAgdGhpcy5sb2FkZXIuaW5zdGFsbFBsdWdpbihjcmVhdGVqcy5Tb3VuZCk7XG5cbiAgICAvLyBodHRwMS4x44Gu5LuV5qeY44Gg44Go44CBXG4gICAgLy8gU2FmYXJpIG1vYmlsZVx0NlxuICAgIC8vIEFuZHJvaWQgYnJvd3Nlclx0NFxuICAgIC8vIENocm9tZSBtb2JpbGVcdDZcbiAgICAvLyBGaXJlZm94IG1vYmlsZVx0NFxuICAgIC8vIOOBl+OBi+WQjOaZguOBq+ODquOCr+OCqOOCueODiOOBp+OBjeOBquOBhOOBn+OCgeOAgTbjgavjgZfjgabjgYrjgY9cbiAgICAvLyB2aWEgaHR0cDovL3d3dy5tb2JpZnkuY29tL2Jsb2cvZG9tYWluLXNoYXJkaW5nLWJhZC1uZXdzLW1vYmlsZS1wZXJmb3JtYW5jZS9cbiAgICB0aGlzLmxvYWRlci5zZXRNYXhDb25uZWN0aW9ucyg2KTtcblxuICAgIC8vIOOBneOCjOOBnuOCjOOBjOODreODvOODieOBleOCjOOBn+OCv+OCpOODn+ODs+OCsFxuICAgIHRoaXMubG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbGVsb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ2ZpbGVsb2FkOiAnLCBldmVudCk7XG4gICAgfSk7XG5cbiAgICAvLyDjgZnjgbnjgabjga7jg63jg7zjg4njgYzntYLjgo/jgaPjgZ/jgr/jgqTjg5/jg7PjgrBcbiAgICB0aGlzLmxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmxvZygnZmlsZWxvYWQgY29tcGxldGUnLCBldmVudCk7XG5cbiAgICAgIGRmZC5yZXNvbHZlKCk7XG5cbiAgICAgIGNiKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmxvYWRlci5sb2FkTWFuaWZlc3QodGhpcy5sb2FkTWFuaWZlc3QpO1xuICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhY2hhU2V0dXA7XG4iLCJpbXBvcnQgQyBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJ1xuXG52YXIgR2FjaGFTb3VuZHMgPSBbXG4gIHtpZDogJ2Ryb3AnICwgc3JjOiAnLi4vc291bmRzL3N0YWdlY29tcGxldGUub2dnJ31cbl07XG5cbmV4cG9ydCBkZWZhdWx0IEdhY2hhU291bmRzO1xuIiwiY2xhc3MgR2FjaGEge1xuICBzdGF0aWMgaW5pdChzZWxlY3RvciwgZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdnYWNoYSBpbml0Jyk7XG4gICAgLy9pbml0KHNlbGVjdG9yKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYWNoYTtcbiIsInZhciBDb25zdGFudHMgPSB7XG4gIG9rYW1pc2FuV2lkdGg6IDE0NDAsXG4gIG9rYW1pc2FuSGVpZ2h0OiA5OTAsXG4gIG9qaXNhbldpZHRoOiAzNzUsXG4gIG9qaXNhbkhlaWdodDogNjY3LFxuICBjb3VudGVySXRlbVJlY3Q6IDEyMDBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbnN0YW50cztcbiIsImNsYXNzIFVBIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgbHRlSUU5KCkge1xuICAgIHJldHVybiBkb2N1bWVudC51bmlxdWVJRCAmJiB0eXBlb2Ygd2luZG93Lm1hdGNoTWVkaWEgPT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgaXNJRTEwKCkge1xuICAgIHJldHVybiBkb2N1bWVudC51bmlxdWVJRCAmJiBkb2N1bWVudC5kb2N1bWVudE1vZGUgPT09IDEwO1xuICB9XG5cbiAgaXNJUGhvbmUoKSB7XG4gICAgaWYgKHRoaXMudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzSVBhZCgpIHtcbiAgICBpZiAodGhpcy51c2VyQWdlbnQubWF0Y2goL2lQYWQvaSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzQW5kcm9pZCgpIHtcbiAgICBpZiAodGhpcy51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzVGFibGV0KCkge1xuICAgIGlmKCh0aGlzLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSAmJiAhdGhpcy51c2VyQWdlbnQubWF0Y2goL01vYmlsZS9pKSkgfHxcbiAgICAgIHRoaXMudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCd0YWJsZXQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzU21hcnRQaG9uZSgpIHtcbiAgICBpZiAoKHRoaXMudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkgJiYgIXRoaXMudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpKSB8fFxuICAgICAgKHRoaXMudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpKSB8fFxuICAgICAgKHRoaXMudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpICYmIHRoaXMudXNlckFnZW50Lm1hdGNoKC9Nb2JpbGUvaSkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFVBKCk7XG4iLCJpbXBvcnQgXCJiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL3J1bnRpbWVcIjtcblxuaW1wb3J0IEdhY2hhQ2FudmFzIGZyb20gJy4uL3BpeGkvZ2FjaGEtYmFja2dyb3VuZCc7XG5pbXBvcnQgR2FjaGEgZnJvbSAnLi4vY2FudmFzL2dhY2hhJztcbmltcG9ydCBDIGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnXG5pbXBvcnQgRW52IGZyb20gJy4uL2Vudi9lbnYnO1xuXG52YXIgR2FjaGFDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2FjaGFJbWFnZTogJydcbiAgICB9O1xuICB9LFxuICBwcm9wVHlwZXM6IHtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgJCh0aGlzLnJlZnMuZ2FjaGFXcmFwcGVyLmdldERPTU5vZGUoKSkuaGlkZSgpO1xuXG4gICAgR2FjaGFDYW52YXMuaW5pdCgpO1xuICB9LFxuICBnYWNoYVN0YXJ0KCkge1xuICAgIHRoaXMucmVxdWVzdEdhY2hhKChkYXRhKSA9PiB7XG4gICAgICB2YXIgc3RhciA9IGRhdGEuZGF0YS5zdGFyO1xuICAgICAgY29uc29sZS5sb2coJ+ODrOOCouW6pu+8micsIHN0YXIsIGRhdGEuZGF0YS5nYWNoYU5hbWUpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZ2FjaGFJbWFnZTogYC4vaW1hZ2VzL2dhY2hhLyR7ZGF0YS5kYXRhLmdhY2hhSWR9X2wucG5nYFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlc2V0KHRoaXMucmVmcy5yZXN1bHRTdGFyMi5nZXRET01Ob2RlKCkpO1xuICAgICAgdGhpcy5yZXNldCh0aGlzLnJlZnMucmVzdWx0U3RhcjMuZ2V0RE9NTm9kZSgpKTtcbiAgICAgIHRoaXMucmVzZXQodGhpcy5yZWZzLnJlc3VsdFN0YXI0LmdldERPTU5vZGUoKSk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBHYWNoYUNhbnZhcy5zaG93RW1pdHRlcigpO1xuICAgICAgfSwgOTAwKTtcblxuICAgICAgJCh0aGlzLnJlZnMuZ2FjaGFXcmFwcGVyLmdldERPTU5vZGUoKSkuZmFkZUluKCgpID0+IHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24odGhpcy5yZWZzWydyZXN1bHRTdGFyJyArIHN0YXJdLmdldERPTU5vZGUoKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlbGF5ID0gdCA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdCkpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBhc3luYyBmdW5jdGlvbiBnYWNoYVNjZW5lSGlkZSgpIHtcbiAgICAgIGF3YWl0IGRlbGF5KDgwMDApO1xuICAgICAgR2FjaGFDYW52YXMuaGlkZUVtaXR0ZXIoKTtcbiAgICAgICQoc2VsZi5yZWZzLmdhY2hhV3JhcHBlci5nZXRET01Ob2RlKCkpLmZhZGVPdXQoKTtcbiAgICB9XG4gICAgZ2FjaGFTY2VuZUhpZGUoKTtcbiAgfSxcbiAgcmVxdWVzdEdhY2hhKGNiKSB7XG4gICAgdmFyIHhociA9ICQuYWpheCh7XG4gICAgICB1cmw6RW52LnNlcnZlckRvbWFpbiArIHRoaXMucHJvcHMuc291cmNlLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICBkYXRhOiB7fSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICB9KTtcblxuICAgIHhoclxuICAgICAgLmRvbmUoKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgY2IoZGF0YSk7XG5cbiAgICAgICAgLy9HYWNoYS5pbml0KCdtYWtlLWdhY2hhJywgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgfSk7XG4gIH0sXG4gIHJlc2V0KGVsZW1lbnQpIHtcbiAgICB2YXIgcmVzdWx0ID0gJChlbGVtZW50KTtcbiAgICB2YXIgaXRlbSA9IHJlc3VsdC5maW5kKCcuaXRlbS0tbGknKTtcbiAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgIHRyYW5zbGF0ZVk6ICctMTAwMHB4JyxcbiAgICAgIHJvdGF0ZVo6IDM2MFxuICAgIH0sIHtcbiAgICAgIGR1cmF0aW9uOiAwXG4gICAgfSkuY3NzKHtcbiAgICAgIGxlZnQ6IDBcbiAgICB9KTtcblxuICAgIHZhciBzdGFyID0gcmVzdWx0LmZpbmQoJy5zdGFyLS1saScpO1xuICAgICQoc3RhcikudmVsb2NpdHkoe1xuICAgICAgc2NhbGU6IDAsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgcm90YXRlWjogNzIwXG4gICAgfSwge1xuICAgICAgZHVyYXRpb246IDBcbiAgICB9KTtcblxuICAgIHZhciBtZXNzYWdlID0gcmVzdWx0LmZpbmQoJy5tZXNzYWdlLS1saScpO1xuICAgICQobWVzc2FnZSkudmVsb2NpdHkoe1xuICAgICAgc2NhbGU6IDAsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgcm90YXRlWjogNzIwXG4gICAgfSwge1xuICAgICAgZHVyYXRpb246IDBcbiAgICB9KTtcblxuICAgIHZhciBnID0gcmVzdWx0LmZpbmQoJy5nZXQtLWxpJyk7XG4gICAgJChnKS52ZWxvY2l0eSh7XG4gICAgICBzY2FsZTogMCxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICByb3RhdGVaOiA3MjBcbiAgICB9LCB7XG4gICAgICBkdXJhdGlvbjogMFxuICAgIH0pO1xuICB9LFxuICBhbmltYXRpb24oZWxlbWVudCkge1xuICAgIHZhciByZXN1bHQgPSAkKGVsZW1lbnQpO1xuICAgIHZhciBpdGVtID0gcmVzdWx0LmZpbmQoJy5pdGVtLS1saScpO1xuICAgICQoaXRlbSkudmVsb2NpdHkoe1xuICAgICAgdHJhbnNsYXRlWTogJys9MTAwMHB4JyxcbiAgICAgIHJvdGF0ZVo6IDBcbiAgICB9LCB7XG4gICAgICBsb29wOiBmYWxzZSxcbiAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgZGVsYXk6IDAsXG4gICAgICBlYXNpbmc6ICdzcHJpbmcnLFxuICAgICAgY29tcGxldGU6IChlbGVtZW50cykgPT4ge1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHN0YXIgPSByZXN1bHQuZmluZCgnLnN0YXItLWxpJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBfLmZvckVhY2goc3RhciwgKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICQoZWxlbWVudCkudmVsb2NpdHkoe1xuICAgICAgICAgIHNjYWxlOiAxLjUsXG4gICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICByb3RhdGVaOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgIGRlbGF5OiAxNTAgKiBpbmRleCxcbiAgICAgICAgICBlYXNpbmc6ICdlYXNlSW5FeHBvJyxcbiAgICAgICAgICBjb21wbGV0ZTogKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgIGRlbGF5OiAxMDAgKiBpbmRleCxcbiAgICAgICAgICAgICAgZWFzaW5nOiAnZWFzZUluRXhwbycsXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiAoZWxlbWVudHMpID0+IHtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMDApO1xuXG4gICAgdmFyIG1lc3NhZ2UgPSByZXN1bHQuZmluZCgnLm1lc3NhZ2UtLWxpJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBfLmZvckVhY2gobWVzc2FnZSwgKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICQoZWxlbWVudCkudmVsb2NpdHkoe1xuICAgICAgICAgIHNjYWxlOiAxLjUsXG4gICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICByb3RhdGVaOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICAgIGRlbGF5OiAxNTAgKiBpbmRleCxcbiAgICAgICAgICBlYXNpbmc6ICdlYXNlSW5FeHBvJyxcbiAgICAgICAgICBjb21wbGV0ZTogKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgIGRlbGF5OiAxMDAgKiBpbmRleCxcbiAgICAgICAgICAgICAgZWFzaW5nOiAnZWFzZUluRXhwbycsXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiAoZWxlbWVudHMpID0+IHtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIDI1MDApO1xuXG4gICAgdmFyIGcgPSByZXN1bHQuZmluZCgnLmdldC0tbGknKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoZykudmVsb2NpdHkoe1xuICAgICAgICBzY2FsZTogMS4wLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICByb3RhdGVaOiAwXG4gICAgICB9LCB7XG4gICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICAgICAgY29tcGxldGU6IChlbGVtZW50cykgPT4ge1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCAzNTAwKTtcbiAgfSxcbiAgX2JlZm9yZVNjZW5lKGUpIHtcbiAgICB0aGlzLnByb3BzLmJlZm9yZVNjZW5lKGUpO1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwiZ2FjaGFXcmFwcGVyXCIgY2xhc3NOYW1lPVwiZ2FjaGEtLXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnYWNoYS0tYmFja2dyb3VuZFwiPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vYmFja2dyb3VuZC5wbmdcIiB3aWR0aD17Qy5vamlzYW5XaWR0aH0gaGVpZ2h0PXtDLm9qaXNhbkhlaWdodH0vPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2FjaGEtLWNhbnZhcy0td3JhcHBlclwiPlxuICAgICAgICAgIDxjYW52YXMgcmVmPVwibWFrZUdhY2hhXCIgaWQ9XCJnYWNoYS1jYW52YXNcIiBjbGFzc05hbWU9XCJnYWNoYS0tY2FudmFzXCIgd2lkdGg9e0Mub2ppc2FuV2lkdGh9IGhlaWdodD17Qy5vamlzYW5IZWlnaHR9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3RcIj5cbiAgICAgICAgICA8ZGl2IHJlZj1cInJlc3VsdFN0YXIyXCIgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjJcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMi0tc3RhcnNcIj5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIyLS1zdGFycy1saSBzdGFyLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3N0YXIucG5nXCIgd2lkdGg9XCI3OFwiIGhlaWdodD1cIjc2XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjItLXN0YXJzLWxpIHN0YXItLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vc3Rhci5wbmdcIiB3aWR0aD1cIjc4XCIgaGVpZ2h0PVwiNzZcIiAvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIyLS1pdGVtXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMi0taXRlbS1saSBpdGVtLS1saVwiPjxpbWcgc3JjPXt0aGlzLnN0YXRlLmdhY2hhSW1hZ2V9IHdpZHRoPVwiNjAwXCIgaGVpZ2h0PVwiNDE1XCIvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIyLS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMi0tbWVzc2FnZS1saSBtZXNzYWdlLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3R4dDMucG5nXCIgd2lkdGg9XCI3NVwiIGhlaWdodD1cIjc1XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjItLW1lc3NhZ2UtbGkgbWVzc2FnZS0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi90eHQ0LnBuZ1wiIHdpZHRoPVwiNzVcIiBoZWlnaHQ9XCI3NVwiIC8+PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjItLWdldFwiPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjItLWdldC1saSBnZXQtLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vdHh0NS5wbmdcIiB3aWR0aD1cIjI4OVwiIGhlaWdodD1cIjEyMVwiIC8+PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiByZWY9XCJyZXN1bHRTdGFyM1wiIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzXCI+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjMtLXN0YXJzXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMy0tc3RhcnMtbGkgc3Rhci0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi9zdGFyLnBuZ1wiIHdpZHRoPVwiNzhcIiBoZWlnaHQ9XCI3NlwiIC8+PC9saT5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1zdGFycy1saSBzdGFyLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3N0YXIucG5nXCIgd2lkdGg9XCI3OFwiIGhlaWdodD1cIjc2XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjMtLXN0YXJzLWxpIHN0YXItLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vc3Rhci5wbmdcIiB3aWR0aD1cIjc4XCIgaGVpZ2h0PVwiNzZcIiAvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1pdGVtXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMy0taXRlbS1saSBpdGVtLS1saVwiPjxpbWcgc3JjPXt0aGlzLnN0YXRlLmdhY2hhSW1hZ2V9IHdpZHRoPVwiNjAwXCIgaGVpZ2h0PVwiNDE1XCIvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyMy0tbWVzc2FnZS1saSBtZXNzYWdlLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3R4dDIucG5nXCIgd2lkdGg9XCI3NVwiIGhlaWdodD1cIjc1XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjMtLW1lc3NhZ2UtbGkgbWVzc2FnZS0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi90eHQzLnBuZ1wiIHdpZHRoPVwiNzVcIiBoZWlnaHQ9XCI3NVwiIC8+PC9saT5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1tZXNzYWdlLWxpIG1lc3NhZ2UtLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vdHh0NC5wbmdcIiB3aWR0aD1cIjc1XCIgaGVpZ2h0PVwiNzVcIiAvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1nZXRcIj5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXIzLS1nZXQtbGkgZ2V0LS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3R4dDUucG5nXCIgd2lkdGg9XCIyODlcIiBoZWlnaHQ9XCIxMjFcIiAvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgcmVmPVwicmVzdWx0U3RhcjRcIiBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXI0LS1zdGFyc1wiPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjQtLXN0YXJzLWxpIHN0YXItLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vc3Rhci5wbmdcIiB3aWR0aD1cIjc4XCIgaGVpZ2h0PVwiNzZcIiAvPjwvbGk+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0tc3RhcnMtbGkgc3Rhci0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi9zdGFyLnBuZ1wiIHdpZHRoPVwiNzhcIiBoZWlnaHQ9XCI3NlwiIC8+PC9saT5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXI0LS1zdGFycy1saSBzdGFyLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3N0YXIucG5nXCIgd2lkdGg9XCI3OFwiIGhlaWdodD1cIjc2XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjQtLXN0YXJzLWxpIHN0YXItLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vc3Rhci5wbmdcIiB3aWR0aD1cIjc4XCIgaGVpZ2h0PVwiNzZcIiAvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXI0LS1pdGVtXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0taXRlbS1saSBpdGVtLS1saVwiPjxpbWcgc3JjPXt0aGlzLnN0YXRlLmdhY2hhSW1hZ2V9IHdpZHRoPVwiNjAwXCIgaGVpZ2h0PVwiNDE1XCIvPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXI0LS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0tbWVzc2FnZS1saSBtZXNzYWdlLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3R4dDEucG5nXCIgd2lkdGg9XCI3NVwiIGhlaWdodD1cIjc1XCIgLz48L2xpPlxuICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2FjaGEtLW9iamVjdC0tc3RhcjQtLW1lc3NhZ2UtbGkgbWVzc2FnZS0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi90eHQyLnBuZ1wiIHdpZHRoPVwiNzVcIiBoZWlnaHQ9XCI3NVwiIC8+PC9saT5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdhY2hhLS1vYmplY3QtLXN0YXI0LS1tZXNzYWdlLWxpIG1lc3NhZ2UtLWxpXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vdHh0My5wbmdcIiB3aWR0aD1cIjc1XCIgaGVpZ2h0PVwiNzVcIiAvPjwvbGk+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0tbWVzc2FnZS1saSBtZXNzYWdlLS1saVwiPjxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL3R4dDQucG5nXCIgd2lkdGg9XCI3NVwiIGhlaWdodD1cIjc1XCIgLz48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0tZ2V0XCI+XG4gICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJnYWNoYS0tb2JqZWN0LS1zdGFyNC0tZ2V0LWxpIGdldC0tbGlcIj48aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi90eHQ1LnBuZ1wiIHdpZHRoPVwiMjg5XCIgaGVpZ2h0PVwiMTIxXCIgLz48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgR2FjaGFDb21wb25lbnQ7XG4iLCJpbXBvcnQgXCJiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL3J1bnRpbWVcIjtcblxuaW1wb3J0IEVudiBmcm9tICcuLi9lbnYvZW52LmpzJztcbmltcG9ydCBDIGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuXG4vLyByZWFjdFxudmFyIExvYWRpbmdDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXJ0KCk7XG4gIH0sXG4gIGFuaW1hdGlvblN0YXJ0KCkge1xuICAgIHZhciBsb2FkaW5nID0gJCh0aGlzLnJlZnMubG9nby5nZXRET01Ob2RlKCkpO1xuICAgIHZhciB3cmFwcGVyID0gJCh0aGlzLnJlZnMud3JhcHBlci5nZXRET01Ob2RlKCkpO1xuXG4gICAgJChsb2FkaW5nKS52ZWxvY2l0eSh7XG4gICAgICBvcGFjaXR5OiAxXG4gICAgfSwge1xuICAgICAgbG9vcDogZmFsc2UsXG4gICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgIGRlbGF5OiAwLFxuICAgICAgZWFzaW5nOiAnZWFzZUluT3V0Q3ViaWMnLFxuICAgICAgY29tcGxldGU6IChlbGVtZW50cykgPT4ge1xuICAgICAgICAkKGxvYWRpbmcpLnZlbG9jaXR5KHtcbiAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICBlYXNpbmc6ICdlYXNlSW5PdXRDdWJpYycsXG4gICAgICAgICAgY29tcGxldGU6IChlbGVtZW50cykgPT4ge1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3cmFwcGVyKS52ZWxvY2l0eSh7XG4gICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgICAgZWFzaW5nOiAnZWFzZUluT3V0Q3ViaWMnLFxuICAgICAgICAgIGNvbXBsZXRlOiAoZWxlbWVudHMpID0+IHtcbiAgICAgICAgICAgICQod3JhcHBlcikuaGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWxheSA9IHQgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHQpKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgYXN5bmMgZnVuY3Rpb24gbmV4dFNjZW5lKCkge1xuICAgICAgY29uc29sZS5sb2coJ3N0YXJ0Jyk7XG4gICAgICBhd2FpdCBkZWxheSg2MDAwKTtcbiAgICAgIHNlbGYucHJvcHMubmV4dFNjZW5lKCk7XG4gICAgICBjb25zb2xlLmxvZygnZW5kJyk7XG4gICAgfVxuICAgIG5leHRTY2VuZSgpO1xuICB9LFxuICBhbmltYXRpb25TdG9wKCkge1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgcmVmPVwid3JhcHBlclwiIGNsYXNzTmFtZT1cImxvYWRpbmctLXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiByZWY9XCJsb2dvXCIgY2xhc3NOYW1lPVwibG9hZGluZy0tbG9nb1wiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL2xvZ29fc3BsYXNoLnBuZ1wiIHdpZHRoPVwiMjQwXCIgaGVpZ2h0PVwiMTY1XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGluZ0NvbXBvbmVudDtcbiIsImltcG9ydCBHYWNoYVNldHVwIGZyb20gJy4uL2NhbnZhcy9nYWNoYS1zZXR1cCc7XG5pbXBvcnQgT2ppc2FuQ2FudmFzIGZyb20gJy4uL3BpeGkvb2ppc2FuLWJhY2tncm91bmQnO1xuaW1wb3J0IEVudiBmcm9tICcuLi9lbnYvZW52LmpzJ1xuaW1wb3J0IEMgZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbi8vIOOCreODo+ODg+OCt+ODpeOCkuOBleOBm+OBquOBhO+8iElF44Gn44Gv5b+F6aCI77yJXG4kLmFqYXhTZXR1cCh7XG4gIGNhY2hlOiBmYWxzZVxufSk7XG5cbi8vIHJlYWN0XG52YXIgT2ppc2FuQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBzb3VyY2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogJydcbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdHM6IFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gIH0sXG4gIF9zdGFydEdhY2hhKGUpIHtcbiAgICBjcmVhdGVqcy5Tb3VuZC5wbGF5KCdkcm9wJywgJ25vbmUnLCAwLCAwLCAwLCAwLjgsIDApO1xuXG4gICAgdGhpcy5wcm9wcy5uZXh0U2NlbmUoZSk7XG4gIH0sXG4gIHJlc2V0KGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLnZlbG9jaXR5KHtcbiAgICAgIHRyYW5zbGF0ZVk6ICctMTAwMHB4JyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9LCB7XG4gICAgICBkdXJhdGlvbjogMFxuICAgIH0pO1xuICB9LFxuICBvamlzYW5BbmltYXRpb24oZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkudmVsb2NpdHkoe1xuICAgICAgdHJhbnNsYXRlWTogJys9MTAwMHB4J1xuICAgIH0sIHtcbiAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICBkZWxheTogMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VJbkV4cG8nLFxuICAgICAgY29tcGxldGU6IChlbGVtZW50cykgPT4ge1xuICAgICAgICB2YXIgdWkgPSAkKHRoaXMucmVmcy51aS5nZXRET01Ob2RlKCkpO1xuICAgICAgICAkKHVpKS5mYWRlSW4oMTAwMCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFuaW1hdGlvblN0YXJ0KCkge1xuICAgICQud2hlbihcbiAgICAgIEdhY2hhU2V0dXAucHJlbG9hZCgoKSA9PiB7fSlcbiAgICApLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgb2ppc2FuID0gJCh0aGlzLnJlZnMub2ppc2FuLmdldERPTU5vZGUoKSk7XG4gICAgICAgIHRoaXMucmVzZXQob2ppc2FuKTtcbiAgICAgICAgdGhpcy5vamlzYW5BbmltYXRpb24ob2ppc2FuKTtcblxuICAgICAgICBPamlzYW5DYW52YXMuaW5pdCgpO1xuICAgICAgfSwgKCkgPT57XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pO1xuICB9LFxuICBhbmltYXRpb25TdG9wKCkge1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ppc2FuLS13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ppc2FuLS1iYWNrZ3JvdW5kXCI+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIi4vaW1hZ2VzL29qaXNhbi9iYWNrZ3JvdW5kLnBuZ1wiIHdpZHRoPXtDLm9qaXNhbldpZHRofSBoZWlnaHQ9e0Mub2ppc2FuSGVpZ2h0fS8+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvamlzYW4tLWNhbnZhc1wiPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgPGNhbnZhcyBpZD1cIm9qaXNhbi1jYW52YXNcIiB3aWR0aD17Qy5vamlzYW5XaWR0aH0gaGVpZ2h0PXtDLm9qaXNhbkhlaWdodH0+PC9jYW52YXM+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvamlzYW4tLW9qaXNhblwiPlxuICAgICAgICAgIDxwIHJlZj1cIm9qaXNhblwiIGNsYXNzTmFtZT1cIm9qaXNhbi0tb2ppc2FuLS1jaGFyYWN0ZXJcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiLi9pbWFnZXMvb2ppc2FuL29qaXNhbi5wbmdcIiB3aWR0aD1cIjI0M1wiIGhlaWdodD1cIjIyNlwiLz5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9qaXNhbi0tY291bnRlclwiPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vY291bnRlci5wbmdcIiB3aWR0aD17Qy5vamlzYW5XaWR0aH0gaGVpZ2h0PXtDLm9qaXNhbkhlaWdodH0vPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ppc2FuLS1tZXNzYWdlXCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwib2ppc2FuLS1tZXNzYWdlLS10aXRsZVwiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIuL2ltYWdlcy9vamlzYW4vbG9nby5wbmdcIiB3aWR0aD1cIjI0MFwiIGhlaWdodD1cIjE2NVwiLz5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9qaXNhbi0tdWlcIj5cbiAgICAgICAgICA8dWwgcmVmPVwidWlcIiBjbGFzc05hbWU9XCJvamlzYW4tLXVpLS1idXR0b25cIj5cbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJvamlzYW4tLXVpLS1idXR0b24tLWxpXCI+PHAgY2xhc3NOYW1lPVwib2ppc2FuLS11aS0tYnV0dG9uX19rb2JhblwiPjwvcD48L2xpPlxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm9qaXNhbi0tdWktLWJ1dHRvbi0tbGlcIj48YnV0dG9uIGNsYXNzTmFtZT1cIm9qaXNhbi0tdWktLWJ1dHRvbl9fZ2FjaGFcIiBvbkNsaWNrPXt0aGlzLl9zdGFydEdhY2hhfT48L2J1dHRvbj48L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE9qaXNhbkNvbXBvbmVudDtcbiIsInZhciBFbnYgPSB7XG4gIGVudk5hbWU6ICdsb2NhbCcsXG4gIHNlcnZlckRvbWFpbjogW2xvY2F0aW9uLnByb3RvY29sLCAnLy8nLCBkb2N1bWVudC5kb21haW4sICc6JywgJzMwMDAnXS5qb2luKCcnKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRW52O1xuIiwiaW1wb3J0IE9qaXNhbkNvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudHMvb2ppc2FuLWNvbXBvbmVudCc7XG5pbXBvcnQgR2FjaGFDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzL2dhY2hhLWNvbXBvbmVudCc7XG5pbXBvcnQgTG9hZGluZ0NvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudHMvbG9hZGluZy1jb21wb25lbnQnO1xuXG5jb25zb2xlLmxvZygnb2ppc2FuJyk7XG5cbnZhciBPamlzYW4gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgIH07XG4gIH0sXG4gIHByb3BUeXBlczoge1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgfSxcbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlZnMub2ppc2FuLmFuaW1hdGlvblN0YXJ0KCk7XG4gIH0sXG4gIG5leHRTY2VuZSgpIHtcbiAgICB0aGlzLnJlZnMuZ2FjaGEuZ2FjaGFTdGFydCgpO1xuICB9LFxuICBiZWZvcmVTY2VuZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxPamlzYW5Db21wb25lbnQgcmVmPVwib2ppc2FuXCJcbiAgICAgICAgICBuZXh0U2NlbmU9e3RoaXMubmV4dFNjZW5lfVxuICAgICAgICAvPlxuICAgICAgICA8R2FjaGFDb21wb25lbnQgcmVmPVwiZ2FjaGFcIlxuICAgICAgICAgIGJlZm9yZVNjZW5lPXt0aGlzLmJlZm9yZVNjZW5lfVxuICAgICAgICAgIHNvdXJjZT1cIi9nYWNoYVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxMb2FkaW5nQ29tcG9uZW50IHJlZj1cImxvYWRpbmdcIlxuICAgICAgICAgIG5leHRTY2VuZT17dGhpcy5pbml0fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIoXG4gIDxPamlzYW4gLz4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50cycpXG4pO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAvL2NvbXBvbmVudC5pbml0KCk7XG5cbiAgLy8g55S76Z2i44Gu6KaB57Sg44KS6YG45oqe44Gn44GN44Gq44GE44KI44GG44Gr44GZ44KLXG4gICQoJ2JvZHknKS5vbignc2VsZWN0c3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbn1cblxuaW5pdCgpO1xuIiwiaW1wb3J0IEMgZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbmNsYXNzIE8ge1xuICBzdGF0aWMgaW5pdCgpIHtcbiAgICAvKiB0aGUgd2luZG93Lm9ubG9hZCBpcyBBQlNPTFVURUxZIGVzc2VudGlhbCwgb3RoZXJ3aXNlIG9wZW5pbmcgYW5kIGNsb3NpbmcgSWZyYW1lcyBkb2VzIG5vdCB3b3JrOyovXG4gICAgdmFyIG15VmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYWNoYS1jYW52YXMnKTtcbiAgICB2YXIgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcigzNzUsIDY2Nywge3ZpZXc6IG15VmlldywgdHJhbnNwYXJlbnQ6IHRydWV9KTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIudmlldyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHNjZW5lIGdyYXBoXG4gICAgdmFyIHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG5cbiAgICAvLyBjcmVhdGUgYSBuZXcgYmFja2dyb3VuZCBzcHJpdGVcbiAgICAvL3ZhciBiYWNrZ3JvdW5kID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZSgnLi9pbWFnZXMvb2ppc2FuL0JHcm90YXRlMi5qcGcnKTtcbiAgICAvL3N0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG4gICAgdmFyIGVtaXR0ZXJDb250YWluZXIgPSBuZXcgUElYSS5QYXJ0aWNsZUNvbnRhaW5lcigpO1xuICAgIGVtaXR0ZXJDb250YWluZXIuc2V0UHJvcGVydGllcyh7XG4gICAgICBzY2FsZTogdHJ1ZSxcbiAgICAgIHBvc2l0aW9uOiB0cnVlLFxuICAgICAgcm90YXRpb246IHRydWUsXG4gICAgICB1dnM6IHRydWUsXG4gICAgICBhbHBoYTogdHJ1ZVxuICAgIH0pO1xuICAgIHN0YWdlLmFkZENoaWxkKGVtaXR0ZXJDb250YWluZXIpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IGNsb3Vka2lkLkVtaXR0ZXIoXG4gICAgICBlbWl0dGVyQ29udGFpbmVyLFxuICAgICAgW1BJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJy4vaW1hZ2VzL2dhY2hhL3BhcnRpY2xlLnBuZycpXSxcbiAgICAgIHtcbiAgICAgICAgXCJhbHBoYVwiOiB7XG4gICAgICAgICAgXCJzdGFydFwiOiAxLFxuICAgICAgICAgIFwiZW5kXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgXCJzY2FsZVwiOiB7XG4gICAgICAgICAgXCJzdGFydFwiOiAwLjUsXG4gICAgICAgICAgXCJlbmRcIjogMS4wLFxuICAgICAgICAgIFwibWluaW11bVNjYWxlTXVsdGlwbGllclwiOiAxXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgIFwic3RhcnRcIjogXCIjZTRmOWZmXCIsXG4gICAgICAgICAgXCJlbmRcIjogXCIjM2ZjYmZmXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGVlZFwiOiB7XG4gICAgICAgICAgXCJzdGFydFwiOiA1MDAsXG4gICAgICAgICAgXCJlbmRcIjogODAwXG4gICAgICAgIH0sXG4gICAgICAgIFwiYWNjZWxlcmF0aW9uXCI6IHtcbiAgICAgICAgICBcInhcIjogMCxcbiAgICAgICAgICBcInlcIjogNTBcbiAgICAgICAgfSxcbiAgICAgICAgXCJzdGFydFJvdGF0aW9uXCI6IHtcbiAgICAgICAgICBcIm1pblwiOiAwLFxuICAgICAgICAgIFwibWF4XCI6IDM2MFxuICAgICAgICB9LFxuICAgICAgICBcInJvdGF0aW9uU3BlZWRcIjoge1xuICAgICAgICAgIFwibWluXCI6IDAsXG4gICAgICAgICAgXCJtYXhcIjogMFxuICAgICAgICB9LFxuICAgICAgICBcImxpZmV0aW1lXCI6IHtcbiAgICAgICAgICBcIm1pblwiOiAwLjIsXG4gICAgICAgICAgXCJtYXhcIjogMS4wXG4gICAgICAgIH0sXG4gICAgICAgIFwiYmxlbmRNb2RlXCI6IFwibm9ybWFsXCIsXG4gICAgICAgIFwiZnJlcXVlbmN5XCI6IDAuMDA1LFxuICAgICAgICBcImVtaXR0ZXJMaWZldGltZVwiOiAtMSxcbiAgICAgICAgXCJtYXhQYXJ0aWNsZXNcIjogNDAwLFxuICAgICAgICBcInBvc1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IEMub2ppc2FuV2lkdGggLyAyLFxuICAgICAgICAgIFwieVwiOiBDLm9qaXNhbkhlaWdodCAvIDJcbiAgICAgICAgfSxcbiAgICAgICAgXCJhZGRBdEJhY2tcIjogZmFsc2UsXG4gICAgICAgIFwic3Bhd25UeXBlXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgIFwic3Bhd25DaXJjbGVcIjoge1xuICAgICAgICAgIFwieFwiOiAwLFxuICAgICAgICAgIFwieVwiOiAwLFxuICAgICAgICAgIFwiclwiOiAwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBjdXJyZW50IHRpbWVcbiAgICB2YXIgZWxhcHNlZCA9IERhdGUubm93KCk7XG5cbiAgICAvLyBVcGRhdGUgZnVuY3Rpb24gZXZlcnkgZnJhbWVcbiAgICB2YXIgdXBkYXRlID0gKCkgPT4ge1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIG5leHQgZnJhbWVcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXG4gICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgLy8gVGhlIGVtaXR0ZXIgcmVxdWlyZXMgdGhlIGVsYXBzZWRcbiAgICAgIC8vIG51bWJlciBvZiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZVxuICAgICAgdGhpcy5lbWl0dGVyLnVwZGF0ZSgobm93IC0gZWxhcHNlZCkgKiAwLjAwMSk7XG4gICAgICBlbGFwc2VkID0gbm93O1xuXG4gICAgICAvLyBTaG91bGQgcmUtcmVuZGVyIHRoZSBQSVhJIFN0YWdlXG4gICAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuICAgIH07XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCA9IGZhbHNlO1xuXG4gICAgLy8gU3RhcnQgdGhlIHVwZGF0ZVxuICAgIHVwZGF0ZSgpO1xuICB9XG5cbiAgc3RhdGljIHNob3dFbWl0dGVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0ID0gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBoaWRlRW1pdHRlcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCA9IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE87XG5cbiIsImNsYXNzIE8ge1xuICBzdGF0aWMgaW5pdCgpIHtcbiAgICAvKiB0aGUgd2luZG93Lm9ubG9hZCBpcyBBQlNPTFVURUxZIGVzc2VudGlhbCwgb3RoZXJ3aXNlIG9wZW5pbmcgYW5kIGNsb3NpbmcgSWZyYW1lcyBkb2VzIG5vdCB3b3JrOyovXG4gICAgdmFyIG15VmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvamlzYW4tY2FudmFzJyk7XG4gICAgdmFyIHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoMzc1LCA2NjcsIHt2aWV3OiBteVZpZXcsIHRyYW5zcGFyZW50OiB0cnVlfSk7XG4gICAgLy9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSByb290IG9mIHRoZSBzY2VuZSBncmFwaFxuICAgIHZhciBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXG4gICAgLy8gY3JlYXRlIGEgbmV3IGJhY2tncm91bmQgc3ByaXRlXG4gICAgLy92YXIgYmFja2dyb3VuZCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4vaW1hZ2VzL29qaXNhbi9CR3JvdGF0ZTIuanBnJyk7XG4gICAgLy9zdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuICAgIC8vIGNyZWF0ZSBhbiBhcnJheSB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgZHVkZXNcbiAgICB2YXIgZHVkZUFycmF5ID0gW107XG5cbiAgICB2YXIgdG90YWxkdWRlcyA9IDg7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0b3RhbGR1ZGVzOyBpKyspIHtcbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyBTcHJpdGUgdGhhdCB1c2VzIHRoZSBpbWFnZSBuYW1lIHRoYXQgd2UganVzdCBnZW5lcmF0ZWQgYXMgaXRzIHNvdXJjZVxuICAgICAgdmFyIGR1ZGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4vaW1hZ2VzL2dhY2hhL2l0ZW0nICsgXy5wYWRMZWZ0KGksIDIsICcwJykgKyAnX3MucG5nJyk7XG5cbiAgICAgIGR1ZGUuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAvLyBzZXQgYSByYW5kb20gc2NhbGUgZm9yIHRoZSBkdWRlXG4gICAgICBkdWRlLnNjYWxlLnNldCgwLjggKyBNYXRoLnJhbmRvbSgpICogMC4zKTtcblxuICAgICAgLy8gZmluYWxseSBsZXQncyBzZXQgdGhlIGR1ZGUgdG8gYmUgYXQgYSByYW5kb20gcG9zaXRpb24uLi5cbiAgICAgIGR1ZGUucG9zaXRpb24ueCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbmRlcmVyLndpZHRoKTtcbiAgICAgIGR1ZGUucG9zaXRpb24ueSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbmRlcmVyLmhlaWdodCk7XG5cbiAgICAgIC8vIFRoZSBpbXBvcnRhbnQgYml0IG9mIHRoaXMgZXhhbXBsZSwgdGhpcyBpcyBob3cgeW91IGNoYW5nZSB0aGUgZGVmYXVsdCBibGVuZCBtb2RlIG9mIHRoZSBzcHJpdGVcbiAgICAgIGR1ZGUuYmxlbmRNb2RlID0gUElYSS5CTEVORF9NT0RFUy5BREQ7XG5cbiAgICAgIC8vIGNyZWF0ZSBzb21lIGV4dHJhIHByb3BlcnRpZXMgdGhhdCB3aWxsIGNvbnRyb2wgbW92ZW1lbnRcbiAgICAgIGR1ZGUuZGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyO1xuXG4gICAgICAvLyB0aGlzIG51bWJlciB3aWxsIGJlIHVzZWQgdG8gbW9kaWZ5IHRoZSBkaXJlY3Rpb24gb2YgdGhlIGR1ZGUgb3ZlciB0aW1lXG4gICAgICBkdWRlLnR1cm5pbmdTcGVlZCA9IE1hdGgucmFuZG9tKCkgLSAwLjg7XG5cbiAgICAgIC8vIGNyZWF0ZSBhIHJhbmRvbSBzcGVlZCBmb3IgdGhlIGR1ZGUgYmV0d2VlbiAwIC0gMlxuICAgICAgZHVkZS5zcGVlZCA9IDIgKyBNYXRoLnJhbmRvbSgpICogMjtcblxuICAgICAgLy8gZmluYWxseSB3ZSBwdXNoIHRoZSBkdWRlIGludG8gdGhlIGR1ZGVBcnJheSBzbyBpdCBpdCBjYW4gYmUgZWFzaWx5IGFjY2Vzc2VkIGxhdGVyXG4gICAgICBkdWRlQXJyYXkucHVzaChkdWRlKTtcblxuICAgICAgc3RhZ2UuYWRkQ2hpbGQoZHVkZSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgYm91bmRpbmcgYm94IGJveCBmb3IgdGhlIGxpdHRsZSBkdWRlc1xuICAgIHZhciBkdWRlQm91bmRzUGFkZGluZyA9IDEwMDtcblxuICAgIHZhciBkdWRlQm91bmRzID0gbmV3IFBJWEkuUmVjdGFuZ2xlKC1kdWRlQm91bmRzUGFkZGluZyxcbiAgICAgIC1kdWRlQm91bmRzUGFkZGluZyxcbiAgICAgIHJlbmRlcmVyLndpZHRoICsgZHVkZUJvdW5kc1BhZGRpbmcgKiAyLFxuICAgICAgcmVuZGVyZXIuaGVpZ2h0ICsgZHVkZUJvdW5kc1BhZGRpbmcgKiAyKTtcblxuICAgIHZhciB0aWNrID0gMDtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcblxuXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgZHVkZXMgYW5kIHVwZGF0ZSB0aGUgcG9zaXRpb25zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGR1ZGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZHVkZSA9IGR1ZGVBcnJheVtpXTtcbiAgICAgICAgZHVkZS5kaXJlY3Rpb24gKz0gZHVkZS50dXJuaW5nU3BlZWQgKiAwLjAxO1xuICAgICAgICBkdWRlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4oZHVkZS5kaXJlY3Rpb24pICogZHVkZS5zcGVlZDtcbiAgICAgICAgZHVkZS5wb3NpdGlvbi55ICs9IE1hdGguY29zKGR1ZGUuZGlyZWN0aW9uKSAqIGR1ZGUuc3BlZWQ7XG4gICAgICAgIGR1ZGUucm90YXRpb24gPSAtZHVkZS5kaXJlY3Rpb24gLSBNYXRoLlBJIC8gMjtcblxuICAgICAgICAvLyB3cmFwIHRoZSBkdWRlcyBieSB0ZXN0aW5nIHRoZWlyIGJvdW5kcy4uLlxuICAgICAgICBpZiAoZHVkZS5wb3NpdGlvbi54IDwgZHVkZUJvdW5kcy54KSB7XG4gICAgICAgICAgZHVkZS5wb3NpdGlvbi54ICs9IGR1ZGVCb3VuZHMud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHVkZS5wb3NpdGlvbi54ID4gZHVkZUJvdW5kcy54ICsgZHVkZUJvdW5kcy53aWR0aCkge1xuICAgICAgICAgIGR1ZGUucG9zaXRpb24ueCAtPSBkdWRlQm91bmRzLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR1ZGUucG9zaXRpb24ueSA8IGR1ZGVCb3VuZHMueSkge1xuICAgICAgICAgIGR1ZGUucG9zaXRpb24ueSArPSBkdWRlQm91bmRzLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkdWRlLnBvc2l0aW9uLnkgPiBkdWRlQm91bmRzLnkgKyBkdWRlQm91bmRzLmhlaWdodCkge1xuICAgICAgICAgIGR1ZGUucG9zaXRpb24ueSAtPSBkdWRlQm91bmRzLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBpbmNyZW1lbnQgdGhlIHRpY2tlclxuICAgICAgdGljayArPSAwLjE7XG5cbiAgICAgIC8vIHRpbWUgdG8gcmVuZGVyIHRoZSBzdGFnZSAhXG4gICAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuXG4gICAgICAvLyByZXF1ZXN0IGFub3RoZXIgYW5pbWF0aW9uIGZyYW1lLi4uXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE87XG5cbiJdfQ==
