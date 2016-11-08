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

const Clang   = require('./dynamic_clang');
const Lib     = Clang.libclang;
const Consts  = Clang.CONSTANTS;
const Util    = require('./util');
const Cursor  = require('./cursor').Cursor;

class Type extends Object {
  constructor(instance) {
    super();

    this._instance = instance;
  }

  get kind() {
    return this._instance.kind;
  }

  get spelling() {
    return Util.toString(Lib.clang_getTypeKindSpelling(this._instance.kind));
  }

  get result() {
    return new Type(Lib.clang_getResultType(this._instance));
  }

  get canonical() {
    return new Type(Lib.clang_getCanonicalType(this._instance));
  }

  get argTypes() {
    return Lib.clang_getNumArgTypes(this._instance);
  }

  get declaration() {
    var c = Lib.clang_getTypeDeclaration(this._instance);
    }


  get pointeeType() {
    return new Type(Lib.clang_getPointeeType(this._instance));
  }

  get elementType() {
    return new Type(Lib.clang_getElementType(this._instance));
  }

  get numElements() {
    return Lib.clang_getNumElements(this._instance);
  }

  get arrayElementType() {
    return new Type(Lib.clang_getArrayElementType(this._instance));
  }

  get arraySize() {
    return Lib.clang_getArraySize(this._instance);
  }

  get isPOD() {
    return Lib.clang_isPODType(this._instance) === 1 ? true : false;
  }

  /**
   *  Retrieve the type of the given argument.
   *  @method ofArg
   *  @param  arg   The target argument;
   *
   *  @return A new Type representing the given argument {Type};
   */
  ofArg( arg ) {
    return new Type(Lib.clang_getArgType(this._instance, arg));
  }
}

/****************************************************************************
 * Static properties and methods {
 *
 */

/* Include TypeKinds, minus the CXTypeKind_ prefix:
 *    Invalid, Unexposed, FirstBuiltin, Bool, ...
 */
Object.keys(Consts.CXTypeKind).forEach(function (ckey) {
  const arr = ckey.split('_')
  if (arr.length > 1) {
    let shortKey = arr.slice(1).join('_');
    Type[shortKey] = Consts.CXTypeKind[ckey];
  }
})

/* Static properties and methods }
 ****************************************************************************/

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Type,
  Type:       Type,
}
