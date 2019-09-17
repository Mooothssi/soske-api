const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const JWT_SECRET = require('./config').server_pub_secret
const User = require('./controllers/users')
const Op = require("sequelize").Op

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
    algorithms: ['RS256']
}, async (payload, done) => {
    try {
        const user = await User.users.findOne({ where: {[Op.and]: { username: payload.sub, is_active: true } }})
        if (!user) {
            return done(null, false)
        }
        done(null, user)
    }
    catch (error) {
      done(error, false)
    }
}))

passport.use(new LocalStrategy({
    username: 'username'
}, async (username, password, done) => {
    try {
        const user = await User.users.findOne({ where:{[Op.and]: { username: username, is_active: true } } })
        if (!user) {
            return done(null, false, 'Invalid SOSKE-ID or password')
        }
        const isPasswordValid = await User.validatePassword(password, user.password)
        if (!isPasswordValid) {
            return done(null, false, 'Invalid SOSKE-ID or password')
        }
        done(null, user)
    } catch (error) {
        done(error, false, 'Invalid SOSKE-ID or password')
    }
   
}))