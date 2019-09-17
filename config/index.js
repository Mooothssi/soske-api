const fs = require('fs')
const path = require('path');
const ini = require('ini')
//If don't assign the parameter delimiter then the default value \n will be used
const commonPath = path.join(__dirname, "../../common").toString()
const settingsPath = path.join(commonPath, "settings.ini").toString()
const commonConfig = ini.parse(fs.readFileSync(settingsPath, 'utf-8'));

function config(propertyName, defaultValue="") {
    const val = commonConfig.settings[propertyName];
    if (!val) {
        return defaultValue
    } else {
        return commonConfig.settings[propertyName];
    }
}

module.exports = {
    database: {
        name: config("DATABASE_NAME", "soske_maindb"),
        port: config("DATABASE_PORT", 3306),
        hostname: config("DATABASE_HOSTNAME", "soske-db"),
        username: config("DATABASE_USERNAME", "root"),
        password: config("DATABASE_PASSWORD"),
        dialect: config("DATABASE_DIALECT", "mysql")
    },
    emailer: {
        hostname: config("MX_HOSTNAME", "gmail.com"),
        smtp_port: config("MX_SMTP_PORT", 465),
        smtp_host: config("MX_SMTP_HOSTNAME", "smtp.gmail.com"),
        username: config("MX_USERNAME"),
        password: config("MX_PASSWORD"),
        sender_fullname: config("MX_USER_FULLNAME")
    },
    server_secret: fs.readFileSync(path.join(commonPath, config("PRIVATE_SECRET_PATH"))),
    server_pub_secret: fs.readFileSync(path.join(commonPath, config("PUBLIC_SECRET_PATH")))
}