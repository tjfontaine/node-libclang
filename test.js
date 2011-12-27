var libclang = require('./libclang');

var idx = new libclang.index();
var tu = new libclang.translationunit()
tu.fromSource(idx, "/home/tjfontaine/.llvm/include/clang-c/Index.h");
var curs = tu.cursor();
curs.dispose();
tu.dispose();
idx.dispose();
