'use strict';

var compile = require('../lib/compiler.js');

exports['Compiler'] = {
  'it should build Sass CLI arguments': function(test) {
    var args = compile.command({
      input: 'foo.scss',
      output: 'bar.css',
      style: 'compressed',
      lineNumbers: true
    });
    test.equal(args, 'sass foo.scss bar.css --style compressed --line-numbers');
    test.done();
  },
};
