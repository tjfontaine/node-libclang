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

const Clang     = require('./lib/dynamic_clang');
const Consts    = Clang.CONSTANTS;

// Hybrid export map: Common.js with ES6 module structure
const exportMap = {
  __esModule:     true,
  Cursor:         require('./lib/cursor').Cursor,
  Index:          require('./lib/index').Index,
  TranslationUnit:require('./lib/translationunit').TranslationUnit,
  Type:           require('./lib/type').Type,
  Location:       require('./lib/location').Location,
  Tokens:         require('./lib/tokens').Tokens,
};

exportMap.default = exportMap;

/* Generate a bi-directional map for each constant group from `dynamic_clang`:
 *      CXDiagnosticSeverity    => DiagnosticSeverity
 *          Ignored, Note, Warning, Error, Fatal
 *      CXTUResourceUsageKind   => TUResourceUsageKind
 *          First, Identifiers, Selectors, ...
 *      CXCursorKind            => CursorKind
 *          FirstDecld, StructDecl, UnionDecl, ...
 *      CXLinkageKind           => LinkageKind
 *          Invalid, NoLinkage, Internal, ...
 *      CXAvailabilityKind      => AvailabilityKind
 *          Available, Deprecated, ...
 *      CXLanguageKind          => LanguageKind
 *          Invalid, C, ObjC, CPlusPlus, ...
 *      CXTypeKind              => TypeKind
 *          Invalid, Unexposed, FirstBuiltin, ...
 *      CXCallingConv           => CallingConv
 *          Default, C, X86StdCall, ...
 *      CX_CXXAccessSpecifier   => CXXAccessSpecifier
 *          CXXInvalidAccessSpecifier, CXXPublic, ...
 *      CXChildVisitResult      => ChildVisitResult
 *          Break, Continue, Recurse, ...
 *      CXCommentKind           => CommentKind
 *          Null, Text, InlineCommand, ...
 *      CXCommentInlineCommandRenderKind
 *                              => CommentInlineCommandRenderKind
 *          Normal, Bold, monospaced, Emphasized, ...
 *      CXCommentParamPassDirection
 *                              => CommentParamPassDirection
 *          In, Out, InOut, ...
 *      CXTokenKind             => TokenKind
 *          Punctuation, Keyword, Identifier, ...
 *      CXCompletionChunkKind   => CompletionChunkKind
 *          Optional, TypedText, Text, ...
 *      CXVisitorResult         => VisitorResult
 *          Break, Continue, ...
 *      CXIdxAttr_*             => IdxAttr
 *          Unexposed, ...
 *      CXIdxEntity_*           => IdxEntity
 *          Field, EnumConstant, ...
 *      CXIdxEntityLang_*       => IdxEntityLang
 *          None, C, ObjC, CXX
 *      CXIdxObjCContainer_*    => IdxObjCContainer
 *          ForwardRef, ...
 */
Object.keys(Consts).forEach(function (ckey) {
    let   baseKey   = ckey.replace(/^CX_?/, '');
    const map       = {};
    const baseParts = baseKey.split('_');
    if (baseParts.length === 2) {
        baseKey = baseParts[0];
    }

    Object.keys(Consts[ckey]).forEach(function ( vkey ) {
        const vkeyParts = vkey.split('_');
        if (vkeyParts.length === 2) {
            const key   = vkeyParts[1];
            const val   = Consts[ckey][vkey];
            // Forward map : string => num
            if (map[key] == null) { map[key] = val; }

            // Reverse map : num => string
            if (map[val] == null) { map[val] = vkeyParts[1]; }
        }
    });

    exportMap[baseKey] = map;
});

// Hybrid export: Common.js with ES6 module structure
module.exports = exportMap;
