var express = require('express')
var bodyParser = require("body-parser")
var cors = require('cors')

var v1_api = require('./routes/v1/index')
var port = 3000

var cron_runner = require('./cron/leaderboard')

var app = express()
app.use(cors())
app.disable('x-powered-by')
app.use((req, res, next) => {
    res.header("X-Powered-By", "SOSKE Server")
    next()
})
// app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 },
//                   secret: 'keyboard cat'}));
// app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', v1_api)
app.use('/v1', v1_api)

app.listen(port, function () {
    console.log("Server started on port " + port)
})

cron_runner.schedule()
