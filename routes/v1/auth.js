var router = require('express').Router()
var tokenGuard = require('../../passport')
var passport = require('passport')
var pssConf = require('../../passport')
const users = require('../../controllers/users')

router.post('/login', passport.authenticate('local', { session: false,
    failureRedirect : 'show_failure'  }), users.signIn)

router.get('/show_failure', function(req, res) {
    res.status(401).json( { message: 'Invalid SOSKE-ID or password. Please log in again.'})
});

router.post('/signup', users.signUp)

router.post('/signup_quick', users.signUpQuick)

router.post('/secret', passport.authenticate('jwt', { session: false }),
(req, res) => {
    res.send("secret")
})

router.get('/verify/email', users.verifyByEmail)

router.post('/permit', passport.authenticate('jwt', { session: false }), users.checkPerm)

module.exports = router
