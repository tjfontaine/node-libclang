#!/usr/bin/env node

var generate = require('../lib/generateffi').generate;
var jsb = require('js-beautify');
var argv = require('optimist')
  .usage('Generate node-ffi bindings for a given header file\nUsage: $0')
  .demand('f').alias('f', 'file').describe('f', 'The header file to parse')
  .demand('l').alias('l', 'library').describe('l', 'The name of the library to dlopen')
  .alias('m', 'module').describe('m', 'The name of module the bindings will be exported as')
  .boolean('x').alias('x', 'file_only').describe('x', 'Only export functions found in this file')
  .alias('p', 'prefix').describe('p', 'Only import functions whose name start with prefix')
  .boolean('s').alias('s', 'strict').describe('s', 'Use StrictType (experimental)')
  .argv

var ret = generate({
  filename: argv.f,
  library: argv.l,
  module: argv.m,
  prefix: argv.p,
  compiler_args: argv._,
  strict_type: argv.s,
  single_file: argv.x,
});

console.log(jsb.js_beautify(ret.serialized));

if (generate.unmapped) {
  process.stderr.write("-------Unmapped-------\r\n");
  process.stderr.write(generate.unmapped + '\r\n');
}
