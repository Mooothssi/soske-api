const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const JWT_SECRET = require('./config').server_secret
const User = require('./controllers/users')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.users.findOne({ where: {uid: payload.sub} })
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
        const user = await User.users.findOne({ where: {username: username} })
        if (!user) {
            return done(null, false)
        }
        const isPasswordValid = await User.validatePassword(password, user.password)
        if (!isPasswordValid) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
   
}))