const zexpress = require('../index');
const app = zexpress();
const router = zexpress.Router();
const url = require('url');

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

app.use(function (req, res, next) {
  // let exampleUrl = "https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost";
let exampleUrl = "https://nodejs.org";
  let urlObj = url.parse(exampleUrl);
  console.log(urlObj);
  
  next();
});

console.log(router);


// app.use('/', function (req, res, next) {
//   res.send('first');
// });


// router.use(function (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

router.use('/zhiguang', function (req, res, next) {
  res.send('zhiguang');
});

router.use('/daryl', function (req, res, next) {
  res.send('daryl');
})

app.use('/user', router);

app.listen(port, function () {
  console.log('app is listening at ' + port);
})