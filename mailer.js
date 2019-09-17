const nodemailer = require('nodemailer')
const Email = require('email-templates')
var EmailTemplate = require('email-templates').EmailTemplate

function initMailer() {
    let transporterConf = {
        name: "gmail.com",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: "soske.app@gmail.com",
            pass: "77ea34a9"
        },
        tls:{
            ciphers:'SSLv3'
        }
    }
    return {
        sendVerificationMail(address, username, name, tokenUrl) {
            const email = new Email({
                message: {
                  from: 'SOSKE for 8th SOS Camp <soske.app@gmail.com>',
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
