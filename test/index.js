const zexpress = require('../index');
const app = zexpress();

app.get('/', function (req, res) {
  res.send('ZExpress');
})

app.listen('9999', function () {
  
  console.log('app is listening at 9999');
})