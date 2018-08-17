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

  this._router.handle(req, res);
}

http.METHODS.forEach(m => {
  m = m.toLowerCase();

  Application.prototype[m] = function (path, fn) {
    this._router[m].apply(this._router, arguments);
    return this;
  }
})

module.exports = Application;