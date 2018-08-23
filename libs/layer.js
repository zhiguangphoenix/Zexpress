/**
 * 
 * Layer类，与path对应
 * 
 */

function Layer(path, fn) {
  this.handle = fn;
  this.name = fn.name || "<anonymous>";
  this.path = undefined;

  this.fast_star = path === "*" ? true : false;

  if (!this.fast_star) {
    this.path = path;
  }
}

Layer.prototype.handle_request = function (req, res, next) {
  console.log("handle_request");

  let fn = this.handle;

  try {
    fn(req, res, next);
  } catch (error) {
    next(error);
  }
}

Layer.prototype.match = function (path) {

  // 该layer为*匹配
  if (this.fast_star) {
    this.path = "";
    return true;
  }

  // 普通路由
  if (this.route && this.path === path.slice(-this.path.length)) {
    return true;
  }

  // 中间件
  if (!this.route) {
    // 不带路径的中间件
    if (this.path === "/") {
      this.path = "";
      return true;
    }
    // 带路径的中间件
    if (this.path === path.slice(0, this.path.length)) {
      return true;
    }
  }

  return false;
}

Layer.prototype.handle_error = function (error, req, res, next) {
  console.log("handle_error");
  
  // 如果该中间件是错误处理中间件，则运行该中间件的方法
  // 否则，把err向下一个中间件传递，next(err)
  let fn = this.handle;

  if (fn.length !== 4) {
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {    
    next(err);
  }
}

module.exports = Layer;