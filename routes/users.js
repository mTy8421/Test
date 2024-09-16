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

// For TitleWork
router.post("/addHeadTitle", async (req, res) => {
  if (
    req.body.topic != "" &&
    req.body.date != "" &&
    req.body.detail != "" &&
    req.body.time != ""
  ) {
    try {
      await conn.query(
        `
        INSERT INTO titleWork(
        title_topic,
        title_detail,
        title_type,
        title_date,
        title_time,
        title_status
        )VALUES(?, ?, ?, ?, ?, 0)
        `,
        [
          req.body.topic,
          req.body.detail,
          req.body.type,
          req.body.date,
          req.body.time,
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

router.put("/addHeadTitle", async (req, res) => {
  if (
    req.body.topic != "" &&
    req.body.date != "" &&
    req.body.detail != "" &&
    req.body.time != ""
  ) {
    try {
      await conn.query(
        `
        UPDATE titleWork SET
        title_topic = ?,
        title_detail = ?,
        title_type = ?,
        title_date = ?,
        title_time = ?
        WHERE title_id = ?
        `,
        [
          req.body.topic,
          req.body.detail,
          req.body.type,
          req.body.date,
          req.body.time,
          req.body.id,
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

router.get("/addHeadTitle", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(`SELECT * FROM titleWork`);
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
      `SELECT * FROM titleWork INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id`,
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
      SELECT * FROM titleWork INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id INNER JOIN auth ON auth.user_id = detailWork.user_id WHERE titleWork.title_status = 1
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
        UPDATE detailWork
        SET detail_status = 1
        WHERE detail_id = ?
        `,
        [req.body.detail_id]
      );
      await conn.query(
        `
        UPDATE titleWork
        SET title_status = 2
        WHERE title_id = ?
        `,
        [req.body.title_id]
      );
      res.json(data);
    } else {
      const [data] = await conn.query(
        `
        UPDATE detailWork
        SET detail_status = 2
        WHERE detail_id = ?
        `,
        [req.body.detail_id]
      );
      await conn.query(
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
      SELECT * FROM titleWork INNER JOIN detailWork ON titleWork.title_id = detailWork.title_id WHERE detailWork.detail_status = 0
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
      const id = req.body.title_id;
      const idUser = req.session.passport.user.user_id;
      const [data] = await conn.query(
        `
        INSERT INTO detailWork(
        title_id,
        user_id,
        detail_time,
        detail_values,
        detail_image,
        detail_status
        )VALUES(?, ?, ?, ?, ?, 0)
        `,
        [id, idUser, req.body.time, req.body.valueTest, req.file.filename]
      );
      await conn.query(
        `
        UPDATE titleWork
        SET title_status = 1
        WHERE title_id = ?
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
      SELECT * FROM titleWork WHERE title_status = 0;
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
      SELECT * FROM detailWork
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      WHERE detailWork.user_id = ?
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/historyWorkHead", async (req, res) => {
  try {
    const [data] = await conn.query(
      `
      SELECT * FROM detailWork
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      `
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
      SELECT COUNT(titleWork.title_type) AS total, titleWork.title_type
      FROM detailWork
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      WHERE detailWork.user_id = ? AND detailWork.detail_status = 1
      GROUP BY titleWork.title_type;
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/chartHead", async (req, res) => {
  try {
    const [data] = await conn.query(
      `
      SELECT COUNT(auth.user_name) AS users, auth.user_name
      FROM detailWork
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      WHERE detailWork.detail_status = 1
      GROUP BY auth.user_name;
      `
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/chartBarHead", async (req, res) => {
  try {
    const [data] = await conn.query(
      `
      SELECT MONTH(titleWork.title_date) AS month, COUNT(titleWork.title_date) AS total
      FROM detailWork
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      WHERE detailWork.detail_status = 1
      GROUP BY MONTH(titleWork.title_date)
      `
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/chartBarUser", async (req, res) => {
  try {
    const id = req.session.passport.user.user_id;
    const [data] = await conn.query(
      `
      SELECT MONTH(titleWork.title_date) AS month, COUNT(titleWork.title_date) AS total
      FROM detailWork
      INNER JOIN auth ON detailWork.user_id = auth.user_id
      INNER JOIN titleWork ON detailWork.title_id = titleWork.title_id
      WHERE detailWork.detail_status = 1 AND detailWork.user_id = ?
      GROUP BY MONTH(titleWork.title_date)
      `,
      [id]
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
