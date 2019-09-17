const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "coding_categories",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: sequelize.STRING },
        route: { type: sequelize.STRING },
        note: { type: sequelize.STRING }
    }, { timestamps: false }
)
