const http = require("http");

let router = [
  {
    path: '*',
    method: '*',
    handle: function (req, res) {

      console.log("default handle");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("404");
    }
  }
]

module.exports = {
  get: function (path, fn) {
    router.push({
      path: path,
      method: "GET",
      handle: fn
    })
  },
  listen: function (port, cb) {
    let server = http.createServer(function (req, res) {

      if (!res.send) {
        res.send = function (body) {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(body);
        }
      }

      for (let i = 1, len = router.length; i < len; i++) {
        if ((req.url === router[i].path || router[i].path === "*") && (req.method === router[i].method || router[i].method === "*")) {
          return router[i].handle && router[i].handle(req, res);
        }
      }
      // 没有匹配的就用默认的router[0].handle
      return router[0].handle && router[0].handle(req, res);
    });

    // 代理
    return server.listen.apply(server, arguments);
  }
}