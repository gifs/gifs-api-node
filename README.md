## gifs-api

Node.js API for gifs.com's public-api for importing media.

### Accepted media types:
- gif  -> image/gif.
- mp4  -> video/mp4.
- webm -> video/wemb.

### Routes:
- /import, takes in a source URL, sends it the API endpoint then imports it into gifs.com's API.
- /upload, takes a file/stream/binary-data in the form of a multipart-form, sends it to the API endpoint
then makes the equivalent files.

### Sample usage in code:

* Import any media, mp4, gif, webm

```javascript
const gifs = require('gifs-node');

const urls = ['https://giant.gfycat.com/ClutteredSevereCur.gif', 'https://fat.gfycat.com/JovialPerkyArmyant.webm', 'https://pbs.twimg.com/tweet_video/Ca0ztmfWIAAi-UX.mp4'];
urls.forEach(function(url) {
  gifs.import(url, function(status, response) {
    console.log('url', url, status, response);
  });
});

// Alternatively
urls.forEach(function(url) {
  gifs.import({source: url, attribution: {user: 'nbcsnl', site: 'twitter'}, title: '40th Anniversary SNL'}, function(status, response) {
    console.log('url', url, status, response);
  });
});
```

* To restrict importing, use:
- gifs.importMP4.
- gifs.importWEBM.
- gifs.importGIF.


* Upload any accepted media: mp4, gif, webm.

```javascript
const fs   = require('fs');
const gifs = require('gifs-node');
const glob = require('glob');

glob('**/*.mp4', function(err, mp4Matches) {
  if (err)
    throw err;

  mp4Matches.forEach(function(mp4Match) {
    fs.readFile(mp4Match, function(err, stream) {
      if (err)
	throw err;

      var form = {
	file: stream,
	title: mp4Match,
	attribution_url: 'https://mysite.com',
	attribution_user: 'yourself',
	attribution_name: 'mysite',
      };

      gifs.upload(form, function(status, response) {
	console.log('mp4Match', mp4Match, status, response);
      });
  });
});
```

* For stricter uploading, use:
- gifs.uploadMP4.
- gifs.uploadWEBM.
- gifs.uploadGIF.
