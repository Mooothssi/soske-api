const JWT = require('jsonwebtoken')
const secret = require('../config').server_secret
const CategoryModel = require('../models/categories')
const TaskModel = require('../models/tasks')
const TaskScoreModel = require('../models/task_scores')
const SubmissionModel = require('../models/submissions')
const axios = require('axios')
const moment = require('moment')
const randomString = require("randomstring")
const Op = require("sequelize").Op

module.exports = {
    model: CategoryModel,
    getCategory: async(req, res, next) => {
        const { uid } = req.user
        const { route } = req.body
        const foundCategory = await CategoryModel.findOne({where: {route: route}})
        let foundTasks = await TaskModel.findAll({raw: true, where: {category_id: route}})
        let editedTasks = []
        for (var index in foundTasks) {
          let value = foundTasks[index]
          const config = { raw: true, where: {
            [Op.and]: [{ user_id: uid }, { task_id: value.uid }] 
          }};
          delete value.uid;
          try {
            let allSubmissions = await SubmissionModel.findAll(config);
            allSubmissions.forEach(function(v2){ delete v2.task_id; delete v2.user_id });
            let taskScore = await TaskScoreModel.findOne(config);
            value.submissions = allSubmissions
            if (taskScore) {
              value.score = taskScore.score
              value.passed = taskScore.passed
            }
          }
          catch (error) {
            console.log(error)
          }
          editedTasks[index] = value
        }        
        const response = {
          category: foundCategory,
          tasks: editedTasks
        }
        res.status(200).json(response)
        console.log("done")
    },
    getSpecificTasks: async(req, res, next) => {
        const { staff_mode } = req.body
        const { uid, is_staff } = req.user
        let config = {}
        if (staff_mode && is_staff) {
            config = { where: { owner_id: uid }}
        }
        const foundTasks = await TaskModel.findAll(config)
        res.status(200).json(foundTasks)
    },
    getAllCategories: async(req, res, next) => {
        const { username, email, password } = req.body
        const foundTasks = await CategoryModel.findAll()
        res.status(200).json(foundTasks)
    },
    submitAnswer: async(req, res, next) => {
        const { uid } = req.user
        const remote_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const foundTask = await TaskModel.findOne({ where: { id: parseInt(req.body.task_id) } })
        axios({
            method: 'post',
            url: 'http://soske-grader:8223/submitAnswer',
            withCredentials: true,
            headers: req.headers,
            data: {
              task_id: foundTask.uid,
              src_code: req.body.src_code,
              uid: uid,
              remote_addr: remote_addr
            }
          })
          .then(function (response) {
            res.status(200).json(response.data)
           
          })
          .catch(function (error) {
            console.log(error)
            res.status(500).json("error")
          })
        // res.header('Access-Control-Allow-Origin', '*')
        // res.redirect(307, 'http://soske.silaalang.org:8223/testSandbox')
    },
    submitMarkdown: async(req, res, next) => {
        const { uid } = req.user
        const task_id = randomString.generate({ length: 75 })
        axios({
            method: 'post',
            url: 'http://soske-grader:8223/submitProblem',
            withCredentials: true,
            headers: {
                "Authorization": req.header('Authorization'),
                "Content-Type": "application/json"
            },
            data: {
                user_id: uid,
                md_code: req.body.md_code,
                task_id: task_id,
                author: req.body.author,
                category: req.body.category,
                prob_name: req.body.prob_name,
                tags: req.body.tags,
                difficulty: req.body.difficulty
            }
          })
          .then(function (response) {
            console.log(response)
            res.status(200).json(response.data)
           
          })
          .catch(function (error) {
            console.log(error)
            res.status(500).json("error")
          })
    },
    discardTask: async(req, res, next) => {
      const { uid, is_staff } = req.user
      try {
        if (is_staff) {
            const { id } = req.body
            console.log(req.body)
            config = { where: {
              [Op.and]: [{ owner_id : uid }, { id: id }] 
            }}
            TaskModel.destroy(config)
            res.status(200).json({ status: "Okay" })
        }
        else {
          res.status(401).json({status: "Unauthorized"})
        }
      }
      catch(error) {
        console.error(error);
      }      
    }
}