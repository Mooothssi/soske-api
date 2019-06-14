var router = require('express').Router()
var tokenGuard = require('../../passport')
var passport = require('passport')
var pssConf = require('../../passport')
const users = require('../../controllers/users')

router.post('/login', passport.authenticate('local', { session: false }),
users.signIn)

router.post('/signup', users.signUp)

router.post('/secret', passport.authenticate('jwt', { session: false }),
(req, res) => {
    res.send("secret")
})

module.exports = router
