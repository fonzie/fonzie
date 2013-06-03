'use strict';

var path = require('path');
var fs = require('fs-extra');
var _ = require('underscore');

function Package(options) {
  this.dir = options.dir;
  this.manifest = this.loadManifest();
  this.config = this.manifest.fonzie || {};
  this.validate(this.manifest);
}

Package.prototype.toString = function() {
  return this.dir;
};

Package.prototype.validate = function(manifest) {
  if(!manifest.name) {
    throw new Error('Package missing field "name" in ' + this.dir);
  }
};

Package.prototype.loadManifest = function() {
  try {
    return require(this.path('bower.json'));
  }
  catch(e) {
    throw new Error('Failed to load bower.json for package : ' + this.dir);
  }
};

Package.prototype.getName = function() {
  return this.manifest.name;
};

Package.prototype.getVersion = function() {
  return this.manifest.version;
};

Package.prototype.getMain = function() {
  return this.path(this.manifest.main || 'index.scss');
};

Package.prototype.path = function(file) {
  if(file) {
    return path.join(this.dir, file);
  }
};

Package.prototype.getManifest = function() {
  return this.manifest;
};

Package.prototype.getConfig = function() {
  return this.config;
};

Package.prototype.getBundledDependencies = function() {
  var bundled = this.config.bundledDependencies || [];
  var packages = bundled.map(function(path){
    return new Package({ dir: this.path(path) });
  }, this);
  return packages;
};

Package.prototype.getDependencies = function() {
  return this.manifest.dependencies ? Object.keys(this.manifest.dependencies) : [];
};

Package.prototype.getLoadPaths = function() {
  var paths = (this.config.paths || []).map(this.path, this);
  var bundled = (this.config.bundledDependencies || []).map(this.path, this);
  paths = paths.concat(bundled);
  paths.push(this.dir);
  paths = paths.map(function(path) {
    return path.replace(' ', '\\ ');
  });
  return paths;
};

Package.prototype.getRequires = function() {
  return (this.config.require || []).map(this.path, this);
};

/**
 * Takes the paths from the config and normalizes them.
 * YOu can set the asset paths as a string and it will use
 * the package name as the symlinked folder, or you can specify
 * a group of key:value pairs in the form symlinkName:path
 * @param  {String|Object} paths Paths from the config
 * @return {Object} Normalized paths
 */
Package.prototype.normalizeAssetPaths = function(paths) {
  var normalized = [];

  if( _.isString(paths) ) {
    normalized.push({ name: this.getName(), path: this.path(paths) });
    return normalized;
  }

  return _.map(paths, function(dir, name){
    return {
      name: name,
      path: this.path(dir)
    };
  }, this);
};

/**
 * Get the asset paths for this package and all bundled package
 * @return {Object}
 */
Package.prototype.getAssetPaths = function() {
  var paths = this.normalizeAssetPaths(this.config.assets || {});
  this.getBundledDependencies().forEach(function(bundled){
    paths = paths.concat(bundled.getAssetPaths());
  });
  return paths;
};

module.exports = Package;