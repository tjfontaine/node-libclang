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

var lib = require('./dynamic_clang');
var util = require('./util');
var ref = require('ref');

var Location = function (instance) {
  if (!(this instanceof Location))
    return new Location(instance)

  //TODO XXX FIXME clang_getNullLocation
  this._instance = instance;

  Object.defineProperty(this, 'presumedLocation', {
    get: function () {
      var self = this;
      var file = ref.alloc(lib.CXString);
      var line = ref.alloc(ref.types.uint32);
      var column = ref.alloc(ref.types.uint32);
      lib.libclang.clang_getPresumedLocation(self._instance,
        file, line, column);

      return {
        filename: util.toString(file.deref()),
        line: line.deref(),
        column: column.deref(),
      };
    },
  });
};

module.exports = Location;
