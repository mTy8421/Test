const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");

var { table, TitleWork, tableAddWork, tableWork } = require("../model/db");

const { createConnection } = require("../model/sql"); // Correct the import path

let conn;

createConnection()
  .then((connection) => {
    conn = connection;
  })
  .catch((err) => console.error(`connection error: ${err}`));

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
router.post("/addHeadTitle", async (req, res) => {
  if (req.body.topic != "" && req.body.date != "" && req.body.detail != "") {
    try {
      await conn.query(
        `
        INSERT INTO titleWork(
        user_id,
        title_topic,
        title_detail,
        title_type,
        title_date,
        title_status
        )VALUES(?, ?, ?, ?, ?, 0)
        `,
        [
          req.session.passport.user.user_id,
          req.body.topic,
          req.body.detail,
          req.body.type,
          req.body.date,
        ]
      );
      res.json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "error" });
  }
});

router.put("/addHeadTitle", (req, res) => {
  if (req.body.topic != "" && req.body.date != "" && req.body.detail != "") {
    TitleWork.push({ id: TitleWork.length + 1, ...req.body });
    console.table(TitleWork);
    res.json({ message: "success" });
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addHeadTitle", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `SELECT * FROM titleWork WHERE user_id = ?`,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// For tableAddWork
router.post("/addHeadWork", async (req, res) => {
  if (req.body.id != "" && req.body.name != "" && req.body.time != "") {
    try {
      await conn.query(
        `
        INSERT INTO detailWork(
        title_id,
        detail_name,
        detail_time,
        detail_status
        )VALUES(?, ?, ?, 0)
        `,
        [req.body.id, req.body.name, req.body.time]
      );
      res.json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addHeadWork", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `SELECT * FROM titleWork INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id WHERE titleWork.user_id = ?`,
      [id]
    );
    res.json(data);
    console.table(data);
  } catch (error) {
    console.log(error);
  }
});

router.put("/addHeadWork", async (req, res) => {
  if (req.body.id != "" && req.body.name != "" && req.body.time != "") {
    try {
      const [data] = await conn.query(
        `
        UPDATE detailWork
        SET detail_name = ?, detail_time = ?
        WHERE detail_id = ?
        `,
        [req.body.name, req.body.time, req.body.id]
      );
      console.log(`req.body.id ${req.body.id}`);
      console.log(`req.body.name ${req.body.name}`);
      console.log(`req.body.time ${req.body.time}`);
      if (data) {
        res.json({ message: "success" });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "error" });
  }
});

// For Approve

router.get("/approve", async (req, res) => {
  try {
    const [data] = await conn.query(`
      SELECT * FROM titleWork INNER JOIN auth ON titleWork.user_id = auth.user_id WHERE titleWork.title_status = 0
      `);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.put("/approve", async (req, res) => {
  try {
    console.log(req.body.status);
    if (req.body.status) {
      const [data] = await conn.query(
        `
        UPDATE titleWork
        SET title_status = 1
        WHERE title_id = ?
        `,
        [req.body.title_id]
      );
      res.json(data);
    } else {
      const [data] = await conn.query(
        `
        UPDATE titleWork
        SET title_status = 2
        WHERE title_id = ?
        `,
        [req.body.title_id]
      );
      res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/approveDetail", async (req, res) => {
  try {
    const [data] = await conn.query(`
      SELECT * FROM titleWork INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id
      `);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// For tableWork have upload file

const storageNew = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/api/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadNew = multer({ storage: storageNew });

router.post("/addWork", uploadNew.single("image"), async (req, res) => {
  if (req.body.time != "" && req.body.valueTest != "" && req.file != "") {
    try {
      const id = req.body.detail_id;
      const idUser = req.session.passport.user.user_id;
      const [data] = await conn.query(
        `
        INSERT INTO sendWork(
        detail_id,
        user_id,
        send_detail,
        send_time,
        send_image
        )VALUES(?, ?, ?, ?, ?)
        `,
        [id, idUser, req.body.valueTest, req.body.time, req.file.filename]
      );
      await conn.query(
        `
        UPDATE detailWork
        SET detail_status = 1
        WHERE detail_id = ?
        `,
        [id]
      );
      console.log(data);
      res.json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "error" });
  }
});

router.get("/addWork", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `
      SELECT * FROM titleWork INNER JOIN auth ON titleWork.user_id = auth.user_id INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id WHERE titleWork.title_status = 1 AND auth.user_id = ? AND detailWork.detail_status = 0
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// for Get History
router.get("/historyWork", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `
      SELECT * FROM sendWork INNER JOIN auth ON sendWork.user_id = auth.user_id INNER JOIN detailWork ON sendWork.detail_id = detailWork.detail_id WHERE sendWork.user_id = ?
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// for Edit User
router.get("/userEdit", async (req, res) => {
  try {
    const [data] = await conn.query(
      `
      SELECT * FROM auth;
      `
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/userEdit/", async (req, res) => {
  if (
    req.body.username != "" &&
    req.body.email != "" &&
    req.body.password != ""
  ) {
    try {
      const passInclude = req.body.password;
      const hash = bcrypt.hashSync(passInclude, 10);
      await conn.query(
        `
        INSERT INTO auth(
        user_name,
        user_email,
        user_password,
        user_role
        )VALUES(?, ?, ?, ?)
        `,
        [req.body.username, req.body.email, passInclude, req.body.role]
      );
      res.json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "error" });
  }
});

// for chart

router.get("/chartUser", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `
      SELECT COUNT(titleWork.title_type) AS total, titleWork.title_type FROM sendWork INNER JOIN auth ON sendWork.user_id = auth.user_id INNER JOIN detailWork ON sendWork.detail_id = detailWork.detail_id INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id WHERE sendWork.user_id = ? AND detailWork.detail_status = 1 GROUP BY titleWork.title_type;
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
