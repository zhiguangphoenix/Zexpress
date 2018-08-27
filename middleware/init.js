let request = require("../libs/request");
let response = require("../libs/response");

exports.init = function (app) {
    return function (req, res, next) {
        req.res = res;
        res.req = req;
        req.next = next;

        Object.setPrototypeOf(req, request);
        Object.setPrototypeOf(res, response);

        Object.defineProperty(req, "app", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app
        });

        next();
    }
}
