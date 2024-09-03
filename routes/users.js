const express = require("express");
const router = express.Router();
const multer = require("multer");

var { table } = require("../model/db").default;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./api/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* GET users Data */
router.get("/", function (req, res) {
  res.json(table);
});

// POST user insert into data
router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({ message: "Uploaded" });
  } else {
    res.json({ message: "Error uploading" });
  }
});

// POST user insert into data
router.post("/insert", (req, res) => {
  if (req.body) {
    req.body.forEach((element) => {
      table.push(element);
    });
    res.json({ message: "Inserted" });
  } else {
    res.json({ message: "Error inserting" });
  }
});

module.exports = router;
