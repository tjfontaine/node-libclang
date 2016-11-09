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
'use strict';

const Clang   = require('./clang-c');
const Lib     = Clang.libclang;

class Index extends Object {
  constructor(pch, diags) {
    super();

    if (pch instanceof Buffer) {
      this._instance = pch;

    } else {
      this._instance = Lib.clang_createIndex(pch ? 1 : 0, diags ? 1 : 0);

    }
  }

  /**
   *  Dispose of this index when it is no longer needed.
   *  @method dispose
   *
   *  @return none
   */
  dispose() {
    Lib.clang_disposeIndex(this._instance);
  }
}

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Index,
  Index:      Index,
}
