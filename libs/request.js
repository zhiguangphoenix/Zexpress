let http = require("http");
let req = Object.create(http.IncomingMessage.prototype);

module.exports = req;