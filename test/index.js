const zexpress = require('../index');
const app = zexpress();
const router = zexpress.Router();
const url = require('url');
const fs = require('fs');
const path = require('path');

let port = 9876;
// app.get('/zexpress', function (req, res) {
//   res.send('ZExpress ===> Get');
// })

// app.post('/zexpress', function (req, res) {
//   res.send('ZExpress ===> Post');
// })

// app.put('/zexpress', function (req, res) {
//   res.send('ZExpress ===> Put');
// })

// app.delete('/zexpress', function (req, res) {
//   res.send('Zexpress ===> Delete');
// })

// app._router
//   .route('/user')
//   .get(function (req, res, next) {
//     res.send('user ===> Get');
//   })
//   .post(function (req, res) {
//     res.send("user ===> Post");
//   })
//   .put(function (req, res) {
//     res.send("user ===> Put");
//   })

// app
//   .get('/', function (req, res, next) {
//     next();
//   })
//   // .get('/', function (req, res, next) {
//   //   next(new Error('error'));
//   // })
//   .get('/', function (req, res) {
//     res.send('third');
//   });

// router.use(function (req, res, next) {
//   console.log("run");

//   res.send("=>")  
// })


// app.use('/', function (req, res, next) {
//   res.send('first');
// });


// router.use(function (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

// router.use('/zhiguang', function (req, res, next) {
//   res.send('zhiguang');
// });

// router.use('/daryl', function (req, res, next) {
//   res.send('daryl');
// })

// app.use('/user', router);

app.engine('ztl', function (path, options, callback) {
  fs.readFile(path, function (err, content) {
    if (err) {
      return callback(new Error(err));
    }

    let rendered = content.toString()
      .replace("$title$", "<title>" + options.title + "</title>")
      .replace("$name$", "<h1>" + options.name + "</h1>");

    return callback(null, rendered);
  })
})

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ztl");

app.get("/", function (req, res, next) {
  res.render("index", {
    title: "ztl title",
    name: "Daryl"
  })
})

app.listen(port, function () {
  console.log('app is listening at ' + port);
})