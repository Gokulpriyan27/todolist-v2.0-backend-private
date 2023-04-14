const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({

    username:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    temp_token:{
        type:Array,
    },
    googleId:{
        type:String,
    }


},
{timestamps:true}
)

module.exports = mongoose.model("users",UserModel);