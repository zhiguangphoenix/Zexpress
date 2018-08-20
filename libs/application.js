const http = require("http");
const router = require("./router");

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
  if (!res.send) {
    res.send = function (body) {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });

      res.end(body);
    }
  }

  let done = function finalhandler(error) {
    res.writeHead(404, { "Content-Type": "text/plain" });

    if (error) {
      res.send("404" + error);
    } else {
      let msg = "Cannot" + req.method + " " + req.url;
      res.end(msg);
    }
  }
  this._router.handle(req, res, done);
}
// 为application对象生成http方法的处理函数
http.METHODS.forEach(m => {
  m = m.toLowerCase();

  Application.prototype[m] = function (path, fn) {
    this._router[m].apply(this._router, arguments);
    return this;
  }
})

module.exports = Application;