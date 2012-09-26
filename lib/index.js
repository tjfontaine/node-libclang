var lib = require('./dynamic_clang').libclang;

var Index = function (pch, diags) {
  if (!(this instanceof Index))
    return new Index();

  if (pch instanceof Buffer) {
    this._instance = pch;
  } else {
    this._instance = lib.clang_createIndex(pch ? 1 : 0, diags ? 1 : 0);
  }
};

Index.prototype.dispose = function () {
  lib.clang_disposeIndex(this._instance);
};

module.exports = Index;
