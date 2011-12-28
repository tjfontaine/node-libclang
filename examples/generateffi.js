var libclang = require('../libclang');
var FFI = require('node-ffi');


/* libclang types to ffi names */
TYPE_FFI_MAP = {};
TYPE_FFI_MAP[libclang.TYPES.CXType_Void] = 'void';
TYPE_FFI_MAP[libclang.TYPES.CXType_Bool] = 'byte';
TYPE_FFI_MAP[libclang.TYPES.CXType_Char_U] = 'uchar';
TYPE_FFI_MAP[libclang.TYPES.CXType_UChar] = 'uchar';
TYPE_FFI_MAP[libclang.TYPES.CXType_UShort] = 'ushort';
TYPE_FFI_MAP[libclang.TYPES.CXType_UInt] = 'uint32';
TYPE_FFI_MAP[libclang.TYPES.CXType_ULong] = 'ulong';
TYPE_FFI_MAP[libclang.TYPES.CXType_ULongLong] = 'ulonglong';
TYPE_FFI_MAP[libclang.TYPES.CXType_Char_S] = 'char';
TYPE_FFI_MAP[libclang.TYPES.CXType_SChar] = 'char';
TYPE_FFI_MAP[libclang.TYPES.CXType_Short] = 'short';
TYPE_FFI_MAP[libclang.TYPES.CXType_Int] = 'int32';
TYPE_FFI_MAP[libclang.TYPES.CXType_Long] = 'long';
TYPE_FFI_MAP[libclang.TYPES.CXType_LongLong] = 'longlong';
TYPE_FFI_MAP[libclang.TYPES.CXType_Float] = 'float';
TYPE_FFI_MAP[libclang.TYPES.CXType_Double] = 'double';
TYPE_FFI_MAP[libclang.TYPES.CXType_Pointer] = 'pointer';

/*
 * Accepts an object as defined below
 * opts.filename -- required -- the full path to the header source file to parse 
 * opts.prefix -- optional --  restrict imported functions to a given prefix
 * opts.includes -- optional -- a set of directory paths to aid type expansion
 * opts.compiler_args -- optional -- a set of clang command line options passed to the parser
 * 
 * returns an object with the following fields
 * unmapped -- an array where each element object describes a function that failed to map
 *   position -- indicates which field failed to map, -1 is return value, otherwise argument index
 *   arg -- the kind of type in question
 *   name -- the spelling of the function
 *   decl -- the method signature (excluding the result type)
 * ffi -- an object that is to be passed to FFI.Library
 * types -- an object where each key is a type defined for use with a function or another type
 */
