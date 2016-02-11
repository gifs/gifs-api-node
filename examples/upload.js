/*
 * node upload.js *.gif
 */
const gifs = require('gifs-api');
const fs   = require('fs');

function main(argv) {
  argv.forEach(function(arg) {
    fs.readFile(arg, function(err, stream) {
      if (err)
	throw err;

      gifs.upload({file: stream}, function(status, response) {
	console.log('filepath', arg, 'status', status, response);
      });
    });
  });
}


if (process.argv.length >= 2) {
  main(process.argv.slice(2));
}
