const http = require("http");
const Layer = require("./layer");
const Route = require("./route");

/**
 * 
 * Router类，最开始处理request请求的地方
 * 不同的path会在Router.stack中加入不同的Layer
 * 
 */

// router统一放置带原型上
let proto = {};

proto.handle = function (req, res, done) {
  let method = req.method,
      index = 0,
      stack = this.stack;

  let removed = "", slashAdded = false;

  // 获取当前父路径
  let parentUrl = req.baseUrl || "";
  
  // 保存父路径
  req.baseUrl = parentUrl;

  // 保存原始路径
  req.originalUrl = req.originalUrl || req.url;

  function next(error) {
    console.log("router next");
    // error是router的情况下，直接返回done
    let layerError = (error === "route" ? null : error);

    if (slashAdded) {
      req.url = "";
      slashAdded = false;
    }

    if (removed.length !== 0) {
      req.baseUrl = parentUrl;
      req.url = removed + req.url;
      removed = "";
    }

    // 跳过路由系统
    if (layerError === "router") {
      return done(null);
    }
    
    // router.stack里面的layer已经执行完了或者上一步传来了错误
    if (index >= stack.length) {
      return done(layerError);
    }

    let path = require("url").parse(req.url).pathname;

    let layer = stack[index++];
    // 匹配，执行
    // URL匹配成功，说明可能是中间件或者路由
    if (layer.match(path)) {
      // 处理中间件
      if (!layer.route) {
        // 要移除的部分路径
        removed = layer.path;

        // 设置当前路径
        req.url = req.url.substr(removed.length);
        if (req.url === "") {
          req.url = "/" + req.url;
          slashAdded = true;
        }

        // 设置当前路径的父路径
        req.baseUrl = parentUrl + removed;

        if (layerError) {
          layer.handle_error(layerError, req, res, next);
        } else {
          layer.handle_request(req, res, next);
        }
      } else if (layer.route.has_method(method)) {
        // 处理路由
        layer.handle_request(req, res, next);
      }
    } else {
      // URL匹配不成功，说可能是错误处理函数
      layer.handle_error(layerError, req, res, next);
    }
  }

  next();
}

proto.route = function (path) {
  let route = new Route(path);
  let layer = new Layer(path, route.dispatch.bind(route))

  layer.route = route;
  this.stack.push(layer);
  return route;
}

// router的use，直接添加一个route为空的layer
proto.use = function (fn) {
  let path = "/";

  if (typeof fn !== "function") {
    path = fn;
    fn = arguments[1];
  }

  let layer = new Layer(path, fn);
  layer.route = undefined;

  this.stack.push(layer);

  return this;
}

// 为router生成相应的http方法的处理函数
http.METHODS.forEach(m => {
  m = m.toLowerCase();
  proto[m] = function (path, fn) {
    // router对象注册路由的本质：
    //    根据req.path生成一个Layer，并且生成一个route挂载在Layer上，layer.route，然后layer进栈router.stack.push(layer)
    //    根据req.method生成一个routeItem，且layer.stack.push(routeItem)
    let route = this.route(path);
    route[m].call(route, fn);
    
    return this;
  }
})


module.exports = function () {
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // 等同于router.__proto__ = proto;
  Object.setPrototypeOf(router, proto);

  router.stack = [];
  return router;
}