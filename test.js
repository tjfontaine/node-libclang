var libclang = require('./libclang');
var util = require('util');

var idx = new libclang.index();
var tu = new libclang.translationunit()
tu.fromSource(idx, "/home/tjfontaine/.llvm/include/clang-c/Index.h");
var curs = tu.cursor();

var funcs = {};
curs.visitChildren(function(parent) {

  switch (this.kind)
  {
    case libclang.KINDS.CXCursor_FunctionDecl:
      console.log(this.usr, this.spelling, this.displayname, this.type.spelling);
      var result = this.type.result;
      console.log('result kind', result.kind, result.spelling); 
      //return libclang.CXChildVisit_Break;
      break;
  }

  return libclang.CXChildVisit_Recurse;
});

tu.dispose();
idx.dispose();
