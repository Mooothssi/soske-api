var router = require('express').Router()
var authHandler = require('./auth')
var taskHandler = require('./tasks')

router.get("/", (req, res) => {
    res.send("API V1")
})

const users = require('../../models/users')

router.post("/logintest", (req, res) => {
    if (!req.body.username)
    {
        res.send("Invalid")
    }
    else
    {
    users.findAll({where: {
        username: req.body.username
    }})
        .then(tasks => {
            res.json(tasks)
        })
        .catch(err => {
            res.send("error: " + err)
        })
    }
})

router.use('/auth', authHandler)
router.use('/tasks', taskHandler)

module.exports = router
