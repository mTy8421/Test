var express = require('express');
var router = express.Router();

var { table } = require('./db');

/* GET users listing. */
router.get('/', function (req, res) {
  res.json(table);
});

router.post('/', (req, res) => {
  if (req.json) {
    table.push(req.json)
    console.table(table)
  }
  res.json(table);
})

module.exports = router;
