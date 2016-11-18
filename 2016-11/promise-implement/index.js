function MyPromise(fn){
  var self=this;

  this.value=undefined;
  this.status='pending';
  this.resolveFunc=function(){};
  this.rejectFunc=function(){};

  fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.exec=function(){
  if(this.status=='fulfilled'){
    this.resolveFunc(this.value);
  }else{
    this.rejectFunc(this.value);
  }
}

MyPromise.prototype.resolve=function(val){
  this.value=val;
  this.status='fulfilled';
  setTimeout(this.exec.bind(this),0);
}

MyPromise.prototype.reject=function(val){
  this.value=val;
  this.status='failed';
  setTimeout(this.exec.bind(this),0);
}

MyPromise.prototype.then=function(resolve){
  //this.resolveFunc=resolve;
  // return this;
  var self=this;
  return new Promise(function(rel,rej){
    function callback(){
      var ret=resolve(self.value);
      if(ret&&typeof ret['then']==='function'){
        ret.then(rel);
      }else{
        rel(ret);
      }
    }
    self.resolveFunc=callback;
  });
}

MyPromise.prototype.catch=function(reject){
  this.rejectFunc=reject;
  return this;
}

function test(resolve, reject) {
    var timeOut = Math.random() * 2;
    console.log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1.5) {
            console.log('call resolve()...');
            resolve('200 OK');
        }
        else {
            console.log('call reject()...');
            reject('timeout in ' + timeOut + ' seconds.');
        }
    }, timeOut * 1000);
}

var run=new MyPromise(test).then(function(data){
  console.log(data);
  return new MyPromise(test);
}).then(function(data){
  console.log(data+' again!');
  return 'end!';
}).then(function(data){
  console.log(data);
});
