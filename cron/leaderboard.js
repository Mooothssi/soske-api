var cron = require('node-cron')
var scoreModel = require('../models/scores')
var TaskModel = require('../models/tasks')
var taskScoreModel = require('../models/task_scores')
const userModel = require('../models/users')
var sequelize = require('sequelize')
const Op = sequelize.Op

function scoreboardUpsertOne(model, user_id, values) {
    return model.findOne({where: { user_id: user_id }}).then( (obj) => {
        if (obj) {
            return obj.update(values)
        } else {
            return model.create(values)
        }
    })
}

async function clearOrphanedTaskScore() {
    let allTaskScores = await taskScoreModel.findAll()
    allTaskScores.forEach(async function(taskScore) {
        let task = await TaskModel.findOne({ where: { uid: taskScore.task_id }})
        if (!task) {
            taskScoreModel.destroy({where: {id: taskScore.id}})
        }
    })
}

async function updateScoreboard() {
    let user_ids = await taskScoreModel.findAll({ group: 'user_id', attributes: [[sequelize.fn('SUM', sequelize.col('score')), 'score'], 'user_id'] })
    user_ids.forEach(async function(element) {
        //let staff_user = await userModel.findOne({ where: { uid: element.user_id, is_staff: { [Op.not]: true } }})
        let staff_user = await userModel.findOne({ where: { uid: element.user_id, is_staff: true }})
        if (!staff_user) {
            scoreboardUpsertOne(scoreModel, element.user_id, { user_id: element.user_id, score: element.score }) 
        }
    });
    await clearOrphanedTaskScore()
    console.log("Updated")
}

function schedule() {
    cron.schedule('*/30 * * * *', async () => {
        try {
            await updateScoreboard()
        }
        catch (error) {
            console.log("Error updating the Leaderboard... " + error)
        }
    })
    console.log("Started")
}

module.exports = {
    schedule: schedule
}