exports.generate = function (opts) {
  var fname = opts.filename;
  var prefix = opts.prefix || '';
  var includes = opts.includes || [];
  var compiler_args = [];

  if (opts.compiler_args) {
    compiler_args = opts.compiler_args.slice(0);
  }

  var idx = new libclang.index();
  var tu = new libclang.translationunit();

  includes.forEach(function (include) { compiler_args.push('-I'+include); });
  tu.fromSource(idx, fname, compiler_args);

  var curs = tu.cursor();

  var ffidefs = {};
  var unmapped = [];
  var structs = {};

  /* For a given Typedef try and iterate fields and define an FFI struct */
  var defineType = function (type) {
    /* We've previously defined this type
     * TODO XXX FIXME? wanted to use type.usr since it's relevant per translation unit
     * but using just the regular spelling makes things nicer for accessibility
     */
    if (structs[type.spelling])
      return structs[type.spelling];

    var elements = [];
    var mappedAbort = false;

    type.visitChildren(function(parent) {
      try {
        /* TODO XXX FIXME? 
         * If the current position of the cursor has an empty string, we're
         * probably still at the start of the struct/typedef
         */
        if (this.spelling) {
          /* Potentially some recursion here -- if this type depends on a type
           * a type we have yet to define this call should recurse until we're
           * in a sane state -- undefined if we can't map the type.
           */
          var t = mapType(this.type);
          if (!t) {
            /* This type has an element we don't know how to map yet, abort */
            mappedAbort = true;
            return libclang.CXChildVisit_Break;
          }

          /* Add the field for the struct */
          elements.push([ t, this.spelling ]);
        }
        return libclang.CXChildVisit_Recurse;
      } catch (err) {
        console.log(err.message);
        return libclang.CXChildVisit_Break;
      }
    });

    /* types should probably contain at least one type, and don't claim to support partially defined types */
    if (!mappedAbort && elements.length > 0) {
      structs[type.spelling] = FFI.Struct(elements);
      return structs[type.spelling];
    } else {
      return undefined;
    }
  };

  /*
    Turn the libclang type into ffi type
    TODO XXX FIXME -- Still missing array support (but node-ffi is too)
  */
  var mapType = function (type) {
    if (type.kind === libclang.TYPES.CXType_Pointer
        && type.pointeeType.kind === libclang.TYPES.CXType_Char_S)
      return 'string';
    else if (type.kind === libclang.TYPES.CXType_Typedef)
    {
      /* Handle the case where someone has simply redefined an existing type */
      var canonical = mapType(type.canonical);
      if (canonical)
        return canonical;
      /* If this is a struct try and create */
      return defineType(type.declaration);
    }
    else if (type.kind === libclang.TYPES.CXType_Unexposed
             && type.declaration.kind === libclang.KINDS.CXCursor_EnumDecl)
      /* Special case enums so we can pass them around as integer type */
      return mapType(type.declaration.enumType);
    else /* Everything else that we know about should be handled by this, including opaque pointers */
      return TYPE_FFI_MAP[type.kind];
  };

  /*
   * Main source traversal -- We're mostly/only? concerned with wrapping functions
   * we could theoretically handle types here, but handling it by dependency means
   * we don't necessarily work through types we eventually won't care about
   */
  curs.visitChildren(function(parent) {
    try {
      switch (this.kind)
      {
        case libclang.KINDS.CXCursor_FunctionDecl:
          if (this.spelling.indexOf(prefix) == 0) {
            var result = mapType(this.type.result);
            if (!result) {
              unmapped.push({
                name: this.spelling,
                decl: this.displayname,
                arg: this.type.result.spelling,
                position: -1,
              })
              return libclang.CXChildVisit_Continue;
            }
            var args = [];
            var i;
            var arg;
            for (i = 0; i < this.type.argTypes; i++) {
              arg = mapType(this.type.getArg(i));
              if (!arg) {
                unmapped.push({
                  name: this.spelling,
                  decl: this.displayname,
                  arg: this.type.getArg(i).spelling,
                  position: i,
                })
                return libclang.CXChildVisit_Continue;
              }
              args.push(arg);
            }
            ffidefs[this.spelling] = [ result, args ];
          }
          break;
      }
      return libclang.CXChildVisit_Continue;
    } catch (err) {
      console.log(err.message);
      return libclang.CXChildVisit_Break;
    }
  });

  tu.dispose();
  idx.dispose();

  return {
    ffi: ffidefs,
    unmapped: unmapped,
    types: structs,
  };
};

var generateLibClang = function () {
  var exec = require('child_process').exec;
  var path = require('path');

  exec('llvm-config --includedir', function (fail, out, err) {
    var includedir = out.replace(/\s+$/, '');
    var result = exports.generate({
      filename: path.join(includedir, 'clang-c', 'Index.h'),
      prefix: 'clang_', 
    });

    //console.log(result.unmapped);
    //console.log(result.ffi);
    //console.log(result.types);
    /* TODO XXX FIXME -- this is failing for now when you have defined structs */
    var dynamic_clang = new FFI.Library('libclang', result.ffi);
    var ver = dynamic_clang.clang_getClangVersion();
    console.log(dynamic_clang.clang_getCString(ver));
    dynamic_clang.clang_disposeString(ver)
  });
}

if (require.main === module) {
  generateLibClang();
}
