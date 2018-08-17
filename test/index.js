const zexpress = require('../index');
const app = zexpress();

app.get('/get', function (req, res) {
  res.send('ZExpress ===> Get');
})

app.post('/post', function (req, res) {
  res.send('ZExpress ===> Post');
})

app.listen('9999', function () {
  
  console.log('app is listening at 9999');
})