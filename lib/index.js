const request = require('request');
const util    = require('util');

function devLog() {
  if (process.env.DEBUG)
    console.log(arguments);
}

const apiEndPointURL	   = 'https://api.gifs.com/media';
const importAPIEndPointURL = util.format('%s/import', apiEndPointURL);
const uploadAPIEndPointURL = util.format('%s/upload', apiEndPointURL);

function fullAPIURL(headURL, route) {
  route = ((route || '') + '').replace(/\/+/, '/');
  if (route.length < 1)
    return headURL;

  route = route.replace(/\s+|\/+$/, '');
  urlStr = headURL + '/' + route;
  devLog('fullAPIURL', urlStr);
  return urlStr;
}

function fullImportURL(route) {
  return fullAPIURL(importAPIEndPointURL, route);
}

function fullUploadURL(route) {
  return fullAPIURL(uploadAPIEndPointURL, route);
}

function post(urlStr, opts, callback) {
  opts = util.isObject(opts) ? opts : {'source': opts + ''};
  devLog('urlStr', urlStr, 'opts', opts);

  request.post(urlStr, opts, function(err, res, body) {
    if (err)
      return callback(500, err);

    if (res.statusCode != 200)
      return callback(res.statusCode, res);

    callback(200, body);
  });
}

function returnOrCallback(status, response, callback) {
  if (util.isFunction(callback))
    return callback(status, response);

  return {
    status: status,
    response: response,
  };
}

function upload(urlStr, opts, callback) {
  opts = util.isObject(opts) ? opts : {};
  var params = {};
  var metaData = null;
  if (!util.isObject(opts))
    return returnOrCallback(400, 'an object expected for opts', callback);
    
  if (!opts.meta) {
    params.formData = opts;
  } else {
    params.qs = opts.meta; 

    if (!opts.formData)
      return returnOrCallback(400, 'formData expected when using a nested object', callback);

    params.formData = opts.formData;
  }

  return post(urlStr, params, callback);
}

function Upload(route, opts, callback) {
  return upload(fullUploadURL(route), opts, callback);
}

function Import(route, opts, callback) {
  return post(fullImportURL(route), opts, callback);
}

module.exports = function(context) {
    var subRoutesToComplete = ['', 'mp4', 'webm', 'gif'];    
    var mapping = {
      import: Import,
      upload: Upload,
    };

    var exporter = {};

      for (var key in mapping) {
	var mappedFn = mapping[key];
	var urlPrefix = util.format('%s', key);
	subRoutesToComplete.forEach(function(route) {
	  var objectKey = util.format('%s%s', urlPrefix, (route+'').toUpperCase());

	  var fn = function(route, fn) { return function(opts, callback) { fn(route, opts, callback) }};

	  exporter[objectKey] = fn(route, mappedFn);
	});
      }

    devLog('exporter', exporter);
    return exporter;
};
