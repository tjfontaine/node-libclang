var lib = require('./dynamic_clang');
var util = require('./util');

var Location = function (instance) {
  if (!(this instanceof Location))
    return new Location(instance)

  if (instance instanceof Buffer) {
    this._instance = instance;
  } else {
    this._instance = lib.clang_getNullLocation();
  }

  Object.defineProperty(this, 'presumedLocation', {
    get: function () {
      var file = ref.alloc(lib.CXString);
      var line = ref.alloc(ref.types.uint32);
      var column = ref.alloc(ref.types.uint32);
      lib.libclang.clang_getPresumedLocation(self._instance,
        file.ref(), line.ref(), column.ref());
      return {
        filename: util.toString(file),
        line: line,
        column: column,
      };
    },
  });
};

module.exports = Location;
