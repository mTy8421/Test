const express = require("express");
const router = express.Router();
const multer = require("multer");

var { table, TitleWork, tableAddWork, tableWork } = require("../model/db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/api/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

/* GET users Data */
router.get("/", function (req, res) {
  res.json(table);
});

// For TitleWork
router.post("/addHeadTitle", (req, res) => {
  if (req.body.topic != "" && req.body.performance != "") {
    TitleWork.push({ id: TitleWork.length + 1, ...req.body });
    console.table(TitleWork);
    res.json({ message: "success" });
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addHeadTitle", (req, res) => {
  res.json(TitleWork);
});

// For tableAddWork
router.post("/addHeadWork", (req, res) => {
  if (req.body.topic != "" && req.body.name != "" && req.body.time != "") {
    tableAddWork.push({ id: tableAddWork.length + 1, ...req.body });
    console.table(tableAddWork);
    res.json({ message: "success" });
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addHeadWork", (req, res) => {
  res.json(tableAddWork);
});

// For tableWork

const storageNew = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/api/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadNew = multer({ storage: storageNew });

router.post("/addWork", uploadNew.single("image"), (req, res) => {

  if (
    req.body.timeWork != "" &&
    req.body.timeUser != "" &&
    req.body.values != "" &&
    req.file != ""
  ) {
    tableWork.push({
      id: tableWork.length + 1,
      ...req.body,
      imgae: req.file.filename,
    });
    console.table(tableWork);
    console.log(req.file);
    res.json({ message: "success" });
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addWork", (req, res) => {
  // console.table(tableWork)
  res.json(tableWork);
});

module.exports = router;
