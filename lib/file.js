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
const Util    = require('./util');
const Ref     = require('ref');

class File extends Object {
  constructor(instance) {
    super();

    this._instance = instance;
  }

  /***************************************************************************
   * Direct properties {
   */
  get name() {
    return Util.toString(Lib.clang_getFileName(this._instance));
  }

  get time() {
    return new Date(Lib.clang_getFileTime(this._instance));
  }

  get id() {
    const id  = Ref.allocation( Lib.CXFileUniqueId );
    if (Lib.clang_getFileUinqueId( this._instance )) {
      throw 'error';
    }

    return id.unref();
  }
  /* Direct properties }
   ***************************************************************************/

  /**
   *  Is the given file identical to this file?
   *  @method equals
   *  @param  file      The other file {File};
   *
   *  @return true | false;
   */
  equals( file ) {
    return (file instanceof File &&
            Lib.clang_File_isEqual( this._instance, file._instance ));
  }

  /**
   *  Is the given file identical to this file? (alias for equals()).
   *  @method isEqual
   *  @param  file      The other file {File};
   *
   *  @return true | false;
   */
  isEqual( file ) {
    return this.equals( file );
  }
}

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    File,
  File:       File,
}
