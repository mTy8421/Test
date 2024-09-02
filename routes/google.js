var express = require('express')
var router = express.Router()

var passport = require('passport')

passport.use()

passport.serializeUser()

passport.deserializeUser()

router.get('/login', passport.authenticate('google'))


module.exports = router
