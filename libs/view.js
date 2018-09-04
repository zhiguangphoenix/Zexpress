const path = require("path");
const fs = require("fs");

let dirname = path.dirname;
let basename = path.basename;
let extname = path.extname;
let join = path.join;
let resolve = path.resolve;

function View(name, options) {
    let opts = options || {};

    this.defaultEngine = opts.defaultEngine;
    this.root = opts.root;
    this.ext = path.extname(name);
    this.name = name;

    let fileName = name;
    if (!this.ext) {
        this.ext = this.defaultEngine[0] !== '.'
        ? '.' + this.defaultEngine
        : this.defaultEngine;

        fileName += this.ext;
    }

    this.engine = opts.engines[this.ext];
    this.path = this.lookup(fileName);
}

View.prototype.lookup = function (name) {
    
    // 先实现的简单一点
    return resolve(this.root, name);
}

View.prototype.render = function (options, callback) {
    this.engine(this.path, options, callback);
}

module.exports = View;