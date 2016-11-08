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

const Clang     = require('./dynamic_clang');
const Lib       = Clang.libclang;
const Consts    = Clang.CONSTANTS;
const Util      = require('./util');

const Location  = require('./location').Location;
const Type      = require('./type').Type;

class Token extends Object {
  constructor(instance, tu) {
    this._instance = instance;
    this._tu = tu;
  }

  get kind() {
    return Lib.clang_getTokenKind(this._instnace);
  }

  get spelling() {
    return Util.toString(Lib.clang_getTokenSpelling(this._tu, this._instance));
  }

  get location() {
    return new Location(Lib.clang_getTokenLocation(this._tu, this._instance));
  }
}

/****************************************************************************
 * Static properties and methods {
 *
 */

/* Include TokenKinds, minus the CXTokenKind_ prefix:
 *    Punctuation, Keyword, Identifier, ...
 */
Object.keys(Consts.CXTokenKind).forEach(function (ckey) {
  const arr = ckey.split('_')
  if (arr.length > 1) {
    let shortKey = arr.slice(1).join('_');
    Token[shortKey] = Consts.CXCursorKind[ckey];
  }
});

/**
 *  Retrieve the string representation of a provided token kind.
 *  @method kindStr
 *  @param  kind    The token kind (CXTokenKind_*) {Number};
 *
 *  @return The string representation {String};
 *  @static
 */
Token.kindStr = function( kind ) {
  let str = Consts.CXTokenKind[ kind ];
  if (str == null)  { str = 'unknown'; }

  return str;
}

/* Static properties and methods }
 ****************************************************************************/

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Token,
  Token:      Token,
}
