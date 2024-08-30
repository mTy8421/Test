var express = require("express");
var router = express.Router();

var passport = require("passport");
var LocalStrategy = require("passport-local");

var bycrypt = require("bcrypt");

var { createTable, conn } = require("../model/sql");

passport.use(
  new LocalStrategy(async (username, passowrd, done) => {
    try {
      conn.query(
        `SELECT * FROM auth WHERE user_name = ?`,
        [username],
        (err, result) => {
          if (result) {
            console.log(`passowrdInput : ${passowrd}`);
            const check = bycrypt.compareSync(
              passowrd,
              result[0].user_password
            );
            if (check) {
              done(null, result);
            } else {
              done(null, false);
            }
          }
          if (err) {
            console.log(`err: ${err}`);
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
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
    // successRedirect: '/api',
    failureRedirect: "/api/login",
  }),
  (req, res) => {
    res.redirect("/api/nxt");
  }
);

router.get("/login", (req, res) => {
  if (req.session.passport) {
    res.redirect("/api");
  }
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/login");
  });
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

router.get("/createTable", (req, res) => {
  createTable();
  var pass = "1234";
  var hash = bycrypt.hashSync(pass, 10);
  conn.query(
    `INSERT INTO auth (user_name, user_password, user_role) VALUES ('test', '${hash}', 'admin')`,
    (err) => {
      if (err) throw err;
    }
  );
});

module.exports = router;
