var express = require('express')
var bodyParser = require("body-parser")
var cors = require('cors')

var v1_api = require('./routes/v1/index')
var port = 3000

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', v1_api)
app.use('/v1', v1_api)

app.listen(port, function () {
    console.log("Server started on port " + port)
})
