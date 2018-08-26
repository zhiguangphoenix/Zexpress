let http = require("http");
let res = Object.create(http.ServerResponse.prototype);

res.send = function (body) {
  this.writeHead(200, {
    "Content-Type": "text/plain"
  });

  this.end(body);
}

res.render = function (view, options, callback) {
  let app = this.req.app;
  let done = callback;
  let opts = options || {};
  let self = this;

  done = done || (err, str) => {
    if (err) {
      return req.next(err);
    }

    this.send(str);
  }

  app.render(view, opts, done);
}

module.exports = res;