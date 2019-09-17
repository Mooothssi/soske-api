var router = require('express').Router()
var tokenGuard = require('../../passport')
var passport = require('passport')
var pssConf = require('../../passport')
const fileUpload = require('express-fileupload');
const tasks = require('../../controllers/tasks')
const users = require('../../controllers/users')

router.use(fileUpload({
    limits: { fileSize: 10485760 },
    useTempFiles : true,
    tempFileDir : './tmp/'
}))
router.post('/getLeaderboard', passport.authenticate('jwt', { session: false }), users.getLeaderboardInfo)
router.post('/submitMarkdown', passport.authenticate('jwt', { session: false }), tasks.submitMarkdown)
router.post('/getCategories', tasks.getAllCategories)
router.post('/getCategory', passport.authenticate('jwt', { session: false }), tasks.getCategory)
router.post('/get', passport.authenticate('jwt', { session: false }), tasks.getSpecificTasks)
router.post('/submitAnswer', passport.authenticate('jwt', { session: false }), tasks.submitAnswer)
router.delete('/discard', passport.authenticate('jwt', { session: false }), tasks.discardTask)

module.exports = router
