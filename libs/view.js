const path = require("path");

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