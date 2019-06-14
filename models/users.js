const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "auth_users",
    {
        id_order: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        uid: { type: sequelize.STRING },
        username: { type: sequelize.STRING },
        password: { type: sequelize.STRING },
        email: { type: sequelize.STRING }
    }, {timestamps: false}
)
