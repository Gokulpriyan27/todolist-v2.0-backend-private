const mongoose = require("mongoose");

const passportModel = new mongoose.Schema({
    googleId:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model("passport",passportModel);