(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = /* @__PURE__ */ __name(function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      }, "isArguments");
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = /* @__PURE__ */ __name(function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        }, "equalsConstructorPrototype");
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        }();
        equalsConstructorPrototypeIfNotBuggy = /* @__PURE__ */ __name(function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        }, "equalsConstructorPrototypeIfNotBuggy");
        keysShim = /* @__PURE__ */ __name(function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name2 in object) {
              if (!(skipProto && name2 === "prototype") && has.call(object, name2)) {
                theKeys.push(String(name2));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        }, "keys");
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? /* @__PURE__ */ __name(function keys(o) {
        return origKeys(o);
      }, "keys") : require_implementation();
      var originalKeys = Object.keys;
      keysShim.shim = /* @__PURE__ */ __name(function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          }(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = /* @__PURE__ */ __name(function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            }, "keys");
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      }, "shimObjectKeys");
      module.exports = keysShim;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      module.exports = TypeError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      module.exports = URIError;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = /* @__PURE__ */ __name(function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj2 = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj2[sym] = symVal;
        for (sym in obj2) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj2).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj2).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj2);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj2, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj2, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      }, "hasSymbols");
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      }, "hasNativeSymbols");
    }
  });

  // node_modules/has-proto/index.js
  var require_has_proto = __commonJS({
    "node_modules/has-proto/index.js"(exports, module) {
      "use strict";
      var test = {
        __proto__: null,
        foo: {}
      };
      var $Object = Object;
      module.exports = /* @__PURE__ */ __name(function hasProto() {
        return { __proto__: test }.foo === test.foo && !(test instanceof $Object);
      }, "hasProto");
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = /* @__PURE__ */ __name(function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      }, "concatty");
      var slicy = /* @__PURE__ */ __name(function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      }, "slicy");
      var joiny = /* @__PURE__ */ __name(function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      }, "joiny");
      module.exports = /* @__PURE__ */ __name(function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = /* @__PURE__ */ __name(function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        }, "binder");
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = /* @__PURE__ */ __name(function Empty2() {
          }, "Empty");
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      }, "bind");
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation2();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var $Function = Function;
      var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      }, "getEvalledConstructor");
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = /* @__PURE__ */ __name(function() {
        throw new $TypeError();
      }, "throwTypeError");
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var hasProto = require_has_proto()();
      var getProto = Object.getPrototypeOf || (hasProto ? function(x) {
        return x.__proto__;
      } : null);
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = /* @__PURE__ */ __name(function doEval2(name2) {
        var value;
        if (name2 === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name2 === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name2 === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name2 === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name2 === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name2] = value;
        return value;
      }, "doEval");
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      }, "stringToPath");
      var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name2, allowMissing) {
        var intrinsicName = name2;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name2 + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name2 + " does not exist!");
      }, "getBaseIntrinsic");
      module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name2, allowMissing) {
        if (typeof name2 !== "string" || name2.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name2) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name2);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name2 + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      }, "GetIntrinsic");
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true) || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module.exports = /* @__PURE__ */ __name(function defineDataProperty(obj2, property, value) {
        if (!obj2 || typeof obj2 !== "object" && typeof obj2 !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj2, property);
        if ($defineProperty) {
          $defineProperty(obj2, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj2[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      }, "defineDataProperty");
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = /* @__PURE__ */ __name(function hasPropertyDescriptors2() {
        return !!$defineProperty;
      }, "hasPropertyDescriptors");
      hasPropertyDescriptors.hasArrayLengthDefineBug = /* @__PURE__ */ __name(function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      }, "hasArrayLengthDefineBug");
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports, module) {
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var defineDataProperty = require_define_data_property();
      var isFunction = /* @__PURE__ */ __name(function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      }, "isFunction");
      var supportsDescriptors = require_has_property_descriptors()();
      var defineProperty = /* @__PURE__ */ __name(function(object, name2, value, predicate) {
        if (name2 in object) {
          if (predicate === true) {
            if (object[name2] === value) {
              return;
            }
          } else if (!isFunction(predicate) || !predicate()) {
            return;
          }
        }
        if (supportsDescriptors) {
          defineDataProperty(object, name2, value, true);
        } else {
          defineDataProperty(object, name2, value);
        }
      }, "defineProperty");
      var defineProperties = /* @__PURE__ */ __name(function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      }, "defineProperties");
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module.exports = /* @__PURE__ */ __name(function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      }, "setFunctionLength");
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic();
      var setFunctionLength = require_set_function_length();
      var $TypeError = require_type();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $defineProperty = require_es_define_property();
      var $max = GetIntrinsic("%Math.max%");
      module.exports = /* @__PURE__ */ __name(function callBind(originalFunction) {
        if (typeof originalFunction !== "function") {
          throw new $TypeError("a function is required");
        }
        var func = $reflectApply(bind, $call, arguments);
        return setFunctionLength(
          func,
          1 + $max(0, originalFunction.length - (arguments.length - 1)),
          true
        );
      }, "callBind");
      var applyBind = /* @__PURE__ */ __name(function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      }, "applyBind");
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = /* @__PURE__ */ __name(function callBoundIntrinsic(name2, allowMissing) {
        var intrinsic = GetIntrinsic(name2, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name2, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      }, "callBoundIntrinsic");
    }
  });

  // node_modules/object.assign/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/object.assign/implementation.js"(exports, module) {
      "use strict";
      var objectKeys = require_object_keys();
      var hasSymbols = require_shams()();
      var callBound = require_callBound();
      var toObject = Object;
      var $push = callBound("Array.prototype.push");
      var $propIsEnumerable = callBound("Object.prototype.propertyIsEnumerable");
      var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;
      module.exports = /* @__PURE__ */ __name(function assign(target, source1) {
        if (target == null) {
          throw new TypeError("target must be an object");
        }
        var to = toObject(target);
        if (arguments.length === 1) {
          return to;
        }
        for (var s = 1; s < arguments.length; ++s) {
          var from = toObject(arguments[s]);
          var keys = objectKeys(from);
          var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
          if (getSymbols) {
            var syms = getSymbols(from);
            for (var j = 0; j < syms.length; ++j) {
              var key = syms[j];
              if ($propIsEnumerable(from, key)) {
                $push(keys, key);
              }
            }
          }
          for (var i = 0; i < keys.length; ++i) {
            var nextKey = keys[i];
            if ($propIsEnumerable(from, nextKey)) {
              var propValue = from[nextKey];
              to[nextKey] = propValue;
            }
          }
        }
        return to;
      }, "assign");
    }
  });

  // node_modules/object.assign/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/object.assign/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation3();
      var lacksProperEnumerationOrder = /* @__PURE__ */ __name(function() {
        if (!Object.assign) {
          return false;
        }
        var str = "abcdefghijklmnopqrst";
        var letters = str.split("");
        var map = {};
        for (var i = 0; i < letters.length; ++i) {
          map[letters[i]] = letters[i];
        }
        var obj2 = Object.assign({}, map);
        var actual = "";
        for (var k in obj2) {
          actual += k;
        }
        return str !== actual;
      }, "lacksProperEnumerationOrder");
      var assignHasPendingExceptions = /* @__PURE__ */ __name(function() {
        if (!Object.assign || !Object.preventExtensions) {
          return false;
        }
        var thrower = Object.preventExtensions({ 1: 2 });
        try {
          Object.assign(thrower, "xy");
        } catch (e) {
          return thrower[1] === "y";
        }
        return false;
      }, "assignHasPendingExceptions");
      module.exports = /* @__PURE__ */ __name(function getPolyfill() {
        if (!Object.assign) {
          return implementation;
        }
        if (lacksProperEnumerationOrder()) {
          return implementation;
        }
        if (assignHasPendingExceptions()) {
          return implementation;
        }
        return Object.assign;
      }, "getPolyfill");
    }
  });

  // node_modules/object.assign/shim.js
  var require_shim = __commonJS({
    "node_modules/object.assign/shim.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var getPolyfill = require_polyfill();
      module.exports = /* @__PURE__ */ __name(function shimAssign() {
        var polyfill = getPolyfill();
        define(
          Object,
          { assign: polyfill },
          { assign: function() {
            return Object.assign !== polyfill;
          } }
        );
        return polyfill;
      }, "shimAssign");
    }
  });

  // node_modules/object.assign/index.js
  var require_object = __commonJS({
    "node_modules/object.assign/index.js"(exports, module) {
      "use strict";
      var defineProperties = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation3();
      var getPolyfill = require_polyfill();
      var shim = require_shim();
      var polyfill = callBind.apply(getPolyfill());
      var bound = /* @__PURE__ */ __name(function assign(target, source1) {
        return polyfill(Object, arguments);
      }, "assign");
      defineProperties(bound, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = bound;
    }
  });

  // node_modules/functions-have-names/index.js
  var require_functions_have_names = __commonJS({
    "node_modules/functions-have-names/index.js"(exports, module) {
      "use strict";
      var functionsHaveNames = /* @__PURE__ */ __name(function functionsHaveNames2() {
        return typeof (/* @__PURE__ */ __name(function f() {
        }, "f")).name === "string";
      }, "functionsHaveNames");
      var gOPD = Object.getOwnPropertyDescriptor;
      if (gOPD) {
        try {
          gOPD([], "length");
        } catch (e) {
          gOPD = null;
        }
      }
      functionsHaveNames.functionsHaveConfigurableNames = /* @__PURE__ */ __name(function functionsHaveConfigurableNames() {
        if (!functionsHaveNames() || !gOPD) {
          return false;
        }
        var desc = gOPD(function() {
        }, "name");
        return !!desc && !!desc.configurable;
      }, "functionsHaveConfigurableNames");
      var $bind = Function.prototype.bind;
      functionsHaveNames.boundFunctionsHaveNames = /* @__PURE__ */ __name(function boundFunctionsHaveNames() {
        return functionsHaveNames() && typeof $bind === "function" && (/* @__PURE__ */ __name(function f() {
        }, "f")).bind().name !== "";
      }, "boundFunctionsHaveNames");
      module.exports = functionsHaveNames;
    }
  });

  // node_modules/set-function-name/index.js
  var require_set_function_name = __commonJS({
    "node_modules/set-function-name/index.js"(exports, module) {
      "use strict";
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var functionsHaveConfigurableNames = require_functions_have_names().functionsHaveConfigurableNames();
      var $TypeError = require_type();
      module.exports = /* @__PURE__ */ __name(function setFunctionName(fn, name2) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        if (!loose || functionsHaveConfigurableNames) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "name",
              name2,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "name",
              name2
            );
          }
        }
        return fn;
      }, "setFunctionName");
    }
  });

  // node_modules/regexp.prototype.flags/implementation.js
  var require_implementation4 = __commonJS({
    "node_modules/regexp.prototype.flags/implementation.js"(exports, module) {
      "use strict";
      var setFunctionName = require_set_function_name();
      var $TypeError = require_type();
      var $Object = Object;
      module.exports = setFunctionName(/* @__PURE__ */ __name(function flags() {
        if (this == null || this !== $Object(this)) {
          throw new $TypeError("RegExp.prototype.flags getter called on non-object");
        }
        var result = "";
        if (this.hasIndices) {
          result += "d";
        }
        if (this.global) {
          result += "g";
        }
        if (this.ignoreCase) {
          result += "i";
        }
        if (this.multiline) {
          result += "m";
        }
        if (this.dotAll) {
          result += "s";
        }
        if (this.unicode) {
          result += "u";
        }
        if (this.unicodeSets) {
          result += "v";
        }
        if (this.sticky) {
          result += "y";
        }
        return result;
      }, "flags"), "get flags", true);
    }
  });

  // node_modules/regexp.prototype.flags/polyfill.js
  var require_polyfill2 = __commonJS({
    "node_modules/regexp.prototype.flags/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation4();
      var supportsDescriptors = require_define_properties().supportsDescriptors;
      var $gOPD = Object.getOwnPropertyDescriptor;
      module.exports = /* @__PURE__ */ __name(function getPolyfill() {
        if (supportsDescriptors && /a/mig.flags === "gim") {
          var descriptor = $gOPD(RegExp.prototype, "flags");
          if (descriptor && typeof descriptor.get === "function" && typeof RegExp.prototype.dotAll === "boolean" && typeof RegExp.prototype.hasIndices === "boolean") {
            var calls = "";
            var o = {};
            Object.defineProperty(o, "hasIndices", {
              get: function() {
                calls += "d";
              }
            });
            Object.defineProperty(o, "sticky", {
              get: function() {
                calls += "y";
              }
            });
            if (calls === "dy") {
              return descriptor.get;
            }
          }
        }
        return implementation;
      }, "getPolyfill");
    }
  });

  // node_modules/regexp.prototype.flags/shim.js
  var require_shim2 = __commonJS({
    "node_modules/regexp.prototype.flags/shim.js"(exports, module) {
      "use strict";
      var supportsDescriptors = require_define_properties().supportsDescriptors;
      var getPolyfill = require_polyfill2();
      var gOPD = Object.getOwnPropertyDescriptor;
      var defineProperty = Object.defineProperty;
      var TypeErr = TypeError;
      var getProto = Object.getPrototypeOf;
      var regex = /a/;
      module.exports = /* @__PURE__ */ __name(function shimFlags() {
        if (!supportsDescriptors || !getProto) {
          throw new TypeErr("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
        }
        var polyfill = getPolyfill();
        var proto = getProto(regex);
        var descriptor = gOPD(proto, "flags");
        if (!descriptor || descriptor.get !== polyfill) {
          defineProperty(proto, "flags", {
            configurable: true,
            enumerable: false,
            get: polyfill
          });
        }
        return polyfill;
      }, "shimFlags");
    }
  });

  // node_modules/regexp.prototype.flags/index.js
  var require_regexp_prototype = __commonJS({
    "node_modules/regexp.prototype.flags/index.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation4();
      var getPolyfill = require_polyfill2();
      var shim = require_shim2();
      var flagsBound = callBind(getPolyfill());
      define(flagsBound, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = flagsBound;
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports, module) {
      "use strict";
      var hasSymbols = require_shams();
      module.exports = /* @__PURE__ */ __name(function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      }, "hasToStringTagShams");
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports, module) {
      "use strict";
      var hasToStringTag = require_shams2()();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = /* @__PURE__ */ __name(function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      }, "isArguments");
      var isLegacyArguments = /* @__PURE__ */ __name(function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
      }, "isArguments");
      var supportsStandardArguments = function() {
        return isStandardArguments(arguments);
      }();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // (disabled):node_modules/object-inspect/util.inspect
  var require_util = __commonJS({
    "(disabled):node_modules/object-inspect/util.inspect"() {
    }
  });

  // node_modules/object-inspect/index.js
  var require_object_inspect = __commonJS({
    "node_modules/object-inspect/index.js"(exports, module) {
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      __name(addNumericSeparator, "addNumericSeparator");
      var utilInspect = require_util();
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      module.exports = /* @__PURE__ */ __name(function inspect_(obj2, options, depth, seen) {
        var opts = options || {};
        if (has(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj2 === "undefined") {
          return "undefined";
        }
        if (obj2 === null) {
          return "null";
        }
        if (typeof obj2 === "boolean") {
          return obj2 ? "true" : "false";
        }
        if (typeof obj2 === "string") {
          return inspectString(obj2, opts);
        }
        if (typeof obj2 === "number") {
          if (obj2 === 0) {
            return Infinity / obj2 > 0 ? "0" : "-0";
          }
          var str = String(obj2);
          return numericSeparator ? addNumericSeparator(obj2, str) : str;
        }
        if (typeof obj2 === "bigint") {
          var bigIntStr = String(obj2) + "n";
          return numericSeparator ? addNumericSeparator(obj2, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj2 === "object") {
          return isArray(obj2) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj2) >= 0) {
          return "[Circular]";
        }
        function inspect(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        __name(inspect, "inspect");
        if (typeof obj2 === "function" && !isRegExp(obj2)) {
          var name2 = nameOf(obj2);
          var keys = arrObjKeys(obj2, inspect);
          return "[Function" + (name2 ? ": " + name2 : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
        }
        if (isSymbol(obj2)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj2), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj2);
          return typeof obj2 === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj2)) {
          var s = "<" + $toLowerCase.call(String(obj2.nodeName));
          var attrs = obj2.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj2.childNodes && obj2.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj2.nodeName)) + ">";
          return s;
        }
        if (isArray(obj2)) {
          if (obj2.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj2, inspect);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj2)) {
          var parts = arrObjKeys(obj2, inspect);
          if (!("cause" in Error.prototype) && "cause" in obj2 && !isEnumerable.call(obj2, "cause")) {
            return "{ [" + String(obj2) + "] " + $join.call($concat.call("[cause]: " + inspect(obj2.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj2) + "]";
          }
          return "{ [" + String(obj2) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj2 === "object" && customInspect) {
          if (inspectSymbol && typeof obj2[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj2, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj2.inspect === "function") {
            return obj2.inspect();
          }
        }
        if (isMap(obj2)) {
          var mapParts = [];
          if (mapForEach) {
            mapForEach.call(obj2, function(value, key) {
              mapParts.push(inspect(key, obj2, true) + " => " + inspect(value, obj2));
            });
          }
          return collectionOf("Map", mapSize.call(obj2), mapParts, indent);
        }
        if (isSet(obj2)) {
          var setParts = [];
          if (setForEach) {
            setForEach.call(obj2, function(value) {
              setParts.push(inspect(value, obj2));
            });
          }
          return collectionOf("Set", setSize.call(obj2), setParts, indent);
        }
        if (isWeakMap(obj2)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj2)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj2)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj2)) {
          return markBoxed(inspect(Number(obj2)));
        }
        if (isBigInt(obj2)) {
          return markBoxed(inspect(bigIntValueOf.call(obj2)));
        }
        if (isBoolean(obj2)) {
          return markBoxed(booleanValueOf.call(obj2));
        }
        if (isString(obj2)) {
          return markBoxed(inspect(String(obj2)));
        }
        if (typeof window !== "undefined" && obj2 === window) {
          return "{ [object Window] }";
        }
        if (obj2 === global) {
          return "{ [object globalThis] }";
        }
        if (!isDate(obj2) && !isRegExp(obj2)) {
          var ys = arrObjKeys(obj2, inspect);
          var isPlainObject = gPO ? gPO(obj2) === Object.prototype : obj2 instanceof Object || obj2.constructor === Object;
          var protoTag = obj2 instanceof Object ? "" : "null prototype";
          var stringTag = !isPlainObject && toStringTag && Object(obj2) === obj2 && toStringTag in obj2 ? $slice.call(toStr(obj2), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj2.constructor !== "function" ? "" : obj2.constructor.name ? obj2.constructor.name + " " : "";
          var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag + "{}";
          }
          if (indent) {
            return tag + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj2);
      }, "inspect_");
      function wrapQuotes(s, defaultStyle, opts) {
        var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
        return quoteChar + s + quoteChar;
      }
      __name(wrapQuotes, "wrapQuotes");
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      __name(quote, "quote");
      function isArray(obj2) {
        return toStr(obj2) === "[object Array]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isArray, "isArray");
      function isDate(obj2) {
        return toStr(obj2) === "[object Date]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isDate, "isDate");
      function isRegExp(obj2) {
        return toStr(obj2) === "[object RegExp]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isRegExp, "isRegExp");
      function isError(obj2) {
        return toStr(obj2) === "[object Error]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isError, "isError");
      function isString(obj2) {
        return toStr(obj2) === "[object String]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isString, "isString");
      function isNumber(obj2) {
        return toStr(obj2) === "[object Number]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isNumber, "isNumber");
      function isBoolean(obj2) {
        return toStr(obj2) === "[object Boolean]" && (!toStringTag || !(typeof obj2 === "object" && toStringTag in obj2));
      }
      __name(isBoolean, "isBoolean");
      function isSymbol(obj2) {
        if (hasShammedSymbols) {
          return obj2 && typeof obj2 === "object" && obj2 instanceof Symbol;
        }
        if (typeof obj2 === "symbol") {
          return true;
        }
        if (!obj2 || typeof obj2 !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj2);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isSymbol, "isSymbol");
      function isBigInt(obj2) {
        if (!obj2 || typeof obj2 !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj2);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isBigInt, "isBigInt");
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has(obj2, key) {
        return hasOwn.call(obj2, key);
      }
      __name(has, "has");
      function toStr(obj2) {
        return objectToString.call(obj2);
      }
      __name(toStr, "toStr");
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      __name(nameOf, "nameOf");
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      __name(indexOf, "indexOf");
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      __name(isMap, "isMap");
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakMap, "isWeakMap");
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakRef, "isWeakRef");
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      __name(isSet, "isSet");
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakSet, "isWeakSet");
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      __name(isElement, "isElement");
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      __name(inspectString, "inspectString");
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      __name(lowbyte, "lowbyte");
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      __name(markBoxed, "markBoxed");
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      __name(weakCollectionOf, "weakCollectionOf");
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      __name(collectionOf, "collectionOf");
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      __name(singleLineValues, "singleLineValues");
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      __name(getIndent, "getIndent");
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      __name(indentedJoin, "indentedJoin");
      function arrObjKeys(obj2, inspect) {
        var isArr = isArray(obj2);
        var xs = [];
        if (isArr) {
          xs.length = obj2.length;
          for (var i = 0; i < obj2.length; i++) {
            xs[i] = has(obj2, i) ? inspect(obj2[i], obj2) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj2) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj2) {
          if (!has(obj2, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj2.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj2) + ": " + inspect(obj2[key], obj2));
          } else {
            xs.push(key + ": " + inspect(obj2[key], obj2));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj2, syms[j])) {
              xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj2[syms[j]], obj2));
            }
          }
        }
        return xs;
      }
      __name(arrObjKeys, "arrObjKeys");
    }
  });

  // node_modules/side-channel/index.js
  var require_side_channel = __commonJS({
    "node_modules/side-channel/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_callBound();
      var inspect = require_object_inspect();
      var $TypeError = require_type();
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $Map = GetIntrinsic("%Map%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var listGetNode = /* @__PURE__ */ __name(function(list, key) {
        var prev = list;
        var curr;
        for (; (curr = prev.next) !== null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
            return curr;
          }
        }
      }, "listGetNode");
      var listGet = /* @__PURE__ */ __name(function(objects, key) {
        var node = listGetNode(objects, key);
        return node && node.value;
      }, "listGet");
      var listSet = /* @__PURE__ */ __name(function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = /** @type {import('.').ListNode<typeof value>} */
          {
            // eslint-disable-line no-param-reassign, no-extra-parens
            key,
            next: objects.next,
            value
          };
        }
      }, "listSet");
      var listHas = /* @__PURE__ */ __name(function(objects, key) {
        return !!listGetNode(objects, key);
      }, "listHas");
      module.exports = /* @__PURE__ */ __name(function getSideChannel() {
        var $wm;
        var $m;
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapGet($m, key);
              }
            } else {
              if ($o) {
                return listGet($o, key);
              }
            }
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapHas($m, key);
              }
            } else {
              if ($o) {
                return listHas($o, key);
              }
            }
            return false;
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if ($Map) {
              if (!$m) {
                $m = new $Map();
              }
              $mapSet($m, key, value);
            } else {
              if (!$o) {
                $o = { key: {}, next: null };
              }
              listSet($o, key, value);
            }
          }
        };
        return channel;
      }, "getSideChannel");
    }
  });

  // node_modules/internal-slot/index.js
  var require_internal_slot = __commonJS({
    "node_modules/internal-slot/index.js"(exports, module) {
      "use strict";
      var hasOwn = require_hasown();
      var channel = require_side_channel()();
      var $TypeError = require_type();
      var SLOT = {
        assert: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          channel.assert(O);
          if (!SLOT.has(O, slot)) {
            throw new $TypeError("`" + slot + "` is not present on `O`");
          }
        },
        get: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          return slots && slots["$" + slot];
        },
        has: function(O, slot) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          return !!slots && hasOwn(slots, "$" + slot);
        },
        set: function(O, slot, V) {
          if (!O || typeof O !== "object" && typeof O !== "function") {
            throw new $TypeError("`O` is not an object");
          }
          if (typeof slot !== "string") {
            throw new $TypeError("`slot` must be a string");
          }
          var slots = channel.get(O);
          if (!slots) {
            slots = {};
            channel.set(O, slots);
          }
          slots["$" + slot] = V;
        }
      };
      if (Object.freeze) {
        Object.freeze(SLOT);
      }
      module.exports = SLOT;
    }
  });

  // node_modules/stop-iteration-iterator/index.js
  var require_stop_iteration_iterator = __commonJS({
    "node_modules/stop-iteration-iterator/index.js"(exports, module) {
      "use strict";
      var SLOT = require_internal_slot();
      var $SyntaxError = SyntaxError;
      var $StopIteration = typeof StopIteration === "object" ? StopIteration : null;
      module.exports = /* @__PURE__ */ __name(function getStopIterationIterator(origIterator) {
        if (!$StopIteration) {
          throw new $SyntaxError("this environment lacks StopIteration");
        }
        SLOT.set(origIterator, "[[Done]]", false);
        var siIterator = {
          next: /* @__PURE__ */ __name(function next() {
            var iterator = SLOT.get(this, "[[Iterator]]");
            var done = SLOT.get(iterator, "[[Done]]");
            try {
              return {
                done,
                value: done ? void 0 : iterator.next()
              };
            } catch (e) {
              SLOT.set(iterator, "[[Done]]", true);
              if (e !== $StopIteration) {
                throw e;
              }
              return {
                done: true,
                value: void 0
              };
            }
          }, "next")
        };
        SLOT.set(siIterator, "[[Iterator]]", origIterator);
        return siIterator;
      }, "getStopIterationIterator");
    }
  });

  // node_modules/isarray/index.js
  var require_isarray = __commonJS({
    "node_modules/isarray/index.js"(exports, module) {
      var toString = {}.toString;
      module.exports = Array.isArray || function(arr) {
        return toString.call(arr) == "[object Array]";
      };
    }
  });

  // node_modules/is-string/index.js
  var require_is_string = __commonJS({
    "node_modules/is-string/index.js"(exports, module) {
      "use strict";
      var strValue = String.prototype.valueOf;
      var tryStringObject = /* @__PURE__ */ __name(function tryStringObject2(value) {
        try {
          strValue.call(value);
          return true;
        } catch (e) {
          return false;
        }
      }, "tryStringObject");
      var toStr = Object.prototype.toString;
      var strClass = "[object String]";
      var hasToStringTag = require_shams2()();
      module.exports = /* @__PURE__ */ __name(function isString(value) {
        if (typeof value === "string") {
          return true;
        }
        if (typeof value !== "object") {
          return false;
        }
        return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
      }, "isString");
    }
  });

  // node_modules/is-map/index.js
  var require_is_map = __commonJS({
    "node_modules/is-map/index.js"(exports, module) {
      "use strict";
      var $Map = typeof Map === "function" && Map.prototype ? Map : null;
      var $Set = typeof Set === "function" && Set.prototype ? Set : null;
      var exported;
      if (!$Map) {
        exported = /* @__PURE__ */ __name(function isMap(x) {
          return false;
        }, "isMap");
      }
      var $mapHas = $Map ? Map.prototype.has : null;
      var $setHas = $Set ? Set.prototype.has : null;
      if (!exported && !$mapHas) {
        exported = /* @__PURE__ */ __name(function isMap(x) {
          return false;
        }, "isMap");
      }
      module.exports = exported || /* @__PURE__ */ __name(function isMap(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        try {
          $mapHas.call(x);
          if ($setHas) {
            try {
              $setHas.call(x);
            } catch (e) {
              return true;
            }
          }
          return x instanceof $Map;
        } catch (e) {
        }
        return false;
      }, "isMap");
    }
  });

  // node_modules/is-set/index.js
  var require_is_set = __commonJS({
    "node_modules/is-set/index.js"(exports, module) {
      "use strict";
      var $Map = typeof Map === "function" && Map.prototype ? Map : null;
      var $Set = typeof Set === "function" && Set.prototype ? Set : null;
      var exported;
      if (!$Set) {
        exported = /* @__PURE__ */ __name(function isSet(x) {
          return false;
        }, "isSet");
      }
      var $mapHas = $Map ? Map.prototype.has : null;
      var $setHas = $Set ? Set.prototype.has : null;
      if (!exported && !$setHas) {
        exported = /* @__PURE__ */ __name(function isSet(x) {
          return false;
        }, "isSet");
      }
      module.exports = exported || /* @__PURE__ */ __name(function isSet(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        try {
          $setHas.call(x);
          if ($mapHas) {
            try {
              $mapHas.call(x);
            } catch (e) {
              return true;
            }
          }
          return x instanceof $Set;
        } catch (e) {
        }
        return false;
      }, "isSet");
    }
  });

  // node_modules/es-get-iterator/index.js
  var require_es_get_iterator = __commonJS({
    "node_modules/es-get-iterator/index.js"(exports, module) {
      "use strict";
      var isArguments = require_is_arguments();
      var getStopIterationIterator = require_stop_iteration_iterator();
      if (require_has_symbols()() || require_shams()()) {
        $iterator = Symbol.iterator;
        module.exports = /* @__PURE__ */ __name(function getIterator(iterable) {
          if (iterable != null && typeof iterable[$iterator] !== "undefined") {
            return iterable[$iterator]();
          }
          if (isArguments(iterable)) {
            return Array.prototype[$iterator].call(iterable);
          }
        }, "getIterator");
      } else {
        isArray = require_isarray();
        isString = require_is_string();
        GetIntrinsic = require_get_intrinsic();
        $Map = GetIntrinsic("%Map%", true);
        $Set = GetIntrinsic("%Set%", true);
        callBound = require_callBound();
        $arrayPush = callBound("Array.prototype.push");
        $charCodeAt = callBound("String.prototype.charCodeAt");
        $stringSlice = callBound("String.prototype.slice");
        advanceStringIndex = /* @__PURE__ */ __name(function advanceStringIndex2(S, index) {
          var length = S.length;
          if (index + 1 >= length) {
            return index + 1;
          }
          var first = $charCodeAt(S, index);
          if (first < 55296 || first > 56319) {
            return index + 1;
          }
          var second = $charCodeAt(S, index + 1);
          if (second < 56320 || second > 57343) {
            return index + 1;
          }
          return index + 2;
        }, "advanceStringIndex");
        getArrayIterator = /* @__PURE__ */ __name(function getArrayIterator2(arraylike) {
          var i = 0;
          return {
            next: /* @__PURE__ */ __name(function next() {
              var done = i >= arraylike.length;
              var value;
              if (!done) {
                value = arraylike[i];
                i += 1;
              }
              return {
                done,
                value
              };
            }, "next")
          };
        }, "getArrayIterator");
        getNonCollectionIterator = /* @__PURE__ */ __name(function getNonCollectionIterator2(iterable, noPrimordialCollections) {
          if (isArray(iterable) || isArguments(iterable)) {
            return getArrayIterator(iterable);
          }
          if (isString(iterable)) {
            var i = 0;
            return {
              next: /* @__PURE__ */ __name(function next() {
                var nextIndex = advanceStringIndex(iterable, i);
                var value = $stringSlice(iterable, i, nextIndex);
                i = nextIndex;
                return {
                  done: nextIndex > iterable.length,
                  value
                };
              }, "next")
            };
          }
          if (noPrimordialCollections && typeof iterable["_es6-shim iterator_"] !== "undefined") {
            return iterable["_es6-shim iterator_"]();
          }
        }, "getNonCollectionIterator");
        if (!$Map && !$Set) {
          module.exports = /* @__PURE__ */ __name(function getIterator(iterable) {
            if (iterable != null) {
              return getNonCollectionIterator(iterable, true);
            }
          }, "getIterator");
        } else {
          isMap = require_is_map();
          isSet = require_is_set();
          $mapForEach = callBound("Map.prototype.forEach", true);
          $setForEach = callBound("Set.prototype.forEach", true);
          if (typeof process === "undefined" || !process.versions || !process.versions.node) {
            $mapIterator = callBound("Map.prototype.iterator", true);
            $setIterator = callBound("Set.prototype.iterator", true);
          }
          $mapAtAtIterator = callBound("Map.prototype.@@iterator", true) || callBound("Map.prototype._es6-shim iterator_", true);
          $setAtAtIterator = callBound("Set.prototype.@@iterator", true) || callBound("Set.prototype._es6-shim iterator_", true);
          getCollectionIterator = /* @__PURE__ */ __name(function getCollectionIterator2(iterable) {
            if (isMap(iterable)) {
              if ($mapIterator) {
                return getStopIterationIterator($mapIterator(iterable));
              }
              if ($mapAtAtIterator) {
                return $mapAtAtIterator(iterable);
              }
              if ($mapForEach) {
                var entries = [];
                $mapForEach(iterable, function(v, k) {
                  $arrayPush(entries, [k, v]);
                });
                return getArrayIterator(entries);
              }
            }
            if (isSet(iterable)) {
              if ($setIterator) {
                return getStopIterationIterator($setIterator(iterable));
              }
              if ($setAtAtIterator) {
                return $setAtAtIterator(iterable);
              }
              if ($setForEach) {
                var values = [];
                $setForEach(iterable, function(v) {
                  $arrayPush(values, v);
                });
                return getArrayIterator(values);
              }
            }
          }, "getCollectionIterator");
          module.exports = /* @__PURE__ */ __name(function getIterator(iterable) {
            return getCollectionIterator(iterable) || getNonCollectionIterator(iterable);
          }, "getIterator");
        }
      }
      var $iterator;
      var isArray;
      var isString;
      var GetIntrinsic;
      var $Map;
      var $Set;
      var callBound;
      var $arrayPush;
      var $charCodeAt;
      var $stringSlice;
      var advanceStringIndex;
      var getArrayIterator;
      var getNonCollectionIterator;
      var isMap;
      var isSet;
      var $mapForEach;
      var $setForEach;
      var $mapIterator;
      var $setIterator;
      var $mapAtAtIterator;
      var $setAtAtIterator;
      var getCollectionIterator;
    }
  });

  // node_modules/object-is/implementation.js
  var require_implementation5 = __commonJS({
    "node_modules/object-is/implementation.js"(exports, module) {
      "use strict";
      var numberIsNaN = /* @__PURE__ */ __name(function(value) {
        return value !== value;
      }, "numberIsNaN");
      module.exports = /* @__PURE__ */ __name(function is(a, b) {
        if (a === 0 && b === 0) {
          return 1 / a === 1 / b;
        }
        if (a === b) {
          return true;
        }
        if (numberIsNaN(a) && numberIsNaN(b)) {
          return true;
        }
        return false;
      }, "is");
    }
  });

  // node_modules/object-is/polyfill.js
  var require_polyfill3 = __commonJS({
    "node_modules/object-is/polyfill.js"(exports, module) {
      "use strict";
      var implementation = require_implementation5();
      module.exports = /* @__PURE__ */ __name(function getPolyfill() {
        return typeof Object.is === "function" ? Object.is : implementation;
      }, "getPolyfill");
    }
  });

  // node_modules/object-is/shim.js
  var require_shim3 = __commonJS({
    "node_modules/object-is/shim.js"(exports, module) {
      "use strict";
      var getPolyfill = require_polyfill3();
      var define = require_define_properties();
      module.exports = /* @__PURE__ */ __name(function shimObjectIs() {
        var polyfill = getPolyfill();
        define(Object, { is: polyfill }, {
          is: /* @__PURE__ */ __name(function testObjectIs() {
            return Object.is !== polyfill;
          }, "testObjectIs")
        });
        return polyfill;
      }, "shimObjectIs");
    }
  });

  // node_modules/object-is/index.js
  var require_object_is = __commonJS({
    "node_modules/object-is/index.js"(exports, module) {
      "use strict";
      var define = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation5();
      var getPolyfill = require_polyfill3();
      var shim = require_shim3();
      var polyfill = callBind(getPolyfill(), Object);
      define(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // node_modules/is-array-buffer/index.js
  var require_is_array_buffer = __commonJS({
    "node_modules/is-array-buffer/index.js"(exports, module) {
      "use strict";
      var callBind = require_call_bind();
      var callBound = require_callBound();
      var GetIntrinsic = require_get_intrinsic();
      var $ArrayBuffer = GetIntrinsic("%ArrayBuffer%", true);
      var $byteLength = callBound("ArrayBuffer.prototype.byteLength", true);
      var $toString = callBound("Object.prototype.toString");
      var abSlice = !!$ArrayBuffer && !$byteLength && new $ArrayBuffer(0).slice;
      var $abSlice = !!abSlice && callBind(abSlice);
      module.exports = $byteLength || $abSlice ? /* @__PURE__ */ __name(function isArrayBuffer(obj2) {
        if (!obj2 || typeof obj2 !== "object") {
          return false;
        }
        try {
          if ($byteLength) {
            $byteLength(obj2);
          } else {
            $abSlice(obj2, 0);
          }
          return true;
        } catch (e) {
          return false;
        }
      }, "isArrayBuffer") : $ArrayBuffer ? /* @__PURE__ */ __name(function isArrayBuffer(obj2) {
        return $toString(obj2) === "[object ArrayBuffer]";
      }, "isArrayBuffer") : /* @__PURE__ */ __name(function isArrayBuffer(obj2) {
        return false;
      }, "isArrayBuffer");
    }
  });

  // node_modules/is-date-object/index.js
  var require_is_date_object = __commonJS({
    "node_modules/is-date-object/index.js"(exports, module) {
      "use strict";
      var getDay = Date.prototype.getDay;
      var tryDateObject = /* @__PURE__ */ __name(function tryDateGetDayCall(value) {
        try {
          getDay.call(value);
          return true;
        } catch (e) {
          return false;
        }
      }, "tryDateGetDayCall");
      var toStr = Object.prototype.toString;
      var dateClass = "[object Date]";
      var hasToStringTag = require_shams2()();
      module.exports = /* @__PURE__ */ __name(function isDateObject(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
      }, "isDateObject");
    }
  });

  // node_modules/is-regex/index.js
  var require_is_regex = __commonJS({
    "node_modules/is-regex/index.js"(exports, module) {
      "use strict";
      var callBound = require_callBound();
      var hasToStringTag = require_shams2()();
      var has;
      var $exec;
      var isRegexMarker;
      var badStringifier;
      if (hasToStringTag) {
        has = callBound("Object.prototype.hasOwnProperty");
        $exec = callBound("RegExp.prototype.exec");
        isRegexMarker = {};
        throwRegexMarker = /* @__PURE__ */ __name(function() {
          throw isRegexMarker;
        }, "throwRegexMarker");
        badStringifier = {
          toString: throwRegexMarker,
          valueOf: throwRegexMarker
        };
        if (typeof Symbol.toPrimitive === "symbol") {
          badStringifier[Symbol.toPrimitive] = throwRegexMarker;
        }
      }
      var throwRegexMarker;
      var $toString = callBound("Object.prototype.toString");
      var gOPD = Object.getOwnPropertyDescriptor;
      var regexClass = "[object RegExp]";
      module.exports = hasToStringTag ? /* @__PURE__ */ __name(function isRegex(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        var descriptor = gOPD(value, "lastIndex");
        var hasLastIndexDataProperty = descriptor && has(descriptor, "value");
        if (!hasLastIndexDataProperty) {
          return false;
        }
        try {
          $exec(value, badStringifier);
        } catch (e) {
          return e === isRegexMarker;
        }
      }, "isRegex") : /* @__PURE__ */ __name(function isRegex(value) {
        if (!value || typeof value !== "object" && typeof value !== "function") {
          return false;
        }
        return $toString(value) === regexClass;
      }, "isRegex");
    }
  });

  // node_modules/is-shared-array-buffer/index.js
  var require_is_shared_array_buffer = __commonJS({
    "node_modules/is-shared-array-buffer/index.js"(exports, module) {
      "use strict";
      var callBound = require_callBound();
      var $byteLength = callBound("SharedArrayBuffer.prototype.byteLength", true);
      module.exports = $byteLength ? /* @__PURE__ */ __name(function isSharedArrayBuffer(obj2) {
        if (!obj2 || typeof obj2 !== "object") {
          return false;
        }
        try {
          $byteLength(obj2);
          return true;
        } catch (e) {
          return false;
        }
      }, "isSharedArrayBuffer") : /* @__PURE__ */ __name(function isSharedArrayBuffer(obj2) {
        return false;
      }, "isSharedArrayBuffer");
    }
  });

  // node_modules/is-number-object/index.js
  var require_is_number_object = __commonJS({
    "node_modules/is-number-object/index.js"(exports, module) {
      "use strict";
      var numToStr = Number.prototype.toString;
      var tryNumberObject = /* @__PURE__ */ __name(function tryNumberObject2(value) {
        try {
          numToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      }, "tryNumberObject");
      var toStr = Object.prototype.toString;
      var numClass = "[object Number]";
      var hasToStringTag = require_shams2()();
      module.exports = /* @__PURE__ */ __name(function isNumberObject(value) {
        if (typeof value === "number") {
          return true;
        }
        if (typeof value !== "object") {
          return false;
        }
        return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
      }, "isNumberObject");
    }
  });

  // node_modules/is-boolean-object/index.js
  var require_is_boolean_object = __commonJS({
    "node_modules/is-boolean-object/index.js"(exports, module) {
      "use strict";
      var callBound = require_callBound();
      var $boolToStr = callBound("Boolean.prototype.toString");
      var $toString = callBound("Object.prototype.toString");
      var tryBooleanObject = /* @__PURE__ */ __name(function booleanBrandCheck(value) {
        try {
          $boolToStr(value);
          return true;
        } catch (e) {
          return false;
        }
      }, "booleanBrandCheck");
      var boolClass = "[object Boolean]";
      var hasToStringTag = require_shams2()();
      module.exports = /* @__PURE__ */ __name(function isBoolean(value) {
        if (typeof value === "boolean") {
          return true;
        }
        if (value === null || typeof value !== "object") {
          return false;
        }
        return hasToStringTag && Symbol.toStringTag in value ? tryBooleanObject(value) : $toString(value) === boolClass;
      }, "isBoolean");
    }
  });

  // node_modules/is-symbol/index.js
  var require_is_symbol = __commonJS({
    "node_modules/is-symbol/index.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      var hasSymbols = require_has_symbols()();
      if (hasSymbols) {
        symToStr = Symbol.prototype.toString;
        symStringRegex = /^Symbol\(.*\)$/;
        isSymbolObject = /* @__PURE__ */ __name(function isRealSymbolObject(value) {
          if (typeof value.valueOf() !== "symbol") {
            return false;
          }
          return symStringRegex.test(symToStr.call(value));
        }, "isRealSymbolObject");
        module.exports = /* @__PURE__ */ __name(function isSymbol(value) {
          if (typeof value === "symbol") {
            return true;
          }
          if (toStr.call(value) !== "[object Symbol]") {
            return false;
          }
          try {
            return isSymbolObject(value);
          } catch (e) {
            return false;
          }
        }, "isSymbol");
      } else {
        module.exports = /* @__PURE__ */ __name(function isSymbol(value) {
          return false;
        }, "isSymbol");
      }
      var symToStr;
      var symStringRegex;
      var isSymbolObject;
    }
  });

  // node_modules/has-bigints/index.js
  var require_has_bigints = __commonJS({
    "node_modules/has-bigints/index.js"(exports, module) {
      "use strict";
      var $BigInt = typeof BigInt !== "undefined" && BigInt;
      module.exports = /* @__PURE__ */ __name(function hasNativeBigInts() {
        return typeof $BigInt === "function" && typeof BigInt === "function" && typeof $BigInt(42) === "bigint" && typeof BigInt(42) === "bigint";
      }, "hasNativeBigInts");
    }
  });

  // node_modules/is-bigint/index.js
  var require_is_bigint = __commonJS({
    "node_modules/is-bigint/index.js"(exports, module) {
      "use strict";
      var hasBigInts = require_has_bigints()();
      if (hasBigInts) {
        bigIntValueOf = BigInt.prototype.valueOf;
        tryBigInt = /* @__PURE__ */ __name(function tryBigIntObject(value) {
          try {
            bigIntValueOf.call(value);
            return true;
          } catch (e) {
          }
          return false;
        }, "tryBigIntObject");
        module.exports = /* @__PURE__ */ __name(function isBigInt(value) {
          if (value === null || typeof value === "undefined" || typeof value === "boolean" || typeof value === "string" || typeof value === "number" || typeof value === "symbol" || typeof value === "function") {
            return false;
          }
          if (typeof value === "bigint") {
            return true;
          }
          return tryBigInt(value);
        }, "isBigInt");
      } else {
        module.exports = /* @__PURE__ */ __name(function isBigInt(value) {
          return false;
        }, "isBigInt");
      }
      var bigIntValueOf;
      var tryBigInt;
    }
  });

  // node_modules/which-boxed-primitive/index.js
  var require_which_boxed_primitive = __commonJS({
    "node_modules/which-boxed-primitive/index.js"(exports, module) {
      "use strict";
      var isString = require_is_string();
      var isNumber = require_is_number_object();
      var isBoolean = require_is_boolean_object();
      var isSymbol = require_is_symbol();
      var isBigInt = require_is_bigint();
      module.exports = /* @__PURE__ */ __name(function whichBoxedPrimitive(value) {
        if (value == null || typeof value !== "object" && typeof value !== "function") {
          return null;
        }
        if (isString(value)) {
          return "String";
        }
        if (isNumber(value)) {
          return "Number";
        }
        if (isBoolean(value)) {
          return "Boolean";
        }
        if (isSymbol(value)) {
          return "Symbol";
        }
        if (isBigInt(value)) {
          return "BigInt";
        }
      }, "whichBoxedPrimitive");
    }
  });

  // node_modules/is-weakmap/index.js
  var require_is_weakmap = __commonJS({
    "node_modules/is-weakmap/index.js"(exports, module) {
      "use strict";
      var $WeakMap = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap : null;
      var $WeakSet = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet : null;
      var exported;
      if (!$WeakMap) {
        exported = /* @__PURE__ */ __name(function isWeakMap(x) {
          return false;
        }, "isWeakMap");
      }
      var $mapHas = $WeakMap ? $WeakMap.prototype.has : null;
      var $setHas = $WeakSet ? $WeakSet.prototype.has : null;
      if (!exported && !$mapHas) {
        exported = /* @__PURE__ */ __name(function isWeakMap(x) {
          return false;
        }, "isWeakMap");
      }
      module.exports = exported || /* @__PURE__ */ __name(function isWeakMap(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        try {
          $mapHas.call(x, $mapHas);
          if ($setHas) {
            try {
              $setHas.call(x, $setHas);
            } catch (e) {
              return true;
            }
          }
          return x instanceof $WeakMap;
        } catch (e) {
        }
        return false;
      }, "isWeakMap");
    }
  });

  // node_modules/is-weakset/index.js
  var require_is_weakset = __commonJS({
    "node_modules/is-weakset/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_callBound();
      var $WeakSet = GetIntrinsic("%WeakSet%", true);
      var $setHas = callBound("WeakSet.prototype.has", true);
      if ($setHas) {
        $mapHas = callBound("WeakMap.prototype.has", true);
        module.exports = /* @__PURE__ */ __name(function isWeakSet(x) {
          if (!x || typeof x !== "object") {
            return false;
          }
          try {
            $setHas(x, $setHas);
            if ($mapHas) {
              try {
                $mapHas(x, $mapHas);
              } catch (e) {
                return true;
              }
            }
            return x instanceof $WeakSet;
          } catch (e) {
          }
          return false;
        }, "isWeakSet");
      } else {
        module.exports = /* @__PURE__ */ __name(function isWeakSet(x) {
          return false;
        }, "isWeakSet");
      }
      var $mapHas;
    }
  });

  // node_modules/which-collection/index.js
  var require_which_collection = __commonJS({
    "node_modules/which-collection/index.js"(exports, module) {
      "use strict";
      var isMap = require_is_map();
      var isSet = require_is_set();
      var isWeakMap = require_is_weakmap();
      var isWeakSet = require_is_weakset();
      module.exports = /* @__PURE__ */ __name(function whichCollection(value) {
        if (value && typeof value === "object") {
          if (isMap(value)) {
            return "Map";
          }
          if (isSet(value)) {
            return "Set";
          }
          if (isWeakMap(value)) {
            return "WeakMap";
          }
          if (isWeakSet(value)) {
            return "WeakSet";
          }
        }
        return false;
      }, "whichCollection");
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports, module) {
      "use strict";
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = /* @__PURE__ */ __name(function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      }, "isES6ClassFunction");
      var tryFunctionObject = /* @__PURE__ */ __name(function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      }, "tryFunctionToStr");
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = /* @__PURE__ */ __name(function isDocumentDotAll() {
        return false;
      }, "isDocumentDotAll");
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = /* @__PURE__ */ __name(function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          }, "isDocumentDotAll");
        }
      }
      var all;
      module.exports = reflectApply ? /* @__PURE__ */ __name(function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      }, "isCallable") : /* @__PURE__ */ __name(function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      }, "isCallable");
    }
  });

  // node_modules/for-each/index.js
  var require_for_each = __commonJS({
    "node_modules/for-each/index.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      var toStr = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var forEachArray = /* @__PURE__ */ __name(function forEachArray2(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array);
            } else {
              iterator.call(receiver, array[i], i, array);
            }
          }
        }
      }, "forEachArray");
      var forEachString = /* @__PURE__ */ __name(function forEachString2(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          if (receiver == null) {
            iterator(string.charAt(i), i, string);
          } else {
            iterator.call(receiver, string.charAt(i), i, string);
          }
        }
      }, "forEachString");
      var forEachObject = /* @__PURE__ */ __name(function forEachObject2(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object);
            } else {
              iterator.call(receiver, object[k], k, object);
            }
          }
        }
      }, "forEachObject");
      var forEach = /* @__PURE__ */ __name(function forEach2(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError("iterator must be a function");
        }
        var receiver;
        if (arguments.length >= 3) {
          receiver = thisArg;
        }
        if (toStr.call(list) === "[object Array]") {
          forEachArray(list, iterator, receiver);
        } else if (typeof list === "string") {
          forEachString(list, iterator, receiver);
        } else {
          forEachObject(list, iterator, receiver);
        }
      }, "forEach");
      module.exports = forEach;
    }
  });

  // node_modules/possible-typed-array-names/index.js
  var require_possible_typed_array_names = __commonJS({
    "node_modules/possible-typed-array-names/index.js"(exports, module) {
      "use strict";
      module.exports = [
        "Float32Array",
        "Float64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array"
      ];
    }
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "node_modules/available-typed-arrays/index.js"(exports, module) {
      "use strict";
      var possibleNames = require_possible_typed_array_names();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      module.exports = /* @__PURE__ */ __name(function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      }, "availableTypedArrays");
    }
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "node_modules/which-typed-array/index.js"(exports, module) {
      "use strict";
      var forEach = require_for_each();
      var availableTypedArrays = require_available_typed_arrays();
      var callBind = require_call_bind();
      var callBound = require_callBound();
      var gOPD = require_gopd();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var getPrototypeOf = Object.getPrototypeOf;
      var $indexOf = callBound("Array.prototype.indexOf", true) || /* @__PURE__ */ __name(function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      }, "indexOf");
      var cache = { __proto__: null };
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
              var superProto = getPrototypeOf(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            cache["$" + typedArray] = callBind(descriptor.get);
          }
        });
      } else {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          var fn = arr.slice || arr.set;
          if (fn) {
            cache["$" + typedArray] = callBind(fn);
          }
        });
      }
      var tryTypedArrays = /* @__PURE__ */ __name(function tryAllTypedArrays(value) {
        var found = false;
        forEach(
          // eslint-disable-next-line no-extra-parens
          /** @type {Record<`\$${TypedArrayName}`, Getter>} */
          /** @type {any} */
          cache,
          /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
          function(getter, typedArray) {
            if (!found) {
              try {
                if ("$" + getter(value) === typedArray) {
                  found = $slice(typedArray, 1);
                }
              } catch (e) {
              }
            }
          }
        );
        return found;
      }, "tryAllTypedArrays");
      var trySlices = /* @__PURE__ */ __name(function tryAllSlices(value) {
        var found = false;
        forEach(
          // eslint-disable-next-line no-extra-parens
          /** @type {Record<`\$${TypedArrayName}`, Getter>} */
          /** @type {any} */
          cache,
          /** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */
          function(getter, name2) {
            if (!found) {
              try {
                getter(value);
                found = $slice(name2, 1);
              } catch (e) {
              }
            }
          }
        );
        return found;
      }, "tryAllSlices");
      module.exports = /* @__PURE__ */ __name(function whichTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag) {
          var tag = $slice($toString(value), 8, -1);
          if ($indexOf(typedArrays, tag) > -1) {
            return tag;
          }
          if (tag !== "Object") {
            return false;
          }
          return trySlices(value);
        }
        if (!gOPD) {
          return null;
        }
        return tryTypedArrays(value);
      }, "whichTypedArray");
    }
  });

  // node_modules/array-buffer-byte-length/index.js
  var require_array_buffer_byte_length = __commonJS({
    "node_modules/array-buffer-byte-length/index.js"(exports, module) {
      "use strict";
      var callBound = require_callBound();
      var $byteLength = callBound("ArrayBuffer.prototype.byteLength", true);
      var isArrayBuffer = require_is_array_buffer();
      module.exports = /* @__PURE__ */ __name(function byteLength(ab) {
        if (!isArrayBuffer(ab)) {
          return NaN;
        }
        return $byteLength ? $byteLength(ab) : ab.byteLength;
      }, "byteLength");
    }
  });

  // node_modules/deep-equal/index.js
  var require_deep_equal = __commonJS({
    "node_modules/deep-equal/index.js"(exports, module) {
      "use strict";
      var assign = require_object();
      var callBound = require_callBound();
      var flags = require_regexp_prototype();
      var GetIntrinsic = require_get_intrinsic();
      var getIterator = require_es_get_iterator();
      var getSideChannel = require_side_channel();
      var is = require_object_is();
      var isArguments = require_is_arguments();
      var isArray = require_isarray();
      var isArrayBuffer = require_is_array_buffer();
      var isDate = require_is_date_object();
      var isRegex = require_is_regex();
      var isSharedArrayBuffer = require_is_shared_array_buffer();
      var objectKeys = require_object_keys();
      var whichBoxedPrimitive = require_which_boxed_primitive();
      var whichCollection = require_which_collection();
      var whichTypedArray = require_which_typed_array();
      var byteLength = require_array_buffer_byte_length();
      var sabByteLength = callBound("SharedArrayBuffer.prototype.byteLength", true);
      var $getTime = callBound("Date.prototype.getTime");
      var gPO = Object.getPrototypeOf;
      var $objToString = callBound("Object.prototype.toString");
      var $Set = GetIntrinsic("%Set%", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSize = callBound("Map.prototype.size", true);
      var $setAdd = callBound("Set.prototype.add", true);
      var $setDelete = callBound("Set.prototype.delete", true);
      var $setHas = callBound("Set.prototype.has", true);
      var $setSize = callBound("Set.prototype.size", true);
      function setHasEqualElement(set, val1, opts, channel) {
        var i = getIterator(set);
        var result;
        while ((result = i.next()) && !result.done) {
          if (internalDeepEqual(val1, result.value, opts, channel)) {
            $setDelete(set, result.value);
            return true;
          }
        }
        return false;
      }
      __name(setHasEqualElement, "setHasEqualElement");
      function findLooseMatchingPrimitives(prim) {
        if (typeof prim === "undefined") {
          return null;
        }
        if (typeof prim === "object") {
          return void 0;
        }
        if (typeof prim === "symbol") {
          return false;
        }
        if (typeof prim === "string" || typeof prim === "number") {
          return +prim === +prim;
        }
        return true;
      }
      __name(findLooseMatchingPrimitives, "findLooseMatchingPrimitives");
      function mapMightHaveLoosePrim(a, b, prim, item, opts, channel) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) {
          return altValue;
        }
        var curB = $mapGet(b, altValue);
        var looseOpts = assign({}, opts, { strict: false });
        if (typeof curB === "undefined" && !$mapHas(b, altValue) || !internalDeepEqual(item, curB, looseOpts, channel)) {
          return false;
        }
        return !$mapHas(a, altValue) && internalDeepEqual(item, curB, looseOpts, channel);
      }
      __name(mapMightHaveLoosePrim, "mapMightHaveLoosePrim");
      function setMightHaveLoosePrim(a, b, prim) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) {
          return altValue;
        }
        return $setHas(b, altValue) && !$setHas(a, altValue);
      }
      __name(setMightHaveLoosePrim, "setMightHaveLoosePrim");
      function mapHasEqualEntry(set, map, key1, item1, opts, channel) {
        var i = getIterator(set);
        var result;
        var key2;
        while ((result = i.next()) && !result.done) {
          key2 = result.value;
          if (
            // eslint-disable-next-line no-use-before-define
            internalDeepEqual(key1, key2, opts, channel) && internalDeepEqual(item1, $mapGet(map, key2), opts, channel)
          ) {
            $setDelete(set, key2);
            return true;
          }
        }
        return false;
      }
      __name(mapHasEqualEntry, "mapHasEqualEntry");
      function internalDeepEqual(actual, expected, options, channel) {
        var opts = options || {};
        if (opts.strict ? is(actual, expected) : actual === expected) {
          return true;
        }
        var actualBoxed = whichBoxedPrimitive(actual);
        var expectedBoxed = whichBoxedPrimitive(expected);
        if (actualBoxed !== expectedBoxed) {
          return false;
        }
        if (!actual || !expected || typeof actual !== "object" && typeof expected !== "object") {
          return opts.strict ? is(actual, expected) : actual == expected;
        }
        var hasActual = channel.has(actual);
        var hasExpected = channel.has(expected);
        var sentinel;
        if (hasActual && hasExpected) {
          if (channel.get(actual) === channel.get(expected)) {
            return true;
          }
        } else {
          sentinel = {};
        }
        if (!hasActual) {
          channel.set(actual, sentinel);
        }
        if (!hasExpected) {
          channel.set(expected, sentinel);
        }
        return objEquiv(actual, expected, opts, channel);
      }
      __name(internalDeepEqual, "internalDeepEqual");
      function isBuffer(x) {
        if (!x || typeof x !== "object" || typeof x.length !== "number") {
          return false;
        }
        if (typeof x.copy !== "function" || typeof x.slice !== "function") {
          return false;
        }
        if (x.length > 0 && typeof x[0] !== "number") {
          return false;
        }
        return !!(x.constructor && x.constructor.isBuffer && x.constructor.isBuffer(x));
      }
      __name(isBuffer, "isBuffer");
      function setEquiv(a, b, opts, channel) {
        if ($setSize(a) !== $setSize(b)) {
          return false;
        }
        var iA = getIterator(a);
        var iB = getIterator(b);
        var resultA;
        var resultB;
        var set;
        while ((resultA = iA.next()) && !resultA.done) {
          if (resultA.value && typeof resultA.value === "object") {
            if (!set) {
              set = new $Set();
            }
            $setAdd(set, resultA.value);
          } else if (!$setHas(b, resultA.value)) {
            if (opts.strict) {
              return false;
            }
            if (!setMightHaveLoosePrim(a, b, resultA.value)) {
              return false;
            }
            if (!set) {
              set = new $Set();
            }
            $setAdd(set, resultA.value);
          }
        }
        if (set) {
          while ((resultB = iB.next()) && !resultB.done) {
            if (resultB.value && typeof resultB.value === "object") {
              if (!setHasEqualElement(set, resultB.value, opts.strict, channel)) {
                return false;
              }
            } else if (!opts.strict && !$setHas(a, resultB.value) && !setHasEqualElement(set, resultB.value, opts.strict, channel)) {
              return false;
            }
          }
          return $setSize(set) === 0;
        }
        return true;
      }
      __name(setEquiv, "setEquiv");
      function mapEquiv(a, b, opts, channel) {
        if ($mapSize(a) !== $mapSize(b)) {
          return false;
        }
        var iA = getIterator(a);
        var iB = getIterator(b);
        var resultA;
        var resultB;
        var set;
        var key;
        var item1;
        var item2;
        while ((resultA = iA.next()) && !resultA.done) {
          key = resultA.value[0];
          item1 = resultA.value[1];
          if (key && typeof key === "object") {
            if (!set) {
              set = new $Set();
            }
            $setAdd(set, key);
          } else {
            item2 = $mapGet(b, key);
            if (typeof item2 === "undefined" && !$mapHas(b, key) || !internalDeepEqual(item1, item2, opts, channel)) {
              if (opts.strict) {
                return false;
              }
              if (!mapMightHaveLoosePrim(a, b, key, item1, opts, channel)) {
                return false;
              }
              if (!set) {
                set = new $Set();
              }
              $setAdd(set, key);
            }
          }
        }
        if (set) {
          while ((resultB = iB.next()) && !resultB.done) {
            key = resultB.value[0];
            item2 = resultB.value[1];
            if (key && typeof key === "object") {
              if (!mapHasEqualEntry(set, a, key, item2, opts, channel)) {
                return false;
              }
            } else if (!opts.strict && (!a.has(key) || !internalDeepEqual($mapGet(a, key), item2, opts, channel)) && !mapHasEqualEntry(set, a, key, item2, assign({}, opts, { strict: false }), channel)) {
              return false;
            }
          }
          return $setSize(set) === 0;
        }
        return true;
      }
      __name(mapEquiv, "mapEquiv");
      function objEquiv(a, b, opts, channel) {
        var i, key;
        if (typeof a !== typeof b) {
          return false;
        }
        if (a == null || b == null) {
          return false;
        }
        if ($objToString(a) !== $objToString(b)) {
          return false;
        }
        if (isArguments(a) !== isArguments(b)) {
          return false;
        }
        var aIsArray = isArray(a);
        var bIsArray = isArray(b);
        if (aIsArray !== bIsArray) {
          return false;
        }
        var aIsError = a instanceof Error;
        var bIsError = b instanceof Error;
        if (aIsError !== bIsError) {
          return false;
        }
        if (aIsError || bIsError) {
          if (a.name !== b.name || a.message !== b.message) {
            return false;
          }
        }
        var aIsRegex = isRegex(a);
        var bIsRegex = isRegex(b);
        if (aIsRegex !== bIsRegex) {
          return false;
        }
        if ((aIsRegex || bIsRegex) && (a.source !== b.source || flags(a) !== flags(b))) {
          return false;
        }
        var aIsDate = isDate(a);
        var bIsDate = isDate(b);
        if (aIsDate !== bIsDate) {
          return false;
        }
        if (aIsDate || bIsDate) {
          if ($getTime(a) !== $getTime(b)) {
            return false;
          }
        }
        if (opts.strict && gPO && gPO(a) !== gPO(b)) {
          return false;
        }
        var aWhich = whichTypedArray(a);
        var bWhich = whichTypedArray(b);
        if (aWhich !== bWhich) {
          return false;
        }
        if (aWhich || bWhich) {
          if (a.length !== b.length) {
            return false;
          }
          for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        }
        var aIsBuffer = isBuffer(a);
        var bIsBuffer = isBuffer(b);
        if (aIsBuffer !== bIsBuffer) {
          return false;
        }
        if (aIsBuffer || bIsBuffer) {
          if (a.length !== b.length) {
            return false;
          }
          for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
              return false;
            }
          }
          return true;
        }
        var aIsArrayBuffer = isArrayBuffer(a);
        var bIsArrayBuffer = isArrayBuffer(b);
        if (aIsArrayBuffer !== bIsArrayBuffer) {
          return false;
        }
        if (aIsArrayBuffer || bIsArrayBuffer) {
          if (byteLength(a) !== byteLength(b)) {
            return false;
          }
          return typeof Uint8Array === "function" && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
        }
        var aIsSAB = isSharedArrayBuffer(a);
        var bIsSAB = isSharedArrayBuffer(b);
        if (aIsSAB !== bIsSAB) {
          return false;
        }
        if (aIsSAB || bIsSAB) {
          if (sabByteLength(a) !== sabByteLength(b)) {
            return false;
          }
          return typeof Uint8Array === "function" && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
        }
        if (typeof a !== typeof b) {
          return false;
        }
        var ka = objectKeys(a);
        var kb = objectKeys(b);
        if (ka.length !== kb.length) {
          return false;
        }
        ka.sort();
        kb.sort();
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] != kb[i]) {
            return false;
          }
        }
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!internalDeepEqual(a[key], b[key], opts, channel)) {
            return false;
          }
        }
        var aCollection = whichCollection(a);
        var bCollection = whichCollection(b);
        if (aCollection !== bCollection) {
          return false;
        }
        if (aCollection === "Set" || bCollection === "Set") {
          return setEquiv(a, b, opts, channel);
        }
        if (aCollection === "Map") {
          return mapEquiv(a, b, opts, channel);
        }
        return true;
      }
      __name(objEquiv, "objEquiv");
      module.exports = /* @__PURE__ */ __name(function deepEqual2(a, b, opts) {
        return internalDeepEqual(a, b, opts, getSideChannel());
      }, "deepEqual");
    }
  });

  // plug-ins/object-oriented-programming/index.js
  var Inheritance = class {
    static {
      __name(this, "Inheritance");
    }
    instance;
    root;
    constructor({ Class, instance, specification }) {
      this.instance = instance;
      this.instance.oo.extends.push(Class);
      this.collectClasses(Class.extends);
      this.instantiateSuperclasses();
    }
    collectClasses(list) {
      if (!Array.isArray(list))
        return;
      for (const Class of list) {
        this.instance.oo.extends.push(Class);
        this.collectClasses(Class.extends);
      }
    }
    instantiateSuperclasses() {
      let parent;
      for (const Class of this.instance.oo.extends) {
        const instance = new Class();
        this.instance.oo.specifications.push(instance);
        instance.parent = parent;
        parent = instance;
      }
    }
  };
  var Instance = class {
    static {
      __name(this, "Instance");
    }
    /*
      do not put anything in the properties section,
      Instance is the class that is returned to the user.
    */
    constructor(Class, data) {
      const specification = new Class();
      this.oo = {};
      this.oo.name = specification.constructor.name;
      this.oo.class = Class;
      this.oo.specification = specification;
      this.oo.newObservables = [];
      this.oo.extends = [];
      this.oo.disposables = [];
      this.oo.specifications = [];
      new Inheritance({ Class, instance: this, specification, root: this });
      const defaultState = {
        current: "initial",
        initial: {
          run: "initialize",
          can: "start"
        },
        start: {
          run: "mount",
          can: "stop"
        },
        stop: {
          run: "destroy",
          can: "start"
        }
      };
      const ensureArray = /* @__PURE__ */ __name(function(input) {
        if (Array.isArray(input))
          return input;
        return [input];
      }, "ensureArray");
      const isStateTransitionAllowed = /* @__PURE__ */ __name(function({ from, to, state: state2 }) {
        return ensureArray(state2[from].can).includes(to);
      }, "isStateTransitionAllowed");
      for (const inherited of this.oo.specifications) {
        if (inherited.properties) {
          for (const [propertyName, propertyValue] of Object.entries(inherited.properties)) {
            if (propertyName in this === false) {
              Object.defineProperty(this, propertyName, {
                value: propertyValue,
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.traits) {
          for (const [traitName, traitFunction] of Object.entries(inherited.traits)) {
            if (traitName in this === false) {
              Object.defineProperty(this, traitName, {
                value: traitFunction.bind(this),
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      const composite = this;
      const methods = [];
      for (const inherited of this.oo.specifications) {
        if (inherited.methods) {
          for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
            methods.push(methodName);
          }
        }
      }
      function executeAll(name2, arg, list) {
        let response = null;
        const reversed = Array.from(list).reverse();
        for (const inherited of reversed) {
          if (inherited.methods && inherited.methods[name2]) {
            response = inherited.methods[name2].bind(composite)(...arg);
          }
        }
        return response;
      }
      __name(executeAll, "executeAll");
      for (const methodName of methods) {
        Object.defineProperty(this, methodName, {
          value: function(...arg) {
            return executeAll(methodName, arg, this.oo.specifications);
          },
          writable: true,
          enumerable: true,
          configurable: false
        });
      }
      const observableData = {};
      this.oo.createObservable = (observableName, observableValue = void 0, internal = false) => {
        if (!internal) {
          this.oo.newObservables.push(observableName);
        }
        const isArray = Array.isArray(observableValue) ? true : false;
        if (observableName in this === false) {
          if (isArray) {
            observableData[observableName] = new List(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value) => {
                throw new Error(`observable array ${name} cannot be replaced`);
              },
              configurable: false
            });
          } else {
            observableData[observableName] = new Primitive(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value) => observableData[observableName].value = value,
              configurable: false
            });
          }
        }
      };
      for (const inherited of this.oo.specifications) {
        if (inherited.observables) {
          for (const [observableName, observableValue] of Object.entries(inherited.observables)) {
            this.oo.createObservable(observableName, observableValue, true);
          }
        }
      }
      const disposables = [];
      const disposable = /* @__PURE__ */ __name(function(...arg) {
        disposables.push(...arg);
      }, "disposable");
      Object.defineProperty(this, "disposable", {
        set: (value) => this.oo.disposables.push(value),
        configurable: false
      });
      this.dispose = () => {
        disposables.map((f) => f());
        this.oo.disposables.map((f) => f());
      };
      this.on = function(eventPath, observerCallback, options, control) {
        const [name2, path] = eventPath.split(".", 2);
        if (!observableData[name2])
          throw new Error(`property "${name2}" not defined (${Object.keys(observableData).join(", ")})`);
        if (control?.manualDispose) {
          return observableData[name2].observe(path || name2, observerCallback, options);
        } else {
          disposable(observableData[name2].observe(path || name2, observerCallback, options));
        }
      };
      this.any = function(observables, ...functions) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          functions.map((\u0192) => \u0192(packet));
        }, "callback2");
        return observables.map((event) => this.on(event, callback2, void 0, { manualDispose: true }));
      };
      this.all = function(observables, ...functions) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          const isReady = Object.values(packet).every((value) => value !== void 0);
          if (isReady)
            functions.map((\u0192) => \u0192(packet));
          ;
        }, "callback2");
        return observables.map((event) => this.on(event, callback2, void 0, { manualDispose: true }));
      };
      const stateConstraints = {};
      const stateConstraint = /* @__PURE__ */ __name(function(constraints, constraintName) {
        if (constraints[constraintName]) {
          constraints[constraintName].forEach(({ test, message }) => {
            const verdict = test();
            if (verdict?.error) {
              throw new Error(`\u{1F354} state constraint error: ${message} - ${verdict.error} (attempted to execute ${constraintName})`);
            }
          });
        }
      }, "stateConstraint");
      const state = specification.state || defaultState;
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        if (stateName2 in this === false) {
          const stateFunction = function() {
            const currentState = state.current;
            const from = currentState;
            const to = stateName2;
            const transitionAllowed = isStateTransitionAllowed({
              from,
              to,
              state
            });
            if (!transitionAllowed) {
              throw new Error(`Cannot transition state from ${from} (current) to ${to}, only ${ensureArray(state[currentState].can).join(", ")} allowed.`);
            }
            if (transitionAllowed) {
            }
            const stateFunctions2 = ensureArray(state[stateName2].run);
            for (const functionName of stateFunctions2) {
              if (functionName in this === false)
                throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
              stateConstraint(stateConstraints, functionName);
              this[functionName]();
            }
            state.current = stateName2;
          }.bind(this);
          Object.defineProperty(this, stateName2, {
            value: stateFunction,
            writable: true,
            enumerable: true,
            configurable: false
          });
        }
      }
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        for (const keyName of ensureArray(stateValue.run)) {
          if (specification.constraints && specification.constraints[keyName]) {
            for (const [constraintName, constraintValue] of Object.entries(specification.constraints[keyName])) {
              if (!stateConstraints[keyName])
                stateConstraints[keyName] = [];
              stateConstraints[keyName].push({ message: constraintName, test: constraintValue.bind(this) });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.constraints && inherited.observables) {
          for (const [constraintName, constraintValue] of Object.entries(inherited.constraints).filter(([constraintName2, constraintValue2]) => inherited.observables[constraintName2])) {
            if (constraintName in observableData === false)
              throw new Error(`Unable to observable constrain "${constraintName}" becasue it is not defined in ${specification.constructor.name}`);
            for (const [message, test] of Object.entries(constraintValue)) {
              observableData[constraintName].constraints.push({ message, test: test.bind(this) });
              observableData[constraintName].constrain(observableData[constraintName].value, true);
            }
          }
        }
      }
      if (data) {
        for (const [name2, value] of Object.entries(data)) {
          this[name2] = value;
        }
      }
      const stateName = state.current;
      const stateFunctions = ensureArray(state[stateName].run);
      for (const functionName of stateFunctions) {
        if (functionName in this === false)
          throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
        stateConstraint(stateConstraints, functionName);
        this[functionName]();
      }
    }
  };
  var Primitive = class {
    static {
      __name(this, "Primitive");
    }
    name = null;
    #value = null;
    constraints = [];
    constructor(name2, value) {
      this.name = name2;
      this.#value = value;
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      this.constraints.forEach(({ test, message }) => {
        const verdict = test(data, this.#value);
        if (verdict?.error) {
          throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data})`);
        }
      });
    }
    // Getter And Setter
    get value() {
      return this.#value;
    }
    set value(data) {
      if (this.#value == data)
        return;
      this.constrain(data);
      const previousValue = this.#value;
      if (data !== void 0)
        this.notify(`${this.name}.before`, this.#value, previousValue);
      this.#value = data;
      if (data !== void 0)
        this.notify(this.name, this.#value, previousValue);
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      this.#observers[eventName].push(observerCallback);
      if (options.autorun && this.#value !== void 0)
        observerCallback(this.#value);
      return () => {
        console.log(`UNOBSERVING ${eventName}`);
        this.unobserve(eventName, observerCallback);
      };
    }
    unobserve(eventName, observerCallback) {
      this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
    }
    notify(eventName, eventData, ...extra) {
      if (Array.isArray(this.#observers[eventName])) {
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
      } else {
      }
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
  };
  var List = class {
    static {
      __name(this, "List");
    }
    name = null;
    #value = [];
    constraints = [];
    constructor(name2, value) {
      this.name = name2;
      this.#value.push(...value);
      this.constrain();
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      for (const data2 of this.#value) {
        this.constraints.forEach(({ test, message }) => {
          const verdict = test(data2, this.#value);
          if (verdict?.error) {
            throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data2})`);
          }
        });
      }
    }
    get value() {
      return this;
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true, replay: false }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      if (options.autorun) {
        if (eventName == this.name) {
          for (const item of this.#value) {
            observerCallback(item);
          }
        }
      }
      if (options.replay) {
        for (const item of this.#value) {
          observerCallback(item);
        }
      }
      this.#observers[eventName].push(observerCallback);
      return () => {
        this.unobserve(eventName, observerCallback);
      };
    }
    unobserve(eventName, observerCallback) {
      this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
    }
    notify(eventName, eventData, ...extra) {
      if (Array.isArray(this.#observers[eventName]))
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
    // Data Editing Functions
    create(...items) {
      for (const item of items) {
        this.constrain(item);
        this.#value.push(item);
        this.notify("created", item);
        this.notify("changed", this);
      }
    }
    remove(input) {
      let id;
      if (typeof input === "string") {
        id = input;
      } else {
        if (!input.id)
          throw new Error("Only stingId and onbect with an id property is supported");
        id = input.id;
      }
      const item = this.#value.find((o) => o.id === id);
      this.#value = this.#value.filter((o) => o !== item);
      this.notify("removed", item);
      this.notify("changed", this);
    }
    // Data Reading Functions
    [Symbol.iterator]() {
      return this.#value[Symbol.iterator]();
    }
    find(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.find(callback);
    }
    get(id) {
      return this.#value.find((o) => o.id === id);
    }
    map(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.map(callback);
    }
    reduce(callback, initialValue) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.reduce(callback, initialValue);
    }
    filter(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.filter(callback);
    }
    forEach(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.forEach(callback);
    }
    indexOf(item) {
      return this.#value.indexOf(item);
    }
    slice(...argv) {
      return this.#value.slice(...argv);
    }
    get length() {
      return this.#value.length;
    }
    get raw() {
      return this.#value;
    }
  };

  // abstract/Theme.js
  var Theme = class {
    static {
      __name(this, "Theme");
    }
    id = "theme-name";
  };

  // src/Themes.js
  var Themes = class {
    static {
      __name(this, "Themes");
    }
    observables = {
      theme: "obsidian",
      themes: [new themes.Nostromo({ subtle: true }), new themes.Obsidian({ subtle: true })]
    };
    constraints = {
      theme: {
        "all themes are lower-case": function(theme) {
          if (theme.match(/[A-Z]/)) {
            return { error: "theme name contains uppercase letters" };
          }
        },
        "specified theme does not exist": function(theme) {
          if (!this.themes.map((o) => o.id).includes(theme))
            return { error: "theme does not exist" };
        }
      },
      themes: {
        "theme is not a prototype of #abstract/Theme": function(v) {
          if (!Theme.prototype.isPrototypeOf(v))
            return { error: "must extend Theme" };
        }
      }
    };
    methods = {
      initialize() {
        this.on("theme.before", (id) => {
        });
        this.on("theme", (id, old) => {
          document.querySelector("html").dataset.uiTheme = id;
        });
        this.on("themes.created", (list) => {
          p;
        });
        this.on("themes.removed", (list) => {
        });
        this.on("themes.changed", (list) => {
        });
      }
    };
  };

  // plug-ins/debounce/index.js
  function debounce_default(func, wait) {
    let timeout;
    return /* @__PURE__ */ __name(function executedFunction(...args) {
      const later = /* @__PURE__ */ __name(() => {
        clearTimeout(timeout);
        func(...args);
      }, "later");
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }, "executedFunction");
  }
  __name(debounce_default, "default");

  // plug-ins/boolean/index.js
  function intersection(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(intersection, "intersection");
  function difference(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (!b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(difference, "difference");

  // plug-ins/node/Node.js
  var Node = class {
    static {
      __name(this, "Node");
    }
    state = {
      current: "initial",
      initial: {
        run: "initialize"
      }
    };
    constraints = {
      initialize: {
        "node origin is requred": function() {
          if (this.origin === void 0) {
            return { error: "node is missing origin" };
          }
          if (!(typeof this.origin !== "string" || typeof this.origin !== "number")) {
            return { error: "node origin must be a string" };
          }
        }
      }
    };
    properties = {
      id: null,
      type: null
    };
    observables = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      r: 0,
      b: 0,
      p: 0,
      s: 0,
      selected: false,
      source: void 0,
      target: void 0,
      url: void 0,
      // JSON url
      src: void 0,
      // JSON url
      data: void 0
      // JSON data
    };
    methods = {
      assign(meta, data) {
        const nodeKeys = /* @__PURE__ */ new Set([...Object.keys(this.oo.specification.properties), ...Object.keys(this.oo.specification.observables)]);
        const metaKeys = /* @__PURE__ */ new Set([...Object.keys(meta)]);
        const commonProperties = intersection(nodeKeys, metaKeys);
        const newProperties = difference(metaKeys, commonProperties);
        for (const newProperty of newProperties) {
          this.oo.createObservable(newProperty, meta[newProperty]);
        }
        Object.assign(this, meta, { data });
      },
      toObject() {
        const meta = {};
        const data = this.data;
        const object = { meta, data };
        for (const [name2, value] of Object.entries(this.oo.specification.properties)) {
          console.log(this[name2], name2, value);
          if (this[name2] !== value)
            meta[name2] = this[name2];
        }
        for (const [name2, value] of Object.entries(this.oo.specification.observables).filter(([name3]) => !["data"].includes(name3))) {
          if (this[name2] !== value)
            meta[name2] = this[name2];
        }
        for (const name2 of this.oo.newObservables) {
          meta[name2] = this[name2];
        }
        return object;
      },
      initialize() {
      },
      stop() {
      },
      destroy() {
        this.dispose();
      }
    };
  };

  // plug-ins/layout-manager/index.js
  var BOTH_SIDES = 2;
  var Layout = class {
    static {
      __name(this, "Layout");
    }
    parent;
    source;
    constructor(parent, { source } = { source: "children" }) {
      this.parent = parent;
      this.source = source;
    }
    manage(child) {
    }
    calculateChildW() {
      return 320 * Math.random();
    }
    calculateH() {
      return 200 * Math.random();
    }
    calculateChildX(parent, child) {
      return 800 * Math.random();
    }
    calculateChildY(parent, child) {
      return 600 * Math.random();
    }
    above(parent, child) {
      return parent[this.source].slice(0, parent[this.source].indexOf(child));
    }
    #cleanup = [];
    cleanup(...arg) {
      this.#cleanup.push(...arg);
    }
  };
  var VerticalLayout = class extends Layout {
    static {
      __name(this, "VerticalLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.w = this.calculateChildW(child));
      child.on("h", () => this.parent.h = this.calculateH());
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildW(child) {
      const response = this.parent.w - (this.parent.b + this.parent.p) * BOTH_SIDES;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((total, c) => total + c.h, 0) + this.parent.s * 2 * (children.length > 0 ? children.length - 1 : 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
    calculateChildX() {
      const response = this.parent.x + // use my own x
      this.parent.b + // add border
      this.parent.p;
      return response;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
  };
  var HorizontalLayout = class extends Layout {
    static {
      __name(this, "HorizontalLayout");
    }
    manage(child) {
      const children = this.parent[this.source];
      const childCount = children.length;
      const siblingCount = this.above(this.parent, child).length;
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
      this.parent.on("children.changed", (list) => list.forEach((child2) => {
        child2.w = this.calculateChildW(child2);
        child2.x = this.calculateChildX(child2);
      }));
      this.parent.on("w", () => {
        child.w = this.calculateChildW(child);
        child.x = this.calculateChildX(child);
      });
      child.on("h", () => this.parent.h = this.calculateH());
    }
    calculateChildX(child) {
      const response = this.parent.x + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.w, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateChildW1(child) {
      const children = this.parent[this.source];
      const childCount = children.length;
      const siblingCount = this.above(this.parent, child).length;
      let response = this.parent.w / childCount;
      return response;
    }
    calculateChildW(child) {
      if (!(child.W === void 0))
        return child.W < 1 ? this.parent.w * child.W : child.W;
      const children = this.parent[this.source];
      let softElements = children.filter((child2) => child2.W === void 0);
      let hardElements = children.filter((child2) => !(child2.W === void 0));
      let hardSpace = hardElements.reduce((total, child2) => total + (child2.W < 1 ? this.parent.w * child2.W : child2.W), 0);
      let availableSoftSpace = this.parent.w - hardSpace;
      let softUnit = availableSoftSpace / (softElements.length || 1);
      return softUnit;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((max, c) => c.h > max ? c.h : max, 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
  };
  var RelativeLayout = class extends Layout {
    static {
      __name(this, "RelativeLayout");
    }
    children = /* @__PURE__ */ new WeakMap();
    manage(child) {
      if (!child.node)
        throw new Error("RelativeLayout requires that all children have a valid .node attached.");
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      child.node.on("x", () => child.x = this.calculateChildX(child));
      child.node.on("y", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      return this.parent.x + child.node.x;
    }
    calculateChildY(child) {
      return this.parent.y + child.node.y;
    }
  };
  var AnchorLayout = class extends Layout {
    static {
      __name(this, "AnchorLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.x = this.calculateChildX(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      if (!child.side) {
        return this.parent.x - child.r - child.s;
      } else {
        return this.parent.x + this.parent.w + child.r + child.s;
      }
      this.parent.b + this.parent.p;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + child.r + this.above(this.parent, child).filter((o) => o.side == child.side).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateChildW(child) {
    }
  };

  // plug-ins/domek/index.js
  var update = /* @__PURE__ */ __name(function(elements, properties) {
    const els = Array.isArray(elements) ? elements : [elements];
    for (const el of els) {
      for (const key in properties) {
        let value = properties[key];
        if (key == "style" && typeof value == "object") {
          for (const name2 in value) {
            el.style[name2] = value[name2];
          }
          continue;
        } else if (typeof value == "object") {
          value = Object.entries(value).map(([k, v]) => `${k}: ${v};`).join(" ");
        }
        if (el.namespaceURI == "http://www.w3.org/2000/svg") {
          el.setAttributeNS(null, key, value);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  }, "update");
  var svg = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var xhtml = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var html = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElement(property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var text = /* @__PURE__ */ __name(function(text2) {
    return document.createTextNode(text2);
  }, "text");
  function front(element) {
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
    parentElement.appendChild(element);
  }
  __name(front, "front");
  function click(element, callback) {
    element.addEventListener("mouseup", handler);
    function handler(event) {
      callback(event);
    }
    __name(handler, "handler");
    return () => element.removeEventListener("mouseup", handler);
  }
  __name(click, "click");

  // plug-ins/windows/Component.js
  var Component = class {
    static {
      __name(this, "Component");
    }
    properties = {
      id: uuid(),
      el: {}
      // bag of elements
    };
    observables = {
      parent: void 0,
      // it may be needed to access parent from a control
      scene: void 0,
      // remember parent sets the scene, this child must adds its own .g to it, then its own g becomes the scene for children
      node: void 0,
      // data node
      // node has data, we keep it here at the root of component
      data: void 0,
      // the data that is in the node
      selected: false,
      // selection manager feature
      name: "un-named",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      // min h
      r: 0,
      // border radius
      b: 0,
      // border
      p: 0,
      // padding
      s: 0
      // spacer/gap
    };
    constraints = {
      scene: {
        ".scene must be an instance of HTMLElement": function() {
          if (!(obj instanceof HTMLElement))
            return { error: "Not an HTMLElement" };
        }
      },
      mount: {
        ".scene is required to start": function() {
          if (!this.data) {
            return { error: "data missing" };
          }
        },
        ".node is required to start": function() {
          if (!this.node) {
            return { error: "node missing" };
          }
        },
        ".node must be an observable object": function() {
          if (!this.node.on) {
            return { error: ".on missing on .node" };
          }
        }
      }
    };
    traits = {
      //
      // appendMain(){
      //   Object.values(this.el).forEach(el => this.scene.appendChild(el));
      // },
      allAnchors(parent, list = []) {
        if (parent?.children) {
          for (const child of parent.children) {
            if (child.anchors?.length) {
              for (const anchor of child.anchors) {
                list.push(anchor);
              }
            }
            this.allAnchors(child, list);
          }
        }
        return list;
      },
      appendElements() {
        Object.values(this.el).forEach((el) => this.scene.appendChild(el));
      },
      removeElements() {
        Object.values(this.el).forEach((el) => el.remove());
      },
      getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
      },
      pipe(name2) {
        const id = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        const pipe = origin.root.pipes.get(id);
        return pipe;
      },
      getRootContainer() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else if (!this.parent.getRootContainer) {
          response = this;
        } else if (this.contain) {
          response = this;
        } else {
          response = this.parent.getRootContainer();
        }
        return response;
      },
      getAbsoluteRoot() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else {
          response = this.parent.getAbsoluteRoot();
        }
        return response;
      },
      //
      // getTransforms(list=[]) {
      //   console.log(this.oo.name);
      //
      //   if(this.parent?.getTransforms){
      //     this.parent.getTransforms(list);
      //   } else if(this.parent){
      //     list.unshift(this.parent);
      //   }
      //
      //   list.push(this);
      //   return list;
      // }
      getTransforms(element, list = []) {
        if (!element)
          element = this;
        const isTransform = element.hasOwnProperty("panX") && element.hasOwnProperty("panY") && element.hasOwnProperty("zoom");
        if (isTransform) {
          const { oo: { name: name2 }, panX: x, panY: y, zoom: z } = element;
          list.unshift({ name: name2, x, y, z, element });
        }
        if (element.parent)
          this.getTransforms(element.parent, list);
        return list;
      }
    };
    methods = {
      initialize() {
        this.on("node", (node) => {
          node.on("x", (x) => this.x = x);
          node.on("y", (y) => this.y = y);
          node.on("w", (w) => this.w = w);
          node.on("h", (h) => this.h = h);
          node.on("H", (H) => this.H = H);
          node.on("r", (r) => this.r = r);
          node.on("b", (b) => this.b = b);
          node.on("p", (p2) => this.p = p2);
          node.on("s", (s) => this.s = s);
          node.on("data", (data) => this.data = data);
        });
      }
    };
  };

  // plug-ins/windows/Container.js
  var Container = class {
    static {
      __name(this, "Container");
    }
    static extends = [Component];
    properties = {
      layout: null
    };
    observables = {
      children: []
    };
    traits = {
      draw() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-container",
          ry: this.r,
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.appendElements();
      }
    };
    methods = {
      initialize() {
        this.on("children.created", (child) => {
          child.scene = this.scene;
          child.start();
          this.layout.manage(child);
        }, { replay: true });
        this.on("children.removed", (child) => {
          child.stop();
          this.layout.forget(child);
        });
      },
      mount() {
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Vertical.js
  var Vertical = class {
    static {
      __name(this, "Vertical");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new VerticalLayout(this);
      }
    };
  };

  // plug-ins/select/index.js
  var Select = class {
    static {
      __name(this, "Select");
    }
    component;
    handle;
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        const multiSelect = e.ctrlKey;
        this.component.selected = !this.component.selected;
        if (multiSelect) {
        } else {
          if (this.component.selected) {
            for (const item of globalThis.project.applications) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
            for (const item of globalThis.project.anchors) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
          }
        }
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/connect/index.js
  var uuid2 = bundle["uuid"];
  var Connect = class {
    static {
      __name(this, "Connect");
    }
    parent;
    anchor;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    startX = 0;
    startY = 0;
    dragging = false;
    constructor({ parent, anchor, zone }) {
      if (!parent)
        throw new Error("parent is required");
      if (!anchor)
        throw new Error("anchor is required");
      if (!zone)
        throw new Error("zone is required");
      this.parent = parent;
      this.anchor = anchor;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.line = svg.line({
          class: "editor-anchor-line",
          style: {
            "pointer-events": "none"
            /* required, otherwise the line will mousedrop on it self */
          },
          "vector-effect": "non-scaling-stroke"
        });
        this.anchor.scene.appendChild(this.line);
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        let dx = 0;
        let dy = 0;
        dx = e.clientX - this.startX;
        dy = e.clientY - this.startY;
        dx = dx + this.anchor.x * globalThis.project.zoom;
        dy = dy + this.anchor.y * globalThis.project.zoom;
        dx = dx / globalThis.project.zoom;
        dy = dy / globalThis.project.zoom;
        this.geometry = {
          // origin of th eindicator line is the port
          x1: this.anchor.x,
          y1: this.anchor.y,
          // target of the indicator line is where the cursor is dragging
          x2: dx,
          y2: dy
        };
        update(this.line, this.geometry);
        dx = 0;
        dy = 0;
      };
      this.mouseUpHandler = (e) => {
        if (e.target == this.anchor) {
          console.log("SELF");
        }
        const isOverAnotherPort = this.dragging && e?.target?.classList?.contains("editor-anchor");
        const isOverBackground = this.dragging && e?.target?.classList?.contains("editor-background");
        const origin = this.anchor.getRootContainer().node.origin;
        if (isOverAnotherPort) {
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = e.target.dataset.target;
          if (source != target) {
            globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
          }
        }
        if (isOverBackground) {
          const junctionId = uuid2();
          globalThis.project.createNode({ meta: { id: junctionId, type: "Junction", x: this.geometry.x2, y: this.geometry.y2, origin }, data: {} });
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = ["input", junctionId].join(":");
          globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
        }
        if (this.line)
          this.line.remove();
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.anchor.pad.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.anchor.pad.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/windows/Anchor.js
  var Anchor = class {
    static {
      __name(this, "Anchor");
    }
    static extends = [Component];
    properties = {
      pad: null
    };
    observables = {
      side: 0,
      color: "transparent"
    };
    constraints = {
      mount: {
        ".scene is required": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.r = 8;
        this.s = 4;
        this.w = this.r * 2;
        this.h = this.r * 2 + this.s;
        this.x = 0;
        this.y = 0;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-anchor",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.el.Primary.dataset.target = [this.name, this.getRootContainer().id].join(":");
        this.pad = this.el.Primary;
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
        this.on("r", (r) => update(this.el.Primary, { r }));
        this.appendElements();
        const connect = new Connect({
          anchor: this,
          zone: window,
          parent: this
        });
        this.destructable = () => connect.destroy();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/pipe/Pipe.js
  var EventEmitter = bundle["events"];
  var Pipe = class extends EventEmitter {
    static {
      __name(this, "Pipe");
    }
    id;
    direction;
    constructor(id, direction) {
      super();
      this.id = id;
      this.direction = direction;
    }
    input(data) {
      console.log("pipe got input", data);
    }
  };

  // plug-ins/windows/Control.js
  var Control = class {
    static {
      __name(this, "Control");
    }
    static extends = [Component];
    properties = {
      anchorage: null
    };
    observables = {
      anchors: []
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.anchorage = new AnchorLayout(this, { source: "anchors" });
        this.on("anchors.created", (anchor) => {
          anchor.start();
          this.createPipe(anchor.name, anchor.side);
          this.anchorage.manage(anchor);
        }, { replay: true });
        this.on("anchors.removed", (anchor) => {
          anchor.stop();
          this.removePipe(anchor.name);
          this.removeControlAnchor(anchor.id);
          this.anchorage.forget(anchor);
        });
        this.appendElements();
      },
      createPipe(name2, direction) {
        const id = [name2, this.getRootContainer().id].join(":");
        const pipe = new Pipe(id, direction);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.create(pipe);
      },
      removePipe(name2) {
        const id = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.get(id).stop();
        origin.root.pipes.remove(id);
      },
      createControlAnchor({ name: name2, side }) {
        return;
        if (!name2)
          throw new Error(`It is not possible to create an anchor without an anchor name.`);
        if (!side === void 0)
          throw new Error(`It is not possible to create an anchor without specifying a side, 0 or 1.`);
        const id = [name2, this.getRootContainer().id].join(":");
        const anchor = new Instance(Anchor, { id, name: name2, side, parent: this, scene: this.scene });
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.create(anchor);
        this.anchors.create(anchor);
      },
      removeControlAnchor(id) {
        this.anchors.remove(id);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.remove(id);
      },
      destroy() {
        console.warn("TODO: DESTROY ALL ANCHORS");
        console.warn("TODO: STOP ANCHORAGE");
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Horizontal.js
  var Horizontal = class {
    static {
      __name(this, "Horizontal");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new HorizontalLayout(this);
      }
    };
  };

  // plug-ins/windows/Label.js
  var Label = class {
    static {
      __name(this, "Label");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.s = 3;
      },
      mount() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-label",
          "vector-effect": "non-scaling-stroke",
          ry: this.r,
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.handle = this.el.Container;
        this.el.ClipPath = svg.clipPath({
          id: `clip-path-${this.id}`
        });
        const clipPathRect = svg.rect({
          x: this.x,
          y: this.y,
          width: this.w,
          height: this.h
        });
        this.el.ClipPath.appendChild(clipPathRect);
        this.el.Caption = svg.text({
          name: this.name,
          class: "editor-label-text",
          "dominant-baseline": "hanging",
          "clip-path": `url(#clip-path-${this.id})`,
          x: this.x,
          y: this.y
        });
        const updateZUI = /* @__PURE__ */ __name(function(el, zuiAttributes, standardAttributes) {
          if (globalThis.project.zoom > 1) {
            update(el, zuiAttributes);
          } else {
            update(el, standardAttributes);
          }
        }, "updateZUI");
        console.warn("Label is not monitoring global zoom becasue it is not yet programmed to use the transforms");
        if (0) {
          globalThis.project.on("zoom", (v) => requestAnimationFrame(() => {
            updateZUI(this.el.Caption, { style: { scale: 1 / globalThis.project.zoom }, x: (this.x + this.s) * globalThis.project.zoom, y: (this.y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: this.x + this.s, y: this.y + this.s });
            updateZUI(clipPathRect, { x: this.x * globalThis.project.zoom, y: this.y * globalThis.project.zoom, width: this.w * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x: this.x, y: this.y, width: this.w, height: this.h });
          }));
        }
        const captionText = text(this.text);
        this.el.Caption.appendChild(captionText);
        this.on("selected", (selected) => selected ? this.el.Container.classList.add("selected") : this.el.Container.classList.remove("selected"));
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.on("text", (text2) => captionText.nodeValue = text2);
        this.any(["x", "y"], ({ x, y }) => updateZUI(this.el.Caption, { x: (x + this.s) * globalThis.project.zoom, y: (y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: x + this.s, y: y + this.s }));
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => updateZUI(clipPathRect, { x: x * globalThis.project.zoom, y: y * globalThis.project.zoom, width: width * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x, y, width, height }));
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/nest/index.js
  var typeOf = /* @__PURE__ */ __name(function(variable) {
    if (Array.isArray(variable))
      return "Array";
    if (typeof variable === "function")
      return "Function";
    if (Object(variable) === variable)
      return "Object";
  }, "typeOf");
  var byType = /* @__PURE__ */ __name(function(input) {
    const response = {};
    for (const variable of input) {
      response[typeOf(variable)] = variable;
    }
    return response;
  }, "byType");
  function nest(Type, ...input) {
    if (!Type)
      return;
    const { Object: attr, Array: children, Function: init } = byType(input);
    const instance = new Instance(Type, attr);
    if (init)
      init(instance, this ? this.parent : null);
    return [instance, children?.map((child) => nest.bind({ parent: instance })(...child)).map(([ins, chi]) => chi ? [ins, chi] : ins)];
  }
  __name(nest, "nest");

  // plug-ins/windows/Caption.js
  var Caption = class {
    static {
      __name(this, "Caption");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.createControlAnchor({ name: "input", side: 0 });
        this.createControlAnchor({ name: "output", side: 1 });
        const [horizontal, [info1, info2]] = nest(Horizontal, { parent: this, scene: this.scene }, [
          [Label, { h: 24, text: this.text, parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 24, text: "^", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => {
          this.destructable = () => {
            c.stop();
            c.destroy();
          };
        });
        this.handle = info1.el.Container;
        horizontal.start();
        this.on("selected", (selected) => selected ? info1.el.Container.classList.add("selected") : info1.el.Container.classList.remove("selected"));
        this.on("text", (text2) => info1.text = text2);
        this.any(["x", "y", "w", "h"], ({ x, y, w, h }) => Object.assign(horizontal, { x, y, w, h }));
        let maximizer;
        let maximized = false;
        let restoreWindow = {};
        let restoreZoomPan = {};
        this.disposable = click(info2.handle, (e) => {
          console.log("maximized", maximized);
          if (maximized) {
            console.log("MINIMIZE", maximizer);
            maximizer.map((a) => a());
            maximized = false;
            Object.assign(this.getRootContainer(), restoreWindow);
            Object.assign(globalThis.project, restoreZoomPan);
          } else {
            console.log("MAXIMIZE!");
            restoreWindow = {
              x: this.getRootContainer().x,
              y: this.getRootContainer().y,
              w: this.getRootContainer().w,
              h: this.getRootContainer().h
            };
            restoreZoomPan = {
              panX: globalThis.project.panX,
              panY: globalThis.project.panY,
              zoom: globalThis.project.zoom
            };
            const handler = /* @__PURE__ */ __name(() => {
              this.getRootContainer().x = 0 - globalThis.project.panX / globalThis.project.zoom;
              this.getRootContainer().y = 0 - globalThis.project.panY / globalThis.project.zoom;
              this.getRootContainer().w = globalThis.project.w / globalThis.project.zoom;
              this.getRootContainer().h = globalThis.project.h / globalThis.project.zoom;
            }, "handler");
            maximizer = globalThis.project.any(["zoom", "panX", "panY", "w", "h"], handler);
            handler();
            console.log("maximizer", maximizer);
            maximized = true;
          }
          console.log({
            x: this.getRootContainer().x,
            y: this.getRootContainer().y,
            w: this.getRootContainer().w,
            h: this.getRootContainer().h
          });
        });
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/move/index.js
  var Move = class {
    static {
      __name(this, "Move");
    }
    component;
    window;
    handle;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    previousX = 0;
    previousY = 0;
    dragging = false;
    constructor({ component, window: window2, handle, zone }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      if (!window2)
        throw new Error("window is required");
      if (!zone)
        throw new Error("zone is required");
      this.component = component;
      this.handle = handle;
      this.window = window2;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.previousX = e.screenX;
        this.previousY = e.screenY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        const movementX = this.previousX - e.screenX;
        const movementY = this.previousY - e.screenY;
        this.component.node.x = this.component.node.x - movementX / globalThis.project.zoom;
        this.component.node.y = this.component.node.y - movementY / globalThis.project.zoom;
        this.previousX = e.screenX;
        this.previousY = e.screenY;
      };
      this.mouseUpHandler = (e) => {
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/focus/index.js
  var Focus = class {
    static {
      __name(this, "Focus");
    }
    component;
    handle;
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        front(this.component.scene);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/windows/Window.js
  var Window = class {
    static {
      __name(this, "Window");
    }
    static extends = [Vertical];
    observables = {
      caption: "Untitled"
    };
    properties = {
      streams: /* @__PURE__ */ new Map(),
      contain: true,
      isRootWindow: false
    };
    methods = {
      initialize() {
        if (!this.oo)
          throw new Error("Window oo Not Found");
      },
      mount() {
        this.draw();
        if (this.isRootWindow)
          return;
        let caption = new Instance(Caption, { h: 24, text: this.caption });
        this.on("caption", (v) => caption.text = v);
        this.createWindowComponent(caption);
        this.on("node", (node) => {
          node.on("caption", (caption2) => this.caption = caption2);
        });
        const move = new Move({
          component: this,
          handle: caption.handle,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: caption.handle
        });
        this.destructable = () => focus2.destroy();
        this.on("selected", (selected) => caption.selected = selected);
      },
      createWindowComponent(component) {
        component.parent = this;
        this.children.create(component);
      }
    };
    constraints = {
      // NOTE: TODO ITEM BELOW
      // TODO: add method constraints this will requre gathering all constraints from each chain item
      // createWindowComponent: {
      //   'object must be based on Component': function(v){
      //     console.log('YYY', v);
      //     // if(! Theme.prototype.isPrototypeOf(v) ) return {error:'must extend Theme'};
      //   }
      // }
    };
  };

  // plug-ins/windows/Pane.js
  var import_deep_equal = __toESM(require_deep_equal());

  // plug-ins/diagnostic/index.js
  var DiagnosticRectangle = class {
    static {
      __name(this, "DiagnosticRectangle");
    }
    space = 8;
    name;
    parent;
    constructor(name2, parent, stroke) {
      this.name = name2;
      this.parent = parent;
      this.rectangle1 = svg.rect({ style: { "pointer-events": "none" }, fill: "none", stroke });
      this.parent.appendChild(this.rectangle1);
      this.textContainer = svg.text({ style: { "pointer-events": "none" }, "dominant-baseline": "hanging", fill: stroke });
      this.parent.appendChild(this.textContainer);
      this.text = text();
      this.textContainer.appendChild(this.text);
    }
    draw({ x, y, width, height }) {
      update(this.rectangle1, { x, y, width, height });
      update(this.textContainer, { x, y });
      this.text.nodeValue = `${this.name}`;
    }
  };
  var DiagnosticPoint = class {
    static {
      __name(this, "DiagnosticPoint");
    }
    space = 8;
    name;
    parent;
    angle;
    length;
    constructor(name2, parent, angle = 0, length = 10, stroke = "blue") {
      this.name = name2;
      this.parent = parent;
      this.angle = angle;
      this.length = length;
      this.centerCircle = svg.circle({ style: { "pointer-events": "none" }, stroke, fill: stroke, r: 5 });
      this.parent.appendChild(this.centerCircle);
      this.indicatorLine = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.indicatorLine);
      this.textLine = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.textLine);
      this.textContainer = svg.text({ "dominant-baseline": "middle", fill: stroke });
      this.parent.appendChild(this.textContainer);
      this.text = text(name2);
      this.textContainer.appendChild(this.text);
    }
    draw({ x, y }) {
      this.text.nodeValue = `${x}x ${y}y ${this.name}`;
      const { x1, y1, x2, y2 } = rotate2({ x1: x, y1: y, x2: x + this.length, y2: y }, this.angle);
      console.log({ x1, y1, x2, y2 });
      update(this.centerCircle, { cx: x, cy: y });
      update(this.indicatorLine, { x1, y1, x2, y2 });
      update(this.textLine, { x1: x2, y1: y2, x2: x2 + this.length * 0.5, y2 });
      update(this.textContainer, { x: x2 + this.length * 0.5, y: y2 });
    }
  };
  function rotate2({ x1, y1, x2, y2 }, d) {
    let r = Math.PI * 2 / 360 * d;
    const newX = Math.cos(r) * (x2 - x1) - Math.sin(r) * (y2 - y1) + x1;
    const newY = Math.sin(r) * (x2 - x1) + Math.cos(r) * (y2 - y1) + y1;
    return { x1, y1, x2: newX, y2: newY };
  }
  __name(rotate2, "rotate2");

  // plug-ins/windows/Viewport.js
  var Viewport = class {
    static {
      __name(this, "Viewport");
    }
    static extends = [Container];
    properties = {
      debugBody: true,
      debugContent: true
    };
    observables = {
      panX: 0,
      panY: 0,
      zoom: 1
    };
    methods = {
      initialize() {
      },
      mount() {
        this.el.ClipPath = svg.clipPath({ id: `clip-path-${this.id}` });
        this.maskRectangle = svg.rect();
        this.el.ClipPath.appendChild(this.maskRectangle);
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => {
          update(this.maskRectangle, { x, y, width, height });
        });
        this.el.Mask = svg.g({ "clip-path": `url(#clip-path-${this.id})` });
        this.body = svg.g();
        this.el.Mask.appendChild(this.body);
        this.any(["x", "y"], ({ x, y }) => this.body.style.transform = `translate(${x}px, ${y}px)`);
        this.componentBackground = svg.g({ name: "component-background", style: {} });
        this.body.appendChild(this.componentBackground);
        if (this.debugBody) {
          const p1 = new DiagnosticPoint(`${this.oo.name} body 0x0`, this.body, 45, 64, "yellow");
          this.any(["x", "y"], ({ x, y }) => p1.draw({ x: 0, y: 0 }));
          const r1 = new DiagnosticRectangle(`${this.oo.name} body`, this.body, "red");
          this.any(["w", "h"], ({ w: width, h: height }) => r1.draw({ x: 0, y: 0, width, height }));
        }
        this.content = svg.g({ name: "elements", style: {} });
        this.body.appendChild(this.content);
        this.on("panX", (v) => requestAnimationFrame(() => {
          this.content.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("panY", (v) => requestAnimationFrame(() => {
          this.content.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("zoom", (v) => requestAnimationFrame(() => {
          this.content.style.scale = this.zoom;
        }));
        if (this.debugContent) {
          const p1 = new DiagnosticPoint(`${this.oo.name} content 0x0`, this.content, 24, 64, "yellow");
          this.any(["x", "y"], ({ x, y }) => p1.draw({ x: 0, y: 0 }));
          const r1 = new DiagnosticRectangle(`${this.oo.name} content`, this.content, "green");
          this.any(["w", "h"], ({ w: width, h: height }) => r1.draw({ x: 0, y: 0, width, height }));
        }
        console.warn(`this.elements needs a background to track actusl x and y of mouse wheel hits`);
        this.appendElements();
      }
    };
  };

  // plug-ins/windows/Junction.js
  var Junction = class {
    static {
      __name(this, "Junction");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {};
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.w = 0;
        this.h = 0;
        this.r = 12;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-junction",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          width: this.w,
          height: this.h,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const move = new Move({
          component: this,
          handle: this.el.Primary,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.appendElements();
        const inputAnchor = this.createControlAnchor({ name: "input", side: 0, r: 4 });
        const outputAnchor = this.createControlAnchor({ name: "output", side: 1, r: 4 });
        this.pipe("input").on("data", (data) => this.pipe("output").emit("data", data));
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/geometrique/midpoint.js
  function midpoint({ x1, y1, x2, y2 }) {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    return { cx, cy };
  }
  __name(midpoint, "midpoint");

  // plug-ins/geometrique/edgepoint.js
  function edgepoint(cx, cy, r, x1, y1, x2, y2) {
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const x = cx + r * Math.cos(angleRadians);
    const y = cy + r * Math.sin(angleRadians);
    return [x, y];
  }
  __name(edgepoint, "edgepoint");

  // plug-ins/windows/Line.js
  var Line = class {
    static {
      __name(this, "Line");
    }
    static extends = [Component];
    properties = {};
    observables = {
      source: null,
      target: null,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.el.Primary = svg.line({
          name: this.name,
          class: "editor-line",
          "vector-effect": "non-scaling-stroke"
        });
        this.el.Midpoint = svg.circle({
          name: this.name,
          class: "editor-line-midpoint",
          "vector-effect": "non-scaling-stroke",
          r: 4
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        this.on("selected", (selected) => selected ? this.el.Midpoint.classList.add("selected") : this.el.Midpoint.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => focus.destroy();
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("node", (node) => {
          node.on("source", (source) => this.source = source);
          node.on("target", (target) => this.target = target);
        });
        this.on("source", (id) => {
          if (!id)
            throw new Error(`Primary requires source id`);
          if (!id.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id);
          component.on("x", (x) => this.x1 = x);
          component.on("y", (y) => this.y1 = y);
        });
        this.on("target", (id) => {
          if (!id)
            throw new Error(`Primary requires target id`);
          if (!id.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id);
          component.on("x", (x) => this.x2 = x);
          component.on("y", (y) => this.y2 = y);
        });
        this.all(["source", "target"], ({ source, target }) => {
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          globalThis.project.pipe(origin, source, target);
        });
        this.any(["x1", "y1", "x2", "y2"], (packet) => update(this.el.Midpoint, midpoint(packet)));
        this.any(["x1", "y1", "x2", "y2"], ({ x1, y1, x2, y2 }) => {
          const [x3, y3] = edgepoint(x1, y1, 12, x1, y1, x2, y2);
          const [x4, y4] = edgepoint(x2, y2, -12, x1, y1, x2, y2);
          update(this.el.Primary, { x1: x3, y1: y3, x2: x4, y2: y4 });
        });
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Pane.js
  var uuid3 = bundle["uuid"];
  var Pane = class {
    static {
      __name(this, "Pane");
    }
    static extends = [Vertical];
    properties = {
      contain: true
    };
    observables = {
      panX: 100,
      panY: 100,
      zoom: 1,
      applications: [],
      elements: [],
      anchors: [],
      pipes: [],
      types: [Junction, Line]
    };
    methods = {
      initialize() {
        console.assert((0, import_deep_equal.default)({ X: 200, Y: 200 }, this.transform({ X: 100, Y: 100 }, null, 2)), "this.transform calculations are incorrect.");
        console.assert((0, import_deep_equal.default)({ X: 50, Y: 50 }, this.transform({ X: 100, Y: 100 }, null, 0.5)), "this.transform calculations are incorrect.");
        if (this.getRootContainer().isRootWindow)
          return;
        console.info("Line must detect the g it should be placed into");
        this.h = 400;
        this.subLayout = new RelativeLayout(this);
      },
      mount() {
        if (0) {
          let v = 0;
          setInterval((x) => {
            ;
            let \u0394 = Math.sin(v);
            v = v + 3e-3;
            if (v >= Math.PI)
              v = 0;
            this.panX = 100 * \u0394;
            this.panY = 100 * \u0394;
          }, 1e3 / 32);
        }
        if (0) {
          let u = Math.PI / 2;
          let v = 0 - u;
          setInterval((x) => {
            ;
            let \u0394 = Math.sin(v);
            v = v + 0.01;
            let z = 1.5 + \u0394;
            this.zoom = z;
            console.log(this.zoom);
            if (v >= Math.PI + u)
              v = 0 - u;
          }, 1e3 / 32);
        }
        if (1) {
          const [horizontal, [addButton, delButton]] = nest(Horizontal, [
            [Label, { h: 32, W: 32, text: "Add", parent: this }, (c, p2) => p2.children.create(c)],
            [Label, { h: 32, W: 32, text: "Del", parent: this }, (c, p2) => p2.children.create(c)]
          ], (c) => this.children.create(c));
          this.disposable = click(addButton.handle, (e) => {
            const id = uuid3();
            const node = new Instance(Node, { id, origin: this.getRootContainer().id, type: "Junction", x: 300, y: 300, data: {} });
            this.elements.create(node);
          });
        }
        const paneBody = new Instance(Viewport, { h: 666, parent: this });
        this.children.create(paneBody);
        globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene: paneBody.el.Mask });
        console.warn(`viewport is moved down by .25 of menu?.. this is a bug`);
        this.on("panX", (panX) => paneBody.panX = panX);
        this.on("panY", (panY) => paneBody.panY = panY);
        this.on("zoom", (zoom) => paneBody.zoom = zoom);
        this.on("elements.created", (node) => {
          const Ui = this.types.find((o) => o.name == node.type);
          if (!Ui)
            return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
          const ui = new Instance(Ui, { id: node.id, node, scene: paneBody.elements });
          this.applications.create(ui);
          ui.start();
          this.subLayout.manage(ui);
        }, { replay: true });
        this.on("elements.removed", ({ id }) => {
          this.applications.get(id).stop();
          this.applications.get(id).destroy();
          this.applications.remove(id);
        });
        this.appendElements();
        if (1) {
        }
        console.warn("these must be configured properly as elemnts are more responsible now. mouse wheel is tracked via the transformed g background rectangle that should have a grid or dot pattern");
        if (0) {
          const pan = new Pan({
            component: this,
            handle: paneBody.el.Container,
            zone: window
            // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
          });
          this.destructable = () => pan.destroy();
          const zoom = new Zoom({
            component: this,
            area: paneBody,
            element: paneBody.el.Container,
            zone: paneBody.el.Container,
            // transformMovement: (v)=>v/globalThis.project.zoom,
            probe: ({ cursor }) => {
            }
          });
          this.destructable = () => zoom.destroy();
        }
      },
      transform(o, keys = null, scale = null) {
        let zoom = scale ?? this.zoom;
        let response = o;
        for (const transform of this.getTransforms(this)) {
          response = Object.fromEntries(Object.entries(response).map(([k, v]) => {
            if (keys === null) {
              return [k, v * zoom];
            } else if (keys.length) {
              if (keys.includes(k)) {
                return [k, v * zoom];
              } else {
                return [k, v];
              }
            }
          }));
        }
        return response;
      }
    };
  };

  // plug-ins/applications/Application.js
  var Application = class {
    static {
      __name(this, "Application");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 800;
        this.h = 600;
      },
      mount() {
        const pane = new Instance(Pane, { url: this.url });
        this.createWindowComponent(pane);
        this.on("node", (node) => {
          node.on("url", (url) => pane.url = url);
        });
      },
      stop() {
        console.log("todo: stopping Application pane...");
      },
      destroy() {
        console.log("todo: destroying Application pane...");
        this.dispose();
      }
    };
  };

  // src/System.js
  var System = class {
    static {
      __name(this, "System");
    }
    properties = {
      application: null,
      debouncedOnResize: null,
      scene: void 0
    };
    observables = {
      origins: []
    };
    constraints = {};
    methods = {
      initialize() {
      },
      mount() {
        const node = new Instance(Node, { id: 0, origin: -1, data: {} });
        this.application = new Instance(Application, { id: node.id, node, scene: this.scene, isRootWindow: true });
        this.application.start();
        const onResize = /* @__PURE__ */ __name(() => {
          this.application.w = this.svg.clientWidth;
          this.application.h = this.svg.clientHeight;
        }, "onResize");
        this.debouncedOnResize = debounce_default(onResize, 10);
        window.addEventListener("resize", this.debouncedOnResize);
        onResize();
      },
      destroy() {
        window.removeEventListener("resize", this.debouncedOnResize);
      }
    };
  };

  // src/index.js
  var themes2 = new Instance(Themes);
  themes2.theme = "nostromo";
  var system = new Instance(System);
  globalThis.system = system;
  globalThis.project = system;
  system.name = "Hello World System";
  system.svg = document.querySelector("#editor-svg");
  system.scene = document.querySelector("#editor-scene");
  system.background = document.querySelector("#editor-background");
  system.start();
})();
