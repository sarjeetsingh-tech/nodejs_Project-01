const fs = require("fs");

function logIncomingRequest(filename) {
    return (req, res, next) => {
        const currentTime = new Date().toLocaleTimeString();
        const log = `${req.path} -- ${currentTime}\n`;

        fs.appendFile(filename, log, 'utf-8', (err) => {
            if (err) {
                console.error('Error appending to file:', err);
            }
        });
        next();
    }
}
module.exports={logIncomingRequest};