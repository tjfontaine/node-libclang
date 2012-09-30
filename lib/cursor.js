var ffi = require('ffi');
var ref = require('ref');

var d = require('./dynamic_clang');
var lib = d.libclang;
var consts = d.CONSTANTS;
var CXCursor = d.CXCursor;

var Location = require('./location');

var util = require('./util');

var Cursor = function (instance) {
  if (!(this instanceof Cursor))
    return new Cursor(instance);

  var self = this;

  this._instance = instance;

  Object.defineProperty(this, 'usr', {
    get: function () {
      return util.toString(lib.clang_getCursorUSR(self._instance));
    }
  });

  Object.defineProperty(this, 'spelling', {
    get: function () {
      return util.toString(lib.clang_getCursorSpelling(self._instance));
    }
  });

  Object.defineProperty(this, 'displayname', {
    get: function () {
      return util.toString(lib.clang_getCursorDisplayName(self._instance));
    }
  });

  Object.defineProperty(this, 'kind', {
    get: function () {
      return lib.clang_getCursorKind(self._instance);
    }
  });

  Object.defineProperty(this, 'type', {
    get: function () {
      return new Type(lib.clang_getCursorType(self._instance));
    }
  });

  Object.defineProperty(this, 'enumType', {
    get: function () {
      return new Type(lib.clang_getEnumDeclIntegerType(self._instance));
    }
  });

  Object.defineProperty(this, 'location', {
    get: function () {
      return new Location(lib.clang_getCursorLocation(self._instnace));
    }
  });

  Object.defineProperty(this, 'enumValue', {
    get: function () {
      return lib.clang_getEnumConstantDeclValue(self._instance);
    }
  });

  Object.defineProperty(this, 'enumUValue', {
    get: function () {
      return lib.clang_getEnumConstantDeclUnsignedValue(self._instance);
    }
  });
};

Cursor.Break = 0;
Cursor.Continue = 1;
Cursor.Recurse = 2;

Object.keys(consts.CXCursorKind).forEach(function (key) {
  var arr = key.split('_')
  if (arr.length === 2) {
    Cursor[arr[1]] = consts.CXCursorKind[key];
  }
});

function visitor (c, p, data) {
  var cb = data.cb;
  var s = new Cursor(c);
  var parent = new Cursor(p);
  var ret;

  try {
    ret = cb.call(s, parent);
    data.error = false;
  } catch (e) {
    data.error = e;
    ret = 0; // CXChildVisit_Break
    console.log("we have an error", e, e.stack);
  } finally {
    return ret;
  }
};

var visitor_ptr = ffi.Callback(ref.types.uint32, [
  CXCursor,
  CXCursor,
  ref.types.Object,
], visitor);

Cursor.prototype.visitChildren = function (cb) {
  var data = {
    cb: cb,
    error: undefined,
  }
  lib.clang_visitChildren(this._instance, visitor_ptr, data);
  if (data.error)
    throw data.error;
};

module.exports = Cursor;

var Type = require('./type');
