const JWT = require('jsonwebtoken')
const secret = require('../config').server_secret
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const Op = require("sequelize").Op
const randomString = require("randomstring")
const mailer = require('../mailer')
const scoreModel = require('../models/scores')

function signToken (user) {
    var privateKey = secret
    return JWT.sign({
        iss: "SOSKE",
        sub: user.username,
        iat: new Date().getTime(),
        // exp: new Date().setDate(new Date().getDate() + 1)
    }, privateKey, { algorithm: 'RS256', encoding: 'UTF-8', expiresIn: 86400 })
}

async function processPassword(pwd) {
    const salt = await bcrypt.genSalt(10)
    const pwdHash = bcrypt.hash(pwd, salt)
    return pwdHash
}

module.exports = {
    users: User,
    validatePassword: async (newPwd, hashed) => {
        try {
            return await bcrypt.compare(newPwd, hashed)
        } catch (error) {
            throw new Error(error)
        }
    },
    signUp: async(req, res, next) => {
        const { username, email, password } = req.body
        const foundUser = await User.findOne({where: {email: email}})
        if (foundUser) {
            return res.status(401).json({ error: "Email is already in use."})
        }
        const passwordHash = await processPassword(password)
        const newUser = User.create({
            username: username, 
            email: email, 
            password: passwordHash})

        const token = signToken(newUser)
        res.status(200).json({ token })
    },
    signUpQuick: async(req, res, next) => {
        const { username, email, password, legal_name } = req.body
        const foundUser = await User.findOne({where: {email: email}})
        if (foundUser) {
            if (foundUser.password) {
                return res.status(401).json({ error: "Email is already in use."})
            }
        }
        let name = legal_name.split(" ")
        const firstname = name[0]
        const lastname = name.slice(1).join("")
        const preregUser = await User.findOne({where: {
            [Op.and]: [{first_name: firstname}, {last_name: lastname}, {email: email}] 
        }})
        if (!preregUser) {
            return res.status(401).json({ error: "Not pre-registered."})
        }
        const passwordHash = await processPassword(password)
        const rand = randomString.generate()
        const uid = randomString.generate({ length: 75 })
        const newUser = User.update({
            username: username, 
            email: email, 
            password: passwordHash,
            confirmation_token: rand,
            uid: uid,
            reg_date: Date.now() },
            { where: 
                { email: email }
            })
        mailer().sendVerificationMail(email, username, legal_name, rand)
        const token = signToken(newUser)
        res.status(200).json({ token })
    },
    signIn: async(req, res, next) => {
        const token = signToken(req.user)
        const username = req.user.username
        res.status(200).json({ token, username })
    },
    verifyByEmail: async(req, res, next) => {
        var token = req.query.i
        if(!token) {
            return res.status(404)
        }
        const foundUser = await User.findOne({where: 
           {confirmation_token: token}
        })
        if (!foundUser) {
            return res.status(404).json({ error: "The user has been validated or not yet been registered."})
        }
        User.update({ is_active: true, confirmation_token: ''},
            { where: { confirmation_token: token} })
        res.status(200).json({ status: "Verified" })
    },
    checkPerm: async(req, res, next) => {
        const { is_staff } = req.user
        if (is_staff) {
            res.status(200).json({ allowed: is_staff })
        }
        else {
            res.status(401).json({ allowed: is_staff })
        }
    },
    resetPass: async(req, res, next) => {
        // const { username, email, password } = req.body
        // const foundUser = await User.findOne({where: {email: email}})
        // if (foundUser) {
        //     return res.status(401).json({ error: "Email is already in use."})
        // }
        // const passwordHash = await processPassword(password)
        // const newUser = User.create({
        //     username: username, 
        //     email: email, 
        //     password: passwordHash})

        // const token = signToken(newUser)
        // res.status(200).json({ token })
    },
    // TODO: 'Search anything' feature
    searchByTag: async(req, res, next) => {
        // const { username, email, password } = req.body
        // const foundUser = await User.findOne({where: {email: email}})
        // if (foundUser) {
        //     return res.status(401).json({ error: "Email is already in use."})
        // }
        // const passwordHash = await processPassword(password)
        // const newUser = User.create({
        //     username: username, 
        //     email: email, 
        //     password: passwordHash})

        // const token = signToken(newUser)
        // res.status(200).json({ token })
    },
    getLeaderboardInfo: async(req, res, next) => {
        const { uid } = req.user
        try {
            const { id } = req.body
            let scores = await scoreModel.findAll({raw: true, order: [
            ['score', 'DESC']], limit: 5})
            let displayedScores = []
            for (var scoreIdx in scores) {
                let value = scores[scoreIdx]
                const config = { raw: true, where: { uid: value.user_id }};
                delete value.user_id;
                try {
                    let user = await User.findOne(config);
                    if (user) {
                        value.display_name = user.username
                        displayedScores[scoreIdx] = value
                    } else {

                    }
                }
                catch (error) {
                    console.log(error)
                } 
            }
            res.status(200).json(displayedScores)
        }
        catch(error) {
          console.error(error);
        }      
    }
}