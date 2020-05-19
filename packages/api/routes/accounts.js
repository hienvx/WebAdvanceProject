let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Test api');
});

router.get('/:id', function(req, res, next) {
  res.send('Lấy thông tin tài khoản');
});

router.post('/payment/:id', function(req, res, next) {
  res.send('nạp tiền vào tài khoản');
});

module.exports = router;
