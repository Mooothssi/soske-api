const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("soske_maindb", "elab", "elabdbpass", {
    host: "172.17.0.1",
    dialect: "mysql",
    operatorsAliases: false
})

db.sequelize = sequelize
db.Sequelize = sequelize

module.exports = db
