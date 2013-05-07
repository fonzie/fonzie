'use strict';

var Package = require('../lib/package.js');
var fixtures = __dirname + '/fixtures';
var path = require('path');

exports['Package'] = {
  setUp: function(done) {
    this.package = new Package({
      dir: fixtures + '/project'
    });
    done();
  },
  'it should throw an error if it cant load the manifest': function(test) {
    test.throws(function(){
      new Package({ dir: 'none' });
    });
    test.done();
  },
  'it should throw an error if the package doesnt have a name': function(test) {
    test.throws(function(){
      new Package({ dir: path.join(fixtures, 'unnamed') });
    });
    test.done();
  },
  'it should have a manifest': function(test) {
    test.ok(this.package.getManifest());
    test.done();
  },
  'it should get the path of files relative to the base directory': function(test) {
    test.ok(this.package.path('bower.json') === fixtures + '/project/bower.json');
    test.done();
  },
  'it should have a name': function(test) {
    test.ok(this.package.getName() === 'test');
    test.done();
  },
  'it should load the config': function(test) {
    test.ok(this.package.getConfig());
    test.done();
  },
  'it should get the dependencies': function(test) {
    test.deepEqual(this.package.getDependencies(), [ "test" ]);
    test.done();
  },
  'it should get the bundled dependencies': function(test) {
    var bundled = this.package.getBundledDependencies();
    test.equal(bundled.length, 1);
    test.ok(bundled[0].constructor === Package);
    test.done();
  },
  'it should have load paths': function(test) {
    var paths = this.package.getLoadPaths();
    test.equal(paths.length, 3);
    test.done();
  },
  'it should get the requires': function(test){
    var files = this.package.getRequires();
    test.equal(files.length, 1);
    test.done();
  },
  'it should normalize asset paths': function(test){
    test.deepEqual(this.package.normalizeAssetPaths('foo'), [
      { name: 'test', path: this.package.dir + '/foo' }
    ]);
    test.deepEqual(this.package.normalizeAssetPaths({ 'foo': 'bar' }), [
      { name: 'foo', path: this.package.dir + '/bar' }
    ]);
    test.done();
  },
  'it should get the asset paths': function(test){
    var paths = this.package.getAssetPaths();
    test.deepEqual(paths,[
      { name: 'test', path: this.package.dir + '/assets' },
      { name: 'foo', path: this.package.dir + '/local/two/foo' },
      { name: 'bar', path: this.package.dir + '/local/two/bar' }
    ]);
    test.done();
  }
};
