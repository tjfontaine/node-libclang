var path = require('path');

module.exports = require(path.join(__dirname, '..', 'compiled', process.platform, process.arch, 'libclang'));