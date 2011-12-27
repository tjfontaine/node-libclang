var libclang = require('./libclang');
var util = require('util');

var idx = new libclang.index();
var tu = new libclang.translationunit()
tu.fromSource(idx, "/home/tjfontaine/.llvm/include/clang-c/Index.h");
var curs = tu.cursor();

curs.visitChildren(function(parent) {
  console.log(libclang.KINDS[this.kind.toString()], '|', parent.usr, '->', this.usr);
  return libclang.CXChildVisit_Recurse;
});

tu.dispose();
idx.dispose();
