const mongoose =require("mongoose");

const connect = async()=>{
    try {
        await mongoose.connect(process.env.database);
        console.log("Connected to database")
    } catch (error) {
        console.log("DB Connection failed",error)
    }
}

module.exports =connect;