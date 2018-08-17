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

Layer.prototype.handle_request = function (req, res) {
  let fn = this.handle;

  if (fn) {
    fn(req, res);
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
Route.prototype.get = function (fn) {
  let item = new RouteItem("get", fn);

  this.methods["get"] = true;
  this.stack.push(item);

  return this;
}
Route.prototype.dispatch = function (req, res) {
  let self = this,
      method = req.method.toLowerCase();

  for(let i = 0,len = this.stack.length;i < len;i++) {
    if (method === this.stack[i].method) {
      return this.stack[i].fn(req, res);
    }
  }
}
let RouteItem = function (method, fn) {
  this.method = method;
  this.fn = fn;
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
  this.stack = [
    new Layer(
      "*",
      function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("404");
      }
    )
  ];
};

Router.prototype.route = function (path) {
  let route = new Route(path);
  let layer = new Layer(path, function (req, res) {
    route.dispatch(req, res);
  })

  layer.route = route;
  this.stack.push(layer);

  return route;
}

Router.prototype.get = function (path, fn) {
  let route = this.route(path);
  route.get(fn);

  return this;
};

Router.prototype.handle = function (req, res) {
  let method = req.method;
  for (let i = 1, len = this.stack.length; i < len; i++) {
    let curLayer = this.stack[i];
    if (curLayer.match(req.url) && curLayer.route && curLayer.route.has_method(method)) {
      return this.stack[i].handle_request(req, res);
    }
  }
  // 没有匹配的就用默认的this.stack[0]的处理函数
  return this.stack[0].handle_request(req, res);
}

http.METHODS.forEach(m => {
  m = m.toLowerCase();
  Router.prototype[m] = function (path, fn) {
    let route = this.route(path);
    route[m].call(route, fn);

    return this;
  }
})

module.exports = Router;