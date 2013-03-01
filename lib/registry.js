var request  = require('request');
var endpoint = 'https://fonzie.herokuapp.com/packages';
var debug = require('debug')('registry');

exports.register = function (manifest, callback) {

  var body = {
    name: manifest.name,
    description: manifest.description,
    repo: manifest.repo,
    author: manifest.author
  };

  request.post({url: endpoint, form: body}, function (err, response) {
    if (err) return callback(err);

    if (response.statusCode === 406) {
      return callback(new Error('Duplicate package'));
    }

    if (response.statusCode === 400) {
      return callback(new Error('Incorrect format'));
    }

    if (response.statusCode !== 201) {
      return callback(new Error('Unknown error: ' + response.statusCode));
    }

    callback();
  });
};

exports.search = function (name, callback) {
  var results = [];

  request.get(endpoint + '/search/' + encodeURIComponent(name), function (err, response, body) {

    if (err || (response.statusCode !== 200 && response.statusCode !== 404)) {
      return callback(err || new Error(name + ' failed to look up for endpoint: ' + endpoint));
    }

    if (response && response.statusCode !== 404) {
      var array = body && JSON.parse(body);
      for (var x = 0; x < array.length; x += 1) {
        var pkg = array[x];
        results.push({ 
          name: pkg.name, 
          url: 'https://github.com/' + pkg.repo,
          description: pkg.description,
          author: pkg.author
        });
      }
    }

    return callback(null, results);
  });
};

exports.get = function (name, callback) {
  var url = endpoint + '/' + encodeURIComponent(name);
  debug('Fetching ' + url);
  request.get(url, function (err, response, body) {
    if( response.statusCode === 200 ) {
      debug('Fetched ' + body);
      return callback(null, JSON.parse(body));
    }
    else {
      return callback(err || new Error(name + ' failed to look up for endpoint: ' + endpoint));
    }
  });
};