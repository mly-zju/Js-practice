var MyPromise = require('./index.js');

var fn = function(resolve, reject) {
  resolve('hello');
}

var p = new MyPromise(fn);
p.then(function(data) {
  console.log(data);
  return 'hello again';
}).then(function(data) {
  console.log(data);
  return new MyPromise(function(resolve, reject) {
    reject('hello third time!');
  });
}).then(function(data) {
  console.log(data);
}, function(data) {
  console.log(data, ' from reject');
});

var fs = require('fs');

var p2 = new MyPromise(function(resolve) {
  fs.readFile('./test.txt', function(err, data) {
    resolve(data);
  });
}).then(function(data) {
  console.log(data.toString());
});
