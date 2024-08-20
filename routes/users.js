var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  req.cookies['test'] = 'test3';
  const data = [
    { hello: 'hello', test: 'test' },
    { hello: 'hello2', test: 'test2' },
    { hello: 'hello2', test: req.cookies['test'] },
  ];
  res.json(data);
  res.end();
});

module.exports = router;
