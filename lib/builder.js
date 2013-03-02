var Emitter = require('events').EventEmitter;
var path = require('path');
var join = path.join;
var fs = require('fs');
var walk = require('walkdir');
var resolve = path.resolve;
var debug = require('debug')('builder');
var isArray = Array.isArray;
var Batch = require('batch');
var inherits = require('util').inherits;
var utils = require('./utils');
var log = utils.log;

/**
 * The builder takes an array of lookup paths
 * and builds the options needed to run the Sass
 * executable. It adds packages as load paths and 
 * adds any ruby scripts that might be needed.
 *
 * The builder will look through the paths and add 
 * the components inside, allowing you to import
 * files in them inside your Sass.
 *
 * @param {Object} options
 */

function Builder(options) {
  this.paths = options.paths;
}

/*
 * Make it an event emitter
 */

inherits(Builder, Emitter);

/**
 * Build the component. This emits an 'end'
 * event which passes through the arguments
 * it has constructed for running the Sass
 * command-line tool.
 * 
 * @param  {Function} callback Optional callback
 * @return {Builder}
 */

Builder.prototype.build = function(callback) {
  var self = this;
  var batch = new Batch();
  this.args = [];
  debug('Paths: %s', this.paths);

  // TODO: Kill this pyramid of doom
  // Loop over each path and look at each folder
  this.paths.forEach(function(path){
    self.addLoadPath(path);
    batch.push(function(done){
      var walker = walk.walk(path, {
        'no_recurse': true
      });
      walker.on('directory', function(filename, stat) {
        self.addFolder(filename);
      });
      walker.on("error", function (path, error) {
        debug('Skipped: %s', path);
      });
      walker.on("end", function(){
        done();
      });
    });
  });

  batch.end(function(){
    debug('Build finished: %s', self.args);
    self.emit('end', self.args);
    if(callback) callback(self.args);
  });

  return this;
};

/**
 * Add a folder to the builder. This adds a package
 * directory by looking at it's manifest and adding
 * load paths and anything else it needs to do.
 * 
 * @param {String} folder Path to the folder
 */
Builder.prototype.addFolder = function(folder) {
  var self = this;
  var conf = resolve(join(folder, 'component.json'));

  // Get the component.json data
  try {
    var manifest = require(conf);
  }
  catch(err) {
    debug('Missing component.json. Skipping: %s', folder);
    return;
  }
  
  log('Adding', manifest.name);

  // Add the component as a load path
  this.addLoadPath(folder);

  // Require ruby libraries to allow
  // for custom Sass functions
  if(isArray(manifest.ruby)) {
    manifest.ruby.forEach(function(file){
      self.addRequire(resolve(join(folder, file)));
    });
  }
};

/**
 * Add a Sass load path. This will allow @imports
 * to look inside these folders
 * @param {String} path Path to a folder
 */

Builder.prototype.addLoadPath = function(folder) {
  this.args.push(['--load-path', folder]);
  debug('Adding load path: %s', folder);
};

/**
 * Require a ruby file that will be required. This allows
 * packages to contain Ruby files that extend Sass' functionality
 * @param {String} file Path to a ruby file
 */

Builder.prototype.addRequire = function(file) {
  if(file.indexOf('.rb') === -1) {
    debug('Attempting to require a non-ruby file: %s', file);
    return;
  }
  this.args.push(['--require', file]);
  debug('Adding Ruby: %s', file);
};

/*
 * Export
 */

module.exports = Builder;