var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  const data = [
    { hello: 'hello', test: 'test' },
    { hello: 'hello2', test: 'test2' },
  ];
  res.json(data);
});

module.exports = router;
