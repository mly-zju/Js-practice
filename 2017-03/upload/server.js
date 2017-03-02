var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

var server = http.createServer(function(req, res) {
  var urlObj = url.parse(req.url, true);
  var path = urlObj.pathname;
  var params = urlObj.query;
  var cache = [];
  if (path == '/') {
    var rs = fs.createReadStream('./index.html');
    rs.pipe(res);
  } else if (path == '/upload') {

    // req.on('data', function(chunk) {
    //   cache.push(chunk);
    // });
    // req.on('end', function() {
    //   var buf = Buffer.concat(cache);
    //   req.rawBody = buf.toString();
    //   handle(req, res);
    // });
    handle(req, res);

    function handle(req, res) {
      if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        req.body = querystring.parse(req.rawBody);
        for (var key in req.body) {
          console.log(key + ': ' + req.body[key]);
        }
        res.end('submit succeed!');
      } else if (req.headers['content-type'] == 'application/json') {
        req.body = JSON.parse(req.rawBody);
        for (var key in req.body) {
          console.log(key + ': ' + req.body[key]);
        }
        res.end('json submit succeed!');
      } else if (req.headers['content-type'].split(';')[0] == 'multipart/form-data') {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('field', function(name, value) {
          console.log(name + ': ' + value);
        });
        form.on('file', function(name, file) {
          var path = file.path;
          fs.readFile(path, function(err, data) {
            if (err) {
              return console.log(err);
            }
            console.log(data.toString());
          })
        });
        res.end('ok!');
      }
    }
  }
});

server.listen(8080);
