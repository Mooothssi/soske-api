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
        user_id: { type: sequelize.STRING },
        answer: { type: sequelize.STRING },
        results: { type: sequelize.STRING },
        compiler_messages: { type: sequelize.STRING },
        task_id: { type: sequelize.STRING }
    }, { timestamps: false }
)
