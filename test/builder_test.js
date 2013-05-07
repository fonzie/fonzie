'use strict';

var Builder = require('../lib/builder.js');
var fs = require('fs');
var fixtures = __dirname + '/fixtures';

exports['builder'] = {
  setUp: function(done) {
    this.builder = new Builder({
      dir: fixtures + '/project'
    });
    process.chdir(this.builder.dir);
    done();
  },
  'it should have a base directory': function(test) {
    test.ok(this.builder.dir);
    test.done();
  },
  'it should get the path of files relative to the base directory': function(test) {
    test.ok(this.builder.path('bower.json') === fixtures + '/project/bower.json');
    test.done();
  },
  'it should get all the dependencies': function(test) {
    this.builder.getDependencies(function(err, packages){
      test.ifError(err);
      test.equal(packages.length, 3);
      test.done();
    });
  },
  'it should get all of the combined load paths': function(test) {
    var builder = this.builder;
    builder.getDependencies(function(err, packages){
      test.ifError(err);
      var paths = builder.getLoadPaths(packages);
      test.equal(paths.length, 5);
      test.done();
    });
  },
  'it should get all of the required files': function(test) {
    var builder = this.builder;
    builder.getDependencies(function(err, packages){
      test.ifError(err);
      var paths = builder.getRequires(packages);
      test.equal(paths.length, 2);
      test.done();
    });
  },
  'it should create the build directory': function(test) {
    var self = this;
    this.builder.build().on('end', function(err){
      test.ifError(err);
      fs.exists(self.builder.output, function(exists){
        test.ok(exists);
        test.done();
      });
    });
  },
  'it should symlink the asset directories in dev mode': function(test) {
    this.builder.dev = true;
    this.builder.build().on('end', function(err){
      test.ifError(err);
      test.done();
    });
  }
};
