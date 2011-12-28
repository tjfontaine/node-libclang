var libclang = require('../libclang');

TYPE_FFI_MAP = {};
TYPE_FFI_MAP[libclang.TYPES.CXType_Void] = 'void';
TYPE_FFI_MAP[libclang.TYPES.CXType_Bool] = 'byte';
TYPE_FFI_MAP[libclang.TYPES.CXType_Char_U] = 'uchar';
TYPE_FFI_MAP[libclang.TYPES.CXType_UChar] = 'uchar';
TYPE_FFI_MAP[libclang.TYPES.CXType_UShort] = 'ushort';
TYPE_FFI_MAP[libclang.TYPES.CXType_UInt] = 'uint';
TYPE_FFI_MAP[libclang.TYPES.CXType_ULong] = 'ulong';
TYPE_FFI_MAP[libclang.TYPES.CXType_ULongLong] = 'ulonglong';
TYPE_FFI_MAP[libclang.TYPES.CXType_Char_S] = 'char';
TYPE_FFI_MAP[libclang.TYPES.CXType_SChar] = 'char';
TYPE_FFI_MAP[libclang.TYPES.CXType_Short] = 'short';
TYPE_FFI_MAP[libclang.TYPES.CXType_Int] = 'int';
TYPE_FFI_MAP[libclang.TYPES.CXType_Long] = 'long';
TYPE_FFI_MAP[libclang.TYPES.CXType_LongLong] = 'longlong';
TYPE_FFI_MAP[libclang.TYPES.CXType_Float] = 'float';
TYPE_FFI_MAP[libclang.TYPES.CXType_Double] = 'double';
TYPE_FFI_MAP[libclang.TYPES.CXType_Pointer] = 'pointer';

var mapType = function (type) {
  if (type.kind === libclang.TYPES.CXType_Pointer
      && type.pointeeType.kind === libclang.TYPES.CXType_Char_S)
    return 'string';
  else if (type.kind === libclang.TYPES.CXType_Typedef)
    return mapType(type.canonical);
  else
    return TYPE_FFI_MAP[type.kind];
};

exports.generate = function (opts) {
  var fname = opts.filename;
  var library = opts.library;
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

  var funcs = [];
  var unmapped = [];

  curs.visitChildren(function(parent) {
    try
    {
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
          funcs.push({
            name: this.spelling,
            result: result,
            params: args,
          });
        }
        break;
    }
    return libclang.CXChildVisit_Recurse;
    } catch (err) {
      console.log(err.message);
      return libclang.CXChildVisit_Break;
    }
  });

  tu.dispose();
  idx.dispose();

  var ffidefs = {};

  funcs.forEach(function (f) {
    ffidefs[f.name] = [ f.result, f.params ];
  });

  return { ffi: ffidefs, unmapped: unmapped };
};

var generateLibClang = function () {
  var exec = require('child_process').exec;
  var path = require('path');

  exec('llvm-config --includedir', function (fail, out, err) {
    var includedir = out.replace(/\s+$/, '');
    var result = exports.generate({
      filename: path.join(includedir, 'clang-c', 'Index.h'),
      library: 'libclang',
      prefix: 'clang_', 
    });

    //console.log(result.unmapped);
    console.log(result.ffi);
  });
}

if (require.main === module) {
  generateLibClang();
}
