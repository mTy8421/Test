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
        user_role VARCHAR(255) NOT NULL
      )`);

    await conn.execute(`
      CREATE TABLE mission (
        mission_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mission_title VARCHAR(255) NOT NULL,
        mission_description TEXT NOT NULL,
        mission_image TEXT NOT NULL,
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
          'member'
          )`);

    console.log("Tables created successfully");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
