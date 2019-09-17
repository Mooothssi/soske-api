const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "coding_scores",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: { type: sequelize.STRING },
        score: { type: sequelize.INTEGER }
    }, { timestamps: false }
)
