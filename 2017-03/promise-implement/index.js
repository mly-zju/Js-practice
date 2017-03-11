function MyPromise(fn) {
  this.value;
  this.status = 'pending';
  this.resolveFunc = function() {};
  this.rejectFunc = function() {};
  fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function(val) {
  var self = this;
  if (this.status == 'pending') {
    this.status = 'resolved';
    this.value = val;
    setTimeout(function() {
      self.resolveFunc(self.value);
    }, 0);
  }
}

MyPromise.prototype.reject = function(val) {
  var self = this;
  if (this.status == 'pending') {
    this.status = 'rejected';
    this.value = val;
    setTimeout(function() {
      self.rejectFunc(self.value);
    }, 0);
  }
}

MyPromise.prototype.then = function(resolveFunc, rejectFunc) {
  var self = this;
  return new MyPromise(function(resolve_next, reject_next) {
    function resolveFuncWrap() {
      var result = resolveFunc(self.value);
      if (result && typeof result.then === 'function') {
        //如果result是MyPromise对象，则通过then将resolve_next和reject_next传给它
        result.then(resolve_next, reject_next);
      } else {
        //如果result是其他对象，则作为参数传给resolve_next
        resolve_next(result);
      }
    }
    function rejectFuncWrap() {
      var result = rejectFunc(self.value);
      if (result && typeof result.then === 'function') {
        //如果result是MyPromise对象，则通过then将resolve_next和reject_next传给它
        result.then(resolve_next, reject_next);
      } else {
        //如果result是其他对象，则作为参数传给resolve_next
        resolve_next(result);
      }
    }
    self.resolveFunc = resolveFuncWrap;
    self.rejectFunc = rejectFuncWrap;
  })
}

module.exports = MyPromise;
