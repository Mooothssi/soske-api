const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "coding_submissions",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        results: { type: sequelize.TEXT },
        name: { type: sequelize.STRING },
        route: { type: sequelize.STRING }
    }, { timestamps: false }
)
