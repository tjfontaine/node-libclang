var assert = require('assert'),
    path = require('path'),
    util = require('util');

var Cursor = require('./cursor'),
    Index = require('./index'),
    TranslationUnit = require('./translationunit'),
    Type = require('./type')

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

  var idx = new Index(true, true);
  var tu;

  includes.forEach(function (include) { compiler_args.push('-I'+include); });
  tu = TranslationUnit.fromSource(idx, fname, compiler_args);

  var curs = tu.cursor;

  var unmapped = [];
  var structs = {};
  var enums = {};
  var serializer = '';

  var sQuote = function (s) { return "'" + s + "'"; };
  var StructType = function (name) { this.name = name; };
  var PODType = function (name) { this.name = name; };

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
        /* First item in the cursor is the one we started with?
         * immediately move beyond it
         */
        if (first) {
          first = false;
          return Cursor.Recurse;
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
          var t = mapType(this.type, this.spelling);
          if (!t) {
            /* This type has an element we don't know how to map yet, abort */
            mappedAbort = true;
            return Cursor.Break;
          }

          /* Add the field for the struct */
          elements.push([ t, this.spelling ]);
        }
        return Cursor.Continue;
    });

    /* types should probably contain at least one type, and don't claim to support partially defined types */
    if (!mappedAbort && elements.length > 0) {
      serializer += 'var ' + type.spelling + ' = exports.' + type.spelling + ' = StrictType(Struct({';
      elements.forEach(function(e) {
        serializer += e[1] + ': ';
        if (!e[0].arrSize) {
          serializer += e[0].name;
        } else {
          serializer += 'ArrayType(';
          serializer += e[0].name;
          serializer += ', ' + e[0].arrSize + ')';
        }
        serializer += ',';
      });
      serializer += '}));';
      serializer += 'var ' + type.spelling + 'Ptr = exports. ' + type.spelling + 'Ptr = StrictType(ref.refType(' + type.spelling + '));';
      structs[type.spelling] = new StructType(type.spelling);
      return structs[type.spelling];
    } else {
      return undefined;
    }
  };


  var mapEnum = function (type, ret) {
    var def;
    type.visitChildren(function (parent) {
      var val;

      if (ret.name[0] === 'u') {
        val = this.enumUValue;
      } else {
        val = this.enumValue;
      }

      def = enums[parent.displayname];
      if (!def) {
        def = enums[parent.displayname] = {};
      }

      def[this.displayname] = val;
      def[val] = this.displayname;

      return Cursor.Continue;
    });
    //console.log(def);
  };

  /*
    Turn the libclang type into ffi type
    TODO XXX FIXME -- Still missing array support (but node-ffi is too)
  */
  var mapType = function (type, fieldname) {
    var ret;
    if (type.kind === Type.Pointer && type.pointeeType.kind === Type.Char_S) {
      ret = new PODType('ref.types.CString');
    } else {
      switch (type.kind)
      {
        case Type.Typedef:
          /* Handle the case where someone has simply redefined an existing type */
          var canonical = mapType(type.canonical, fieldname);
          if (canonical)
            ret = canonical;
          else /* If this is a struct try and create */
            ret = defineType(type.declaration);
          break;
        case Type.Unexposed:
          /* Special case enums so we can pass them around as integer type */
          if (type.declaration.kind === Cursor.EnumDecl) {
            ret = mapType(type.declaration.enumType, fieldname);
            mapEnum(type.declaration, ret);
          }
          break;
        case Type.Enum:
          ret = mapType(type.declaration.enumType, fieldname);
          mapEnum(type.declaration, ret);
          break;
        case Type.Pointer:
          if (type.pointeeType.declaration.kind == Cursor.TypedefDecl)
            ret = defineType(type.pointeeType.declaration);
          else
            ret = undefined;
          if (!ret) {
            ret = new PODType('voidPtr');
          } else {
            ret = new PODType(ret.name + 'Ptr');
          }
          break;
        case Type.ConstantArray:
          ret = mapType(type.elementType, fieldname);

          if (!ret)
            ret = defineType(type.elementType.declaration);

          ret.arrSize = type.arraySize;
          //console.log(fieldname, type.spelling, type.elementType.spelling, ret);
          break;
        case Type.Void:
          ret = new PODType('ref.types.void');
          break;
        case Type.Bool:
          ret = new PODType('ref.types.byte');
          break;
        case Type.Char_U:
        case Type.UChar:
          ret = new PODType('ref.types.uchar');
          break;
        case Type.UShort:
          ret = new PODType('ref.types.ushort');
          break;
        case Type.UInt:
          ret = new PODType('ref.types.uint32');
          break;
        case Type.ULong:
          ret = new PODType('ref.types.ulong');
          break;
        case Type.ULongLong:
          ret = new PODType('ref.types.ulonglong');
          break;
        case Type.Char_S:
        case Type.SChar:
          ret = new PODType('ref.types.char');
          break;
        case Type.Short:
          ret = new PODType('ref.types.short');
          break;
        case Type.Int:
          ret = new PODType('ref.types.int32');
          break;
        case Type.Long:
          ret = new PODType('ref.types.long');
          break;
        case Type.LongLong:
          ret = new PODType('ref.types.longlong');
          break;
        case Type.Float:
          ret = new PODType('ref.types.float');
          break;
        case Type.Double:
          ret = new PODType('ref.types.double');
          break;
        default:
          assert(type.kind);
          break;
      }
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
      switch (this.kind)
      {
        case Cursor.FunctionDecl:
          if (this.spelling.indexOf(prefix) == 0) {
            if (single_file && path.normalize(this.location.presumedLocation.filename) !== fname) {
              return Cursor.Continue;
            }

            var result = mapType(this.type.result, this.spelling);
            if (!result) {
              unmapped.push({
                name: this.spelling,
                decl: this.displayname,
                arg: this.type.result.spelling,
                position: -1,
              })
              return Cursor.Continue;
            }
            result = result.name;
            var args = [];
            var i;
            var arg;
            for (i = 0; i < this.type.argTypes; i++) {
              arg = mapType(this.type.getArg(i), this.spelling + '-arg' + i);
              if (!arg) {
                unmapped.push({
                  name: this.spelling,
                  decl: this.displayname,
                  arg: this.type.getArg(i).spelling,
                  position: i,
                })
                return Cursor.Continue;
              }
              args.push(arg.name);
            }
            
            serialize_body += this.spelling + ': [' + result + ', [' + args.join(', ') + ']],';
          }
          break;
      }
      return Cursor.Continue;
  });
  serialize_body += '});';

  //tu.dispose();
  idx.dispose();

  enums_serialized = 'exports.CONSTANTS = ' + util.inspect(enums) + ';';

  var serialized_header = '';
  serialized_header += "var FFI = require('ffi'),";
  serialized_header += "ArrayType = require('ref-array'),";
  serialized_header += "Struct = require('ref-struct'),";
  serialized_header += "StrictType = require('ref-strict'),";
  serialized_header += "ref = require('ref');"
  serialized_header += "var voidPtr = ref.refType(ref.types.void);";

  return {
    unmapped: unmapped,
    serialized: serialized_header + enums_serialized + serializer + serialize_body,
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
    require('fs').writeFileSync(path.join(__dirname, 'newclang.js'), jsb.js_beautify(result.serialized));
    var dynamic_clang = require(path.join(__dirname, 'newclang'));
    var ver = dynamic_clang.libclang.clang_getClangVersion();
    console.log(dynamic_clang.libclang.clang_getCString(ver));
    dynamic_clang.libclang.clang_disposeString(ver)
  });
}

if (require.main === module) {
  generateLibClang();
}
