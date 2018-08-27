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
    // let path;
    // let roots = [].concat(this.root);

    // for (let i = 0; i < roots.length && !path;i++) {
    //     let root = roots[i];

    //     let loc = resolve(root, name);
    //     let dir = dirname(loc);
    //     let file = basename(loc);

    //     path = resolve(dir, file);
    // }

    // return path;
    console.log("==========");
    console.log(this.root);
    console.log(name);
    console.log("==========");

    // 先实现的简单一点
    return resolve(this.root, name);
}

View.prototype.render = function (options, callback) {
    this.engine(this.path, options, callback);
}

module.exports = View;