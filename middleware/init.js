let request = require("../libs/request");
let response = require("../libs/response");

exports.init = function (req, res, next) {
    req.res = res;
    res.req = req;

    Object.setPrototypeOf(req, request);
    Object.setPrototypeOf(res, response);

    next();
}