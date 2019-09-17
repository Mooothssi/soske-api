const fs = require('fs')
const path = require('path');

module.exports = {
    server_secret: fs.readFileSync(path.join(__dirname, './private.key')),
    server_pub_secret: fs.readFileSync(path.join(__dirname, './public.pem'))
}