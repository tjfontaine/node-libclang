var ref = require('ref');

var lib = require('./dynamic_clang').libclang;

var Cursor = require('./cursor');

var TranslationUnit = function (instance) {
  if (!(this instanceof TranslationUnit))
    return new TranslationUnit(instance);

  var self = this;

  if (instance instanceof Buffer) {
    this._instance = instance;
  }

  Object.defineProperty(this, 'cursor', {
    get: function () {
      var t = lib.clang_getTranslationUnitCursor(self._instance); 
      return new Cursor(t);
    },
  });
};

TranslationUnit.fromSource = function (index, file, args) {
  var cargs, i, inst;

  cargs = new Buffer(ref.sizeof.pointer * args.length);

  for (i = 0; i < args.length; i++) {
    cargs.writePointer(ref.allocCString(args[i]),
      i * ref.sizeof.pointer);
  }

  inst = lib.clang_createTranslationUnitFromSourceFile(
    index._instance, file, args.length, cargs, 0, null);

  return new TranslationUnit(inst);
};

module.exports = TranslationUnit;
