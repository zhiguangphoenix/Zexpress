const http = require("http");
const Layer = require("./layer");
const Route = require("./route");

/**
 * 
 * Router类，最开始处理request请求的地方
 * 不同的path会在Router.stack中加入不同的Layer
 * 
 */


let Router = function () {
  this.stack = [];

  if (!(this instanceof Router)) {
    return new Router();
  }
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

// router的use，直接添加一个route为空的layer
Router.prototype.use = function (fn) {
  let path = "/";

  if (typeof fn !== "function") {
    path = fn;
    fn = arguments[1];
  }

  let layer = new Layer(path, fn);
  layer.route = undefined;

  this.stack.push(layer);

  console.log(this.stack);
  
  return this;
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
