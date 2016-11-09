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

const Clang     = require('./clang-c');
const Lib       = Clang.libclang;
const Ref       = require('ref');
const ArrayType = require('ref-array');

const Location  = require('./location').Location;
//const TokenList = require('./token-list').TokenList;

class Range extends Object {
  constructor(instance) {
    super();

    this._instance = instance;
  }

  /***************************************************************************
   * Direct properties {
   */
  get start() {
    return new Location(Lib.clang_getRangeStart(this._instance));
  }

  get end() {
    return new Location(Lib.clang_getRangeEnd(this._instance));
  }

  get isNull() {
    return Lib.clang_Range_isNull( this._instance );
  }

  /* Direct properties }
   ***************************************************************************/

  /**
   *  Is the given range identical to this range?
   *  @method equals
   *  @param  range     The other range {Range};
   *
   *  @return true | false;
   */
  equals( range ) {
    return (range instanceof Range &&
            Lib.clang_equalRanges( this._instance, range._instance ));
  }

  /**
   *  Tokenize this range.
   *  @method tokenize
   *  @param  tu    The translation unit {TranslationUnit};
   *
   *  @return A new token list {TokenList};
  tokenize( tu ) {
    const tokens    = Ref.alloc( Ref.refType( Lib.CXToken ) );
    const count     = Ref.alloc( Ref.types.uint32 );

    Lib.clang_tokenize( tu._instance, this._instance, tokens, count);

    const listSize  = count.deref() * Lib.CXToken.size;
    return new TokenList( tu, new TokenArray( Ref.reinterpret( tokens.deref(),
                                                               listSize,
                                                               0 ) ) );
  }
   */
}

// Hybrid export: Common.js with ES6 module structure
module.exports = {
  __esModule: true,
  default:    Range,
  Range:      Range,
}
