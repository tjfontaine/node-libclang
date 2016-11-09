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

const Ref     = require('ref');
const Clang   = require('./clang-c');
const Lib     = Clang.libclang;
const Cursor  = require('./cursor').Cursor;

class TranslationUnit extends Object {
  constructor(instance) {
    super();

    if (instance instanceof Buffer) {
      this._instance = instance;
    }
  }

  get cursor() {
    const tuc = Lib.clang_getTranslationUnitCursor(this._instance);

    return new Cursor(tuc);
  }
}

/****************************************************************************
 * Static properties and methods {
 *
 */

/**
 *  Create new TranslationUnit from the provided index, file, and arguments.
 *  @method fromSource
 *  @param  index   The source index {Index};
 *  @param  file    The source file {String};
 *  @param  [args]  Any argument to associate with this instance {Array};
 *
 *  @return A new translation unit instance {TranslationUnit};
 *  @static
 */
TranslationUnit.fromSource = function (index, file, args) {
  if (args == null)             { args = []; }
  if (! Array.isArray(args))    { args = [ args ]; }

  let cargs = new Buffer( Ref.sizeof.pointer * args.length );

  for (let idex = 0; idex < args.length; idex++) {
    cargs.writePointer( Ref.allocCString(args[idex]),
                        idex * Ref.sizeof.pointer );
  }

  let inst =
    Lib.clang_createTranslationUnitFromSourceFile( index._instance,
                                                   file,
                                                   args.length,
                                                   cargs,
                                                   0,
                                                   null );

  return new TranslationUnit( inst );
}

/* Static properties and methods }
 ****************************************************************************/

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:          TranslationUnit,
  TranslationUnit:  TranslationUnit,
}
