/**
 * 
 * Layer类，与path对应
 * 
 */

function Layer(path, fn) {
  this.handle = fn;
  this.name = fn.name || "<anonymous>";
  this.path = path;
}

Layer.prototype.handle_request = function (req, res, next) {
  console.log("handle_request");

  let fn = this.handle;

  try {
    fn(req, res, next);
  } catch (error) {
    next(error);
  }
}

Layer.prototype.match = function (path) {
  if (path === this.path || path === "*") {
    return true;
  }

  return false;
}

module.exports = Layer;