const zexpress = require('../index');
const app = zexpress();

let port = 9876;
app.get('/get', function (req, res) {
  res.send('ZExpress ===> Get');
})

app.post('/post', function (req, res) {
  res.send('ZExpress ===> Post');
})

app.listen(port, function () {
  
  console.log('app is listening at ' + port);
})