const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "coding_task_scores",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: { type: sequelize.STRING },
        task_id: { type: sequelize.STRING },
        score: { type: sequelize.INTEGER },
        passed: { type: sequelize.BOOLEAN }
    }, { timestamps: false }
)
