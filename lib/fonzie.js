var Package = require('./Package');
var registry = require('./registry');

exports.install = function(pkg, version, options) {
  return new Package(pkg, version, options);
};

exports.getPackageData = function(name, callback) {
  return registry.get(name, callback);
};