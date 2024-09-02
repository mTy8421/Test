var express = require('express')
var router = express.Router()

var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20')

var users = []

passport.use(new GoogleStrategy({
  clientID: '',
  clientSecret: '',
  callbackURL: '/api/google',
}, (accessToken, refreshToken, profile, done) => {
}))

passport.serializeUser()

passport.deserializeUser()

router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
