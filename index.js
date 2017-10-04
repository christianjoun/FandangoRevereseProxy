var bodyParser = require('body-parser');
var	crypto  = require('crypto');
var request = require('request');
var express = require('express');
var	app		= express();
var config	= require('./config');

// app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.send('Fandango ES6 Proxy'));

app.get('/api.fandango.com/v1', handleProxyGet);

app.post('/api.fandango.com/v1', handleProxyPost);

app.get('/*', (req, res) => res.status(404).send('404 Not found'));

function handleProxyGet(req, res) {
  // Check for API key, say no if not present
  if (!req.query.apikey) {
    res.status(403).json({ error: 'no apikey' });
  } else {
    requestURL = 'http://api.fandango.com/v1?'
       + req.url.split('?')[1]
       + '&sig='
       + signature(req.query.apikey);

    var options = {
      url: requestURL,
      headers: { accept: 'application/json' },
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json(JSON.parse(body));
      }
    });
  }
}

function handleProxyPost(req, res) {
  // Check for API key, say no if not present
  if (!req.body.apikey) {
    res.status(403).json({ error: 'no apikey' });
  } else {
    requestURL = 'http://api.fandango.com/v1?'

       // + 'apikey=' + req.body.apikey
       + '&sig='
       + signature(req.body.apikey);

    var options = {
      url: requestURL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',

        // 'Content-Length': postData.length, //?
      },
      form: req.body,
    };

    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.header('Access-Control-Allow-Origin', '*');
        if (body !== '') res.status(200).json(JSON.parse(body));
        else res.status(200).json({});
      } else {
        console.log(error);
        console.log(response.statusCode);
        res.send(error);
      }
    });
  }
}

function signature(apiKey) {
  var seconds         = Math.floor(new Date() / 1000);
  var paramsToEncode  = apiKey + config.sharedSecret + seconds;
  var encodedParams   = sha256Encode(paramsToEncode);
  return encodedParams;
}

function sha256Encode(stringToEncode) {
  var result = crypto.createHash('sha256').update(stringToEncode).digest('hex');
  return result;
}

app.listen(7575, function () {
  console.log('Server created and listening on port 7575');
});

