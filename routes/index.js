var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');

var { db } = require('../model/db');

passport.use(
  new LocalStrategy(async (username, passowrd, done) => {
    try {
      const user = db.find((user) => user.name === username && user.password === passowrd)

      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }

    } catch (err) {
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user)
  })
})

router.post('/login', passport.authenticate('local', {
  // successRedirect: '/api',
  failureRedirect: '/api/login'
}), (req, res) => {
  res.redirect('/');
})

router.get('/login', (req, res) => {
  if (req.session.passport) {
    res.redirect('/api')
  }
  res.render('login')
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/api/login');
  });
})

/* GET home page. */
router.get('/', function (req, res) {

  if (req.session.passport) {
    console.table(req.session.passport);
    res.json({ user: req.session.passport.user });
  } else {
    res.json({ msg: 'not login' });
  }

});

module.exports = router;
