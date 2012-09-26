var lib = require('./dynamic_clang').libclang;

exports.toString = function(cxstring) {
  return lib.clang_getCString(cxstring);
};
