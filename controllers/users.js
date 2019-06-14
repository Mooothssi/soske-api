const JWT = require('jsonwebtoken')
const secret = require('../config').server_secret
const User = require('../models/users')
const bcrypt = require('bcryptjs')

function signToken (user) {
    return JWT.sign({
        iss: "SOSKE",
        sub: user.uid,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, secret)
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
            console.log(newPwd)
            console.log(hashed)
            return await bcrypt.compare(newPwd, hashed)
        } catch (error) {
            throw new Error(error)
        }
    },
    signUp: async(req, res, next) => {
        const { username, email, password } = req.body
        const foundUser = await User.findOne({where: {email:email}})
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

    },
    signIn: async(req, res, next) => {
        const token = signToken(req.user)
        const username = req.user.username
        res.status(200).json({ token, username })
    }
}