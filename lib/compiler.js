'use strict';

var exec = require('child_process').exec;

module.exports = function(options, callback) {
  var command = module.exports.command(options);
  exec(command, callback);
};

module.exports.command = function(options) {
  var args = [];

  if( options.style ) {
    args.push(['--style', options.style]);
  }

  if(options.lineNumbers) {
    args.push(['--line-numbers']);
  }

  (options.require || []).forEach(function(file){
    args.push(['--require', file]);
  });

  (options.loadPaths || []).forEach(function(path){
    args.push(['--load-path', path]);
  });

  args.unshift([options.output]);
  args.unshift([options.input]);
  args.unshift(['sass']);

  return args.map(function(arg){
    return arg.join(' ');
  }).join(' ');
};