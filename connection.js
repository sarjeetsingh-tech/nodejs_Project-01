const mongoose = require("mongoose");
async function buildConnection(url) {
    return mongoose.connect(url)
}
module.exports=buildConnection;