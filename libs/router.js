const http = require("http");

/**
 * 
 * Layer类，与path对应
 * 
 */

function Layer(path, fn) {
  this.handle = fn;
  this.name = fn.name || "<anonymous>";
  this.path = path;
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
  if (path === this.path || path === "*") {
    return true;
  }

  return false;
}


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





/**
 * 
 * Router类，最开始处理request请求的地方
 * 不同的path会在Router.stack中加入不同的Layer
 * 
 */


let Router = function () {
  this.stack = [];
};

Router.prototype.route = function (path) {
  let route = new Route(path);
  let layer = new Layer(path, route.dispatch.bind(route))

  layer.route = route;
  this.stack.push(layer);
  return route;
}

Router.prototype.handle = function (req, res, done) {
  let method = req.method,
      index = 0,
      stack = this.stack;

  function next(error) {
    console.log("router next");
    // error是router的情况下，直接返回done
    let layerError = (error === "route" ? null : error);

    // 跳过路由系统
    if (layerError === "router") {
      return done(null);
    }

    // router.stack里面的layer已经执行完了或者上一步传来了错误
    if (index >= stack.length || layerError) {
      return done(layerError);
    }

    let layer = stack[index++];
    // 匹配，执行
    if (layer.match(req.url) && layer.route && layer.route.has_method(method)) {
      
      return layer.handle_request(req, res, next);
    } else {
      next(layerError);
    }
  }

  next();
}

// 为router生成相应的http方法的处理函数
http.METHODS.forEach(m => {
  m = m.toLowerCase();
  Router.prototype[m] = function (path, fn) {
    // router对象注册路由的本质：
    //    根据req.path生成一个Layer，并且生成一个route挂载在Layer上，layer.route，然后layer进栈router.stack.push(layer)
    //    根据req.method生成一个routeItem，且layer.stack.push(routeItem)
    let route = this.route(path);
    route[m].call(route, fn);
    
    return this;
  }
})

module.exports = Router;
