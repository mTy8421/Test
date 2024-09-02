var express = require("express");
var router = express.Router();

var { table } = require("../model/db").default;

/* GET users listing. */
router.get("/", function (req, res) {
  res.json(table);
});

router.post("/", (req, res) => {
  if (req.body) {
    table.push(req.body);
    console.table(table);
  }
  res.json(table);
});

module.exports = router;
