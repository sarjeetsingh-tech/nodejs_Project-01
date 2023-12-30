const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String
    },
    ip_address: {
        type: String
    }
})
const User = mongoose.model("User", userSchema);
module.exports=User;