/*
 * node import.js $(cat urls.txt)
 */

const gifs = require('gifs-api');

function main(argv) {
  argv.forEach(function(url) {
    gifs.import(url, function(status, response) {
      console.log('url', url, 'status', status, 'response', response);
    });
  });
}

if (process.argv.length >= 2) {
  main(process.argv.slice(2));
}
