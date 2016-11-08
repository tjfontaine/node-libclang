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

const Type    = require('./type').Type;
const Location= require('./location').Location;
const Util    = require('./util');

class Cursor extends Object {
  constructor(instance) {
    super();

    this._instance = instance;
  }

  get usr() {
    return Util.toString(Lib.clang_getCursorUSR(this._instance));
  }

  get spelling() {
    return Util.toString(Lib.clang_getCursorSpelling(this._instance));
  }

  get displayname() {
    return Util.toString(Lib.clang_getCursorDisplayName(this._instance));
  }

  get kind() {
    return Lib.clang_getCursorKind(this._instance);
  }

  get type() {
    return new Type(Lib.clang_getCursorType(this._instance));
  }

  get enumType() {
    return new Type(Lib.clang_getEnumDeclIntegerType(this._instance));
  }

  get location() {
    return new Location(Lib.clang_getCursorLocation(this._instance));
  }

  get enumValue() {
    return Lib.clang_getEnumConstantDeclValue(this._instance);
  }

  get enumUValue() {
    return Lib.clang_getEnumConstantDeclUnsignedValue(this._instance);
  }

  get canonical() {
    return new Cursor(Lib.clang_getCanonicalCursor(this._instance));
  }

  get typedefType() {
    return new Type(Lib.clang_getTypedefDeclUnderlyingType(this._instance));
  }

  get referenced() {
    return new Cursor(Lib.clang_getCursorReferenced(this._instance));
  }

  /**
   *  Retrieve an argument by index.
   *  @method getArgument
   *  @param  index   The argument index {Number};
   *
   *  @return A new Cursor representing the argument {Cursor};
   */
  getArgument( index ) {
    return new Cursor(Lib.clang_Cursor_getArgument(this._instance, index));
  }

  /**
   *  Visit children of this cursor.
   *  @method visitChildren
   *  @param  cb    The callback to invoke for each child {Function};
   *                  cb( cursor, parent );
   *
   *  @return none
   */
  visitChildren( cb ) {
    const data = {
      cb:   cb,
      error:undefined,
    }

    Lib.clang_visitChildren(this._instance, _visitChild, data);

    if (data.error) {
      throw data.error;
    }
  }
}

/****************************************************************************
 * Static properties and methods {
 *
 */
Cursor.Break    = 0;
Cursor.Continue = 1;
Cursor.Recurse  = 2;

/* Include CursorKinds, minus the CXCursorKind_ prefix:
 *    FirstDecld, StructDecl, UnionDecl, ...
 */
Object.keys(Consts.CXCursorKind).forEach(function (ckey) {
  const arr = ckey.split('_')
  if (arr.length > 1) {
    let shortKey = arr.slice(1).join('_');
    Cursor[shortKey] = Consts.CXCursorKind[ckey];
  }
});

/**
 *  Retrieve the string representation of a provided cursor kind.
 *  @method kindStr
 *  @param  kind    The cursor kind (CXCursorKind_*) {Number};
 *
 *  @return The string representation {String};
 *  @static
 */
Cursor.kindStr = function( kind ) {
  let str = Consts.CXCursorKind[ kind ];
  if (str == null)  { str = 'unknown'; }

  return str;
}

/* Static properties and methods }
 ****************************************************************************
 * Private helpers {
 *
 */
function _visitChild (cursor, parent, data) {
  const cursor_self   = new Cursor( cursor );
  const cursor_parent = new Cursor( parent );
  let  ret;

  try {
    ret        = data.cb.call(cursor_self, cursor_parent);
    data.error = false;

  } catch (err) {
    data.error = err;
    ret        = Cursor.Break;
    console.error("*** Error: ", err, err.stack);

  } finally {
    return ret;
  }
}

/* Private helpers }
 ****************************************************************************/

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Cursor,
  Cursor:     Cursor,
}
