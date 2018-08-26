const http = require("http");
const router = require("./router");
let request = require("./request");
let response = require("./response");
let middleware = require("../middleware/init");

function Application() { }

Application.prototype.listen = function (port, cb) {
  let server = http.createServer((req, res) => {
    this.handle(req, res);
  })

  return server.listen.apply(server, arguments);
}

Application.prototype.handle = function (req, res) {
  let done = function finalhandler(error) {
    res.writeHead(404, { "Content-Type": "text/plain" });

    if (error) {
      res.send("404 " + error);
    } else {
      let msg = "Cannot " + req.method + " " + req.url;
      res.end(msg);
    }
  }
  
  let router = this._router;
  if (router) {
    router.handle(req, res, done);
  } else {
    done();
  }
}

// Application.use是代理了router.Method
Application.prototype.use = function (fn) {
  let path = "/";

  if (typeof fn !== "function") {
    path = fn;
    fn = arguments[1];
  }

  // 惰性生成router
  this.lazyrouter();
  let router = this._router;

  router.use(path, fn);

  return this;
}

// 惰性路由初始化函数
Application.prototype.lazyrouter = function () {
  if (!this._router) {
    this._router = new router();

    this._router.use(middleware.init);
  }
}

// 为application对象生成http方法的处理函数
http.METHODS.forEach(m => {
  m = m.toLowerCase();
  Application.prototype[m] = function (path, fn) {
    // 惰性生成router
    this.lazyrouter();
    let router = this._router;
    // app注册路由的本质：调用router对象上的HTTP方法注册路由
    router[m].apply(router, arguments);
    
    return this;
  }
})

exports = module.exports = Application;