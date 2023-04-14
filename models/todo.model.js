const mongoose =require("mongoose");

const TodoModel = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true

    },
    title:{
        type:String,
        required:true,
    },
    details:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

module.exports = mongoose.model("todos",TodoModel);