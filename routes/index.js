// index.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { createConnection } = require("../model/sql"); // Correct the import path

let conn;

createConnection()
  .then((connection) => {
    conn = connection;
  })
  .catch((err) => console.error(`connection error: ${err}`));

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const [user] = await conn.query(
          "SELECT * FROM auth WHERE user_email = ?",
          [username]
        );

        if (!user || user.length === 0) {
          return done(null, false);
        }

        const check = bcrypt.compareSync(password, user[0].user_password);
        if (check) {
          return done(null, user[0]);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/login", (req, res) => {
  if (req.session.passport) {
    res.redirect("/api");
  }
  res.render("index");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/login");
  });
});

// Singup
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const user = req.body.firstname;
    const email = req.body.email;
    const pass = req.body.password;
    const hash = bcrypt.hashSync(pass, 10);

    await conn.execute(`
      INSERT INTO auth(
      user_email,
      user_name,
      user_password,
      user_role
      )VALUES('${email}', 
      '${user}', 
      '${hash}', 
      'member'
      )`);
    res.redirect("/api/login");
  } catch (error) {
    console.log(error);
  }
});

/* GET home page. */
router.get("/", function (req, res) {
  if (req.session.passport) {
    console.table(req.session.passport);
    // res.json({ user: req.session.passport.user });
  } else {
    res.json({ msg: "not login" });
  }
});

router.get("/nxt", (req, res) => {
  if (req.session.passport) {
    res.json(req.session.passport);
  } else {
    res.send("nxt");
  }
});

router.get("/createTable", async (req, res) => {
  try {
    const passInclude = "1234";
    const hash = bcrypt.hashSync(passInclude, 10);

    await conn.execute(`
      CREATE TABLE auth (
        user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_name VARCHAR(255) NOT NULL,
        user_password VARCHAR(255) NOT NULL,
        user_role ENUM('admin', 'หัวหน้าสำนักงาน', 'พนักงาน', 'คณบดี', 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร', 'รองคณบดีฝ่ายวิชาการ', 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม', 'รองคณบดีฝ่ายคุณภาพนิสิต')
      )`);

    await conn.execute(`
      CREATE TABLE titleWork (
        title_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title_topic VARCHAR(255) NOT NULL UNIQUE,
        title_detail TEXT NOT NULL,
        title_type VARCHAR(255) NOT NULL,
        title_time TEXT NOT NULL,
        title_date DATE NOT NULL,
        title_status INT NOT NULL
      )`);
    await conn.execute(`
      CREATE TABLE detailWork(
        detail_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title_id INT NOT NULL,
        user_id INT NOT NULL,
        detail_time TEXT NOT NULL,
        detail_values TEXT NOT NULL,
        detail_image TEXT NOT NULL,
        detail_status INT NOT NULL,
        FOREIGN KEY (title_id) REFERENCES titleWork(title_id),
        FOREIGN KEY (user_id) REFERENCES auth(user_id)
      )`);
    await conn.execute(`
        CREATE TABLE sendWork(
          send_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          detail_id INT NOT NULL,
          user_id INT NOT NULL,
          send_detail TEXT NOT NULL,
          send_time INT NOT NULL,
          send_image TEXT NOT NULL,
          FOREIGN KEY (detail_id) REFERENCES detailWork(detail_id),
          FOREIGN KEY (user_id) REFERENCES auth(user_id)
        )`);

    await conn.execute(`
        INSERT INTO auth(
        user_email,
        user_name,
        user_password,
        user_role
        )VALUES('test@testgmail.com', 
        'test', 
        '${hash}', 
        'admin'
        )`);
    await conn.execute(`
          INSERT INTO auth(
          user_email,
          user_name,
          user_password,
          user_role
          )VALUES('test2@testgmail.com', 
          'test', 
          '${hash}', 
          'พนักงาน'
          )`);
    await conn.execute(`
            INSERT INTO auth(
            user_email,
            user_name,
            user_password,
            user_role
            )VALUES('test3@testgmail.com', 
            'test', 
            '${hash}', 
            'หัวหน้าสำนักงาน'
            )`);
    console.log("Tables created successfully");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
