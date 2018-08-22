const http = require("http");

/**
 * 
 * Route类，与path对应，同一个path的不同method会加入Route.stack
 * Route会挂载到Layer上
 * 
 * */

let Route = function (path) {
  this.path = path;
  this.stack = [];

  this.methods = {};
}

Route.prototype.has_method = function (method) {
  let name = method.toLowerCase();
  return Boolean(this.methods[name]);
}

Route.prototype.dispatch = function (req, res, done) {
  console.log("dispatch");

  let method = req.method.toLowerCase(),
    index = 0,
    stack = this.stack;

  function next(error) {
    console.log("route next");

    // 跳过route
    if (error && error === "route") {
      return done();
    }

    // 跳过整个路由系统
    if (error && error === "router") {
      return done(error);
    }

    // 越界
    if (index >= stack.length) {
      return done(error);
    }

    let routerItem = stack[index++];
    if (method !== routerItem.method) {
      return next(error);
    }

    if (error) {
      // 主动报错
      // return done(error);
      routerItem.handle_error(error, req, res, next);
    } else {
      routerItem.handle(req, res, next);
    }
  }

  next();
}

let RouteItem = function (method, fn) {
  this.method = method;
  this.fn = fn;
}

RouteItem.prototype.handle = function (req, res, next) {
  console.log("routeItem handle");

  let fn = this.fn;

  try {
    fn(req, res, next);
  } catch (error) {
    // 带着错误next
    next(error);
  }
}

// 错误处理函数
RouteItem.prototype.handle_error = function (error, req, res, next) {
  let fn = this.hanlde;

  if (fn.length !== 4) {
    return next(error);
  }

  try {
    fn(error, req, res, next);
  } catch (err) {
    next(err);
  }
}


http.METHODS.forEach(m => {
  m = m.toLowerCase();

  Route.prototype[m] = function (fn) {
    let item = new RouteItem(m, fn);

    this.methods[m] = true;
    this.stack.push(item);

    return this;
  }
})


module.exports = Route;