var lib = require('./dynamic_clang');
var util = require('./util');
var ref = require('ref');

var Location = function (instance) {
  if (!(this instanceof Location))
    return new Location(instance)

  //TODO XXX FIXME clang_getNullLocation
  this._instance = instance;

  Object.defineProperty(this, 'presumedLocation', {
    get: function () {
      var self = this;
      var file = ref.alloc(lib.CXString);
      var line = ref.alloc(ref.types.uint32);
      var column = ref.alloc(ref.types.uint32);
      lib.libclang.clang_getPresumedLocation(self._instance,
        file, line, column);

      return {
        filename: util.toString(file.deref()),
        line: line.deref(),
        column: column.deref(),
      };
    },
  });
};

module.exports = Location;
