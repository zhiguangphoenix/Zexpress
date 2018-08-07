function createApplication() {
  return {
    get: function () {
      console.log("express get Func");
    },
    listen: function (port, cb) {
      var server = http.createServer(function (req, res) {
        console.log('create Server...');
      })

      return server.listen(port, cb);
    }
  };
}

exports = module.exports = createApplication;