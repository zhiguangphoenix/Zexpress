const zexpress = require('../index');
const app = zexpress();

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

app._router
  .route('/user')
  .get(function (req, res) {
    res.send('user ===> Get');
  })
  .post(function (req, res) {
    res.send("user ===> Post");
  })
  .put(function (req, res) {
    res.send("user ===> Put");
  })

app.listen(port, function () {
  
  console.log('app is listening at ' + port);
})