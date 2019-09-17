const Sequelize = require("sequelize")
const config = require('./config')
const db = {}
const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.hostname,
    dialect: config.database.dialect,
    port: config.database.port,
    operatorsAliases: false
})

db.sequelize = sequelize
db.Sequelize = sequelize

module.exports = db
