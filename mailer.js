const nodemailer = require('nodemailer')
const Email = require('email-templates')
const config = require('./config')
let EmailTemplate = require('email-templates').EmailTemplate

function initMailer() {
    let transporterConf = {
        name: config.emailer.hostname,
        host: config.emailer.smtp_host,
        port: config.emailer.smtp_port,
        secure: true, 
        auth: {
            user: config.emailer.username,
            pass: config.emailer.password
        },
        tls:{
            ciphers:'SSLv3'
        }
    }
    return {
        sendVerificationMail(address, username, name, tokenUrl) {
            const email = new Email({
                message: {
                  from: `${config.emailer.sender_fullname} <${transporterConf.auth.user}>`,
                  subject: 'SOSKE | Email Confirmation'
                },
                send: true,
                transport: nodemailer.createTransport(transporterConf),
                views: {
                    options: {
                        extension: 'ejs'
                    }
                }
              });
            email.send(
                {
                    template: 'verifyEmail',
                    message: { to: address },
                    locals: {
                        name: name,
                        username: username,
                        email: address,
                        token: tokenUrl
                    }
                }
            ).catch (console.error)
             .then(console.log)
        }
    }
}

module.exports = initMailer
