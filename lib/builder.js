'use strict';

var mkdir = require('mkdirp');
var async = require('async');
var path = require('path');
var Package = require('./package');
var compile = require('./compiler');
var bower = require('bower');
var Emitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');
var fs = require('fs-extra');

function Builder(options) {
  this.dir = options.dir;
  this.dev = options.dev || false;
  this.output = this.path(options.out || 'build');
  this.package = new Package({ dir: this.dir });
  this.options = options;
}

util.inherits(Builder, Emitter);

Builder.prototype.path = function(file) {
  return path.join(this.dir, file);
};

Builder.prototype.build = function() {
  var self = this;
  var emitter = new Emitter();
  this.getDependencies(function(err, packages){

    if(err) {
      return self.emit('error', err);
    }

    var input = this.package.getMain();
    var output = path.join(this.output, path.basename(input).replace(/\.(scss|sass)/, '')) + '.css';
    var loadPaths = this.getLoadPaths(packages);
    var files = this.getRequires(packages);

    var compileOptions = {
      input: input,
      output: output,
      loadPaths: loadPaths,
      require: files,
      style: self.options.style,
      lineNumbers: self.options.lineNumbers
    };

    emitter.emit('log', compileOptions, packages);

    return async.series([
      mkdir.bind(mkdir, self.output),
      compile.bind(compile, compileOptions),
      self.copyAssets.bind(self)
    ], function(err){
      emitter.emit('end', err);
    });
  });
  return emitter;
};

Builder.prototype.getDependencies = function(callback) {
  if( this._deps ) {
    return callback(null, this._deps);
  }
  var self = this;
  var packages = this.package.getBundledDependencies();
  packages.push(this.package);
  bower.commands.ls({ paths: true }).on('data', function(deps){
    Object.keys(deps).forEach(function(name){
      var dir = deps[name];
      if(path.extname(dir) !== "") {
        dir = path.dirname(dir);
      }
      var pack = new Package({
        dir: self.path(dir)
      });
      packages.push(pack);
      packages.concat(pack.getBundledDependencies());
    });
    self._deps = packages;
    callback.call(self, null, packages);
  });
};

Builder.prototype.copyAssets = function(callback) {
  async.each(this.package.getAssetPaths(), this.copyToAssetDirectory.bind(this), callback);
};

Builder.prototype.copyToAssetDirectory = function(asset, callback) {
  var dest = path.join(this.output, asset.name);
  var devMode = this.dev;
  if(devMode) {
    fs.symlink(asset.path, dest, function(err){
      if( !err || (err && err.code === "EEXIST") ) {
        return callback();
      }
      callback(err);
    });
  }
  else {
    fs.copy(asset.path, dest, callback);
  }
};

Builder.prototype.getLoadPaths = function(packages) {
  var loadPaths = [ this.path('components') ];
  packages.forEach(function(p){
    loadPaths = loadPaths.concat(p.getLoadPaths());
  });
  return _.unique(loadPaths);
};

Builder.prototype.getRequires = function(packages) {
  var files = [];
  packages.forEach(function(p){
    files = files.concat(p.getRequires());
  });
  return files;
};

module.exports = Builder;