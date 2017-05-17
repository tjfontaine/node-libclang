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

var Token = function (instance, tu) {
  if (!(this instanceof Token))
    return new Token(instance, tu);

  var self = this;

  this._instance = instance;
  this._tu = tu;

  Object.defineProperty(this, 'kind', {
    get: function () {
      return lib.clang_getTokenKind(self._instnace);
    },
  });

  Object.defineProperty(this, 'spelling', {
    get: function () {
      return util.toString(lib.clang_getTokenSpelling(self._tu, self._instance));
    }
  });

  Object.defineProperty(this, 'location', {
    get: function () {
      return new Location(lib.clang_getTokenLocation(self._tu, self._instance));
    }
  });
};

Object.keys(consts.CXTokenKind).forEach(function (key) {
  var arr = key.split('_')
  if (arr.length === 2) {
    Cursor[arr[1]] = consts.CXCursorKind[key];
  }
});

module.exports = Token;

var Type = require('./type');
