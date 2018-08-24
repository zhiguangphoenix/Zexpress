let http = require("http");
let res = Object.create(http.ServerResponse.prototype);

res.send = function (body) {
  this.writeHead(200, {
    "Content-Type": "text/plain"
  });

  this.end(body);
}

module.exports = res;