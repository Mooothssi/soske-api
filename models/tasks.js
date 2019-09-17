const sequelize = require("sequelize")
const db = require("../db-init.js")

module.exports = db.sequelize.define(
    "coding_tasks",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: { type: sequelize.STRING },
        name: { type: sequelize.STRING },
        difficulty: { type: sequelize.INTEGER },
        category_id: { type: sequelize.STRING },
        creator_id: { type: sequelize.STRING },
        html_template: { type: sequelize.STRING },
        date_created: { type: sequelize.DATE }
    }, { timestamps: false }
)
