const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("soske_maindb", "root", "mysql20190611", {
    host: "soske-db",
    dialect: "mysql",
    operatorsAliases: false
})

db.sequelize = sequelize
db.Sequelize = sequelize

module.exports = db
