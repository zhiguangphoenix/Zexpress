const app = require("./application");
const Router = require("./router");

function createApplication() {
  return new app();
}

exports = module.exports = createApplication;
exports.Router = Router;