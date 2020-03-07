// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

var ffi = require('ffi');
var ref = require('ref');

var d = require('./dynamic_clang');
var lib = d.libclang;
var consts = d.CONSTANTS;
var CXCursor = d.CXCursor;
var CXCursorVisitor = d.CXCursorVisitor;

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
      return new Location(lib.clang_getCursorLocation(self._instance));
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

  Object.defineProperty(this, 'canonical', {
    get: function () {
      return new Cursor(lib.clang_getCanonicalCursor(self._instance));
    }
  });

  Object.defineProperty(this, 'typedefType', {
    get: function () {
      return new Type(lib.clang_getTypedefDeclUnderlyingType(self._instance));
    }
  });

  Object.defineProperty(this, 'referenced', {
    get: function () {
      return new Cursor(lib.clang_getCursorReferenced(self._instance));
    }
  });

  this.getArgument = function (index) {
    return new Cursor(lib.clang_Cursor_getArgument(self._instance, index));
  };
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

function visitor (c, p, dataPtr) {
  var data = ref.readObject(dataPtr);
  var cb = data.cb;
  var s = new Cursor(c);
  var parent = new Cursor(p);
  var ret;

  try {
    ret = cb.call(s, parent);
    data.error = false;
  } catch (e) {
    data.error = e;
    ret = Cursor.Break; // CXChildVisit_Break
    console.log("we have an error", e, e.stack);
  } finally {
    return ret;
  }
};

Cursor.prototype.visitChildren = function (cb) {
  var data = {
    cb: cb,
    error: undefined,
  }
  var dataPtr = ref.alloc("Object", data);
  lib.clang_visitChildren(this._instance, visitor, dataPtr);
  if (data.error)
    throw data.error;
};

module.exports = Cursor;

var Type = require('./type');
