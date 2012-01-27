var libclang = require('./bindings');
var util = require('util');
var path = require('path');


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
TYPE_FFI_MAP[libclang.TYPES.CXType_ConstantArray] = 'pointer';

/*
 * Accepts an object as defined below
 * opts.filename -- required -- the full path to the header source file to parse
 * opts.library -- required -- the library ffi should use to dlopen
 * opts.module -- optional -- the name of the module that will be exported (otherwise uses library name)
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
 * serialized -- string representation of the types and module [eval or save]
 */
exports.generate = function (opts) {
  var fname = path.normalize(opts.filename);
  var library = opts.library;
  var module = opts.module || opts.library;
  var prefix = opts.prefix || '';
  var includes = opts.includes || [];
  var compiler_args = [];
  var single_file = opts.single_file || false;

  if (opts.compiler_args) {
    compiler_args = opts.compiler_args.slice(0);
  }

  var idx = new libclang.index();
  var tu = new libclang.translationunit();

  includes.forEach(function (include) { compiler_args.push('-I'+include); });
  tu.fromSource(idx, fname, compiler_args);

  var curs = tu.cursor();

  var unmapped = [];
  var structs = {};
  var serializer = '';

  var sQuote = function (s) { return "'" + s + "'"; };
  var StructType = function (name) { this.name = name; };
  var PODType = function (name) { this.name = sQuote(name); };

  for (key in TYPE_FFI_MAP) {
    TYPE_FFI_MAP[key] = new PODType(TYPE_FFI_MAP[key]);
  }

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

    var first = true;
    type.visitChildren(function(parent) {
      try {
        /* First item in the cursor is the one we started with?
         * immediately move beyond it
         */
        if (first) {
          first = false;
          return libclang.CXChildVisit_Recurse;
        }
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
        return libclang.CXChildVisit_Continue;
      } catch (err) {
        console.log(err.message);
        return libclang.CXChildVisit_Break;
      }
    });

    /* types should probably contain at least one type, and don't claim to support partially defined types */
    if (!mappedAbort && elements.length > 0) {
      serializer += 'var ' + type.spelling + ' = exports.' + type.spelling + ' = FFI.Struct([';
      elements.forEach(function(e) {
        serializer += '[' + e[0].name + ", " + sQuote(e[1]) + "],";
      });
      serializer += ']);';
      structs[type.spelling] = new StructType(type.spelling);
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
    var ret;
    if (type.kind === libclang.TYPES.CXType_Pointer
        && type.pointeeType.kind === libclang.TYPES.CXType_Char_S)
      ret = new PODType('string');
    else
      switch (type.kind)
      {
        case libclang.TYPES.CXType_Typedef:
          /* Handle the case where someone has simply redefined an existing type */
          var canonical = mapType(type.canonical);
          if (canonical)
            ret = canonical;
          else /* If this is a struct try and create */
            ret = defineType(type.declaration);
          break;
        case libclang.TYPES.CXType_Unexposed:
          /* Special case enums so we can pass them around as integer type */
          if (type.declaration.kind === libclang.KINDS.CXCursor_EnumDecl)
            ret = mapType(type.declaration.enumType);
          break;
        case libclang.TYPES.CXType_Enum:
            ret = mapType(type.declaration.enumType);
          break;
        default:
          ret = TYPE_FFI_MAP[type.kind];
          break;
      }

    return ret;
  };


  var serialize_body = 'exports.' + module + " = new FFI.Library('" + library + "', {";
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
            if (single_file && path.normalize(this.location.presumedLocation.filename) !== fname) {
              return libclang.CXChildVisit_Continue;
            }

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
            result = result.name;
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
              args.push(arg.name);
            }

            serialize_body += this.spelling + ': [' + result + ', [' + args.join(', ') + ']],';
          }
          break;
      }
      return libclang.CXChildVisit_Continue;
    } catch (err) {
      console.log(err.message);
      return libclang.CXChildVisit_Break;
    }
  });
  serialize_body += '});';

  tu.dispose();
  idx.dispose();

  return {
    unmapped: unmapped,
    serialized: "var FFI = require('node-ffi');" + serializer + serialize_body,
  };
};

var generateLibClang = function () {
  var exec = require('child_process').exec;

  exec('llvm-config --includedir', function (fail, out, err) {
    var includedir = out.replace(/\s+$/, '');
    var result = exports.generate({
      filename: path.join(includedir, 'clang-c', 'Index.h'),
      library: 'libclang',
      prefix: 'clang_',
    });

    if (result.unmapped.length > 0) {
      console.log('----- UNMAPPED FUNCTIONS -----');
      console.log(result.unmapped);
      console.log('----- UNMAPPED FUNCTIONS -----');
    }

    var jsb = require('beautifyjs');
    require('fs').writeFileSync(path.join(__dirname, 'dynamic_clang.js'), jsb.js_beautify(result.serialized));
    var dynamic_clang = require(path.join(__dirname, 'dynamic_clang'));
    var ver = dynamic_clang.libclang.clang_getClangVersion();
    console.log(dynamic_clang.libclang.clang_getCString(ver));
    dynamic_clang.libclang.clang_disposeString(ver)
  });
}

if (require.main === module) {
  generateLibClang();
}
