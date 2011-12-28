var libclang = require('./libclang');
var util = require('util');

var idx = new libclang.index();
var tu = new libclang.translationunit()
tu.fromSource(idx, "/home/tjfontaine/.llvm/include/clang-c/Index.h", [
    "-I/home/tjfontaine/.llvm/lib/clang/3.1/include",
  ]);
var curs = tu.cursor();

var funcs = {};

//console.log(libclang.TYPES);

var resolveTypeName = function (t) {
  switch (t.kind)
  {
    case libclang.TYPES.CXType_Typedef:
      return t.declaration.spelling;
      break;
    case libclang.TYPES.CXType_Pointer:
      return resolveTypeName(t.pointeeType) + ' *';
      break;
    default:
      return t.spelling;
      break;
  }
};

curs.visitChildren(function(parent) {
  //return libclang.CXChildVisit_Break;
  switch (this.kind)
  {
    case libclang.KINDS.CXCursor_FunctionDecl:
      if (this.spelling.indexOf("clang_") == 0) {
        var result = this.type.result;//.canonical;
        console.log('theirs -->', resolveTypeName(result), this.displayname); 
        var args = []
        var i;
        for (i = 0; i < this.type.argTypes; i++) {
          var arg = this.type.getArg(i);
          args.push(resolveTypeName(arg));
        }
        console.log('mine <--', resolveTypeName(result), this.spelling, '(' + args.join(', ') + ')');
        return libclang.CXChildVisit_Break;
      }
      break;
  }

  return libclang.CXChildVisit_Recurse;
});

tu.dispose();
idx.dispose();
