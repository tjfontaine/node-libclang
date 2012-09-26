var lib = require('./dynamic_clang').libclang;

var Cursor = require('./cursor');

var Type = function (instance) {
  if (!(this instanceof Type))
    return new Type(instance);

  var self = this;

  this._instance = instance;

  Object.defineProperty(this, 'kind', {
    get: function () {
      return self._instance.kind;
    }
  });

  Object.defineProperty(this, 'spelling', {
    get: function () {
      return lib.clang_getTypeKindSpelling(self._instance.kind);
    }
  });

  Object.defineProperty(this, 'result', {
    get: function () {
      return new Type(lib.clang_getResultType(self._instance));
    }
  });

  Object.defineProperty(this, 'canonical', {
    get: function () {
      return new Type(lib.clang_getCanonicalType(self._instance));
    }
  });

  Object.defineProperty(this, 'argTypes', {
    get: function () {
      return lib.clang_getNumArgTypes(self._instance);
    }
  });

  Object.defineProperty(this, 'declaration', {
    get: function () {
      var c = lib.clang_getTypeDeclaration(self._instance);
      return new Cursor(c);
    }
  });

  Object.defineProperty(this, 'pointeeType', {
    get: function () {
      return new Type(lib.clang_getPointeeType(self._instance));
    }
  });

  this.getArg = function (arg) {
    return new Type(lib.clang_getArgType(self._instance, arg));
  };

  this.isPOD = function () {
    return lib.clang_isPODType(self._instance);
  };
};

module.exports = Type;
