// Get the file that is going to be built
// Create a process for the sass command
// Add some load paths
// Add require any ruby files
// Run the sass command
// nested (default), compact, compressed, or expanded.

var Emitter = require('events').EventEmitter;
var fonzie = require('./fonzie');
var fs = require('fs');
var path = require('path');
var walk = require('walk');
var join = path.join;
var resolve = path.resolve;
var debug = require('debug')('builder');
var isArray = Array.isArray;
var Batch = require('batch');

module.exports = function(paths) {
  var emitter = new Emitter();
  var args = [];
  var batch = new Batch();

  // Loop over each path and look at each folder
  paths.forEach(function(path){
    args.push(['--load-path', path]);
    batch.push(function(done){
      walker = walk.walk(path);
      walker.on('directory', function(root, dir, next) {
        processFolder(join(root, dir.name), args);
        next();
      });
      walker.on("errors", function (root, nodeStatsArray, next) {
        next();
      });
      walker.on("end", function(){
        done();
      });
    });
  });

  batch.end(function(){
    emitter.emit('end', args);
  });

  return emitter;
};

// Process a component folder
function processFolder(folder, args) {
  debug('Processing: %s', folder);

  var manifest = path.resolve(join(folder, 'component.json'));

  // Require ruby libraries
  if(isArray(manifest.require)) {
    manifest.require.forEach(function(file){
      debug('Requiring: %s', file);
      args.push(['--require', file]);
    });
  }

  // Add the component as a load path
  args.push(['--load-path', folder]);
}