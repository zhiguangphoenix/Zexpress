const http = require("http");
const router = require("./router");
let request = require("./request");
let response = require("./response");


function Application() {
  this._router = new router();
}

Application.prototype.listen = function (port, cb) {
  let server = http.createServer((req, res) => {
    this.handle(req, res);
  })

  return server.listen.apply(server, arguments);
}

Application.prototype.handle = function (req, res) {
  Object.setPrototypeOf(req, request);
  Object.setPrototypeOf(res, response);

  let done = function finalhandler(error) {
    res.writeHead(404, { "Content-Type": "text/plain" });

    if (error) {
      res.send("404 " + error);
    } else {
      let msg = "Cannot " + req.method + " " + req.url;
      res.end(msg);
    }
  }
  this._router.handle(req, res, done);
}

// Application.use是代理了router.Method
Application.prototype.use = function (fn) {
  let path = "/",
      router = this._router;

  if (typeof fn !== "function") {
    path = fn;
    fn = arguments[1];
  }

  router.use(path, fn);

  return this;
}

// 为application对象生成http方法的处理函数
http.METHODS.forEach(m => {
  m = m.toLowerCase();

  Application.prototype[m] = function (path, fn) {
    // app注册路由的本质：调用router对象上的HTTP方法注册路由
    this._router[m].apply(this._router, arguments);
    
    return this;
  }
})

exports = module.exports = Application;