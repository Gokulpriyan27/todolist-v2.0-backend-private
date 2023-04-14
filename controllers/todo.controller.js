const todos = require("../models/todo.model");

const getTodos = async(req,res)=>{
    try {
        const userid = req.params.userid;
        const getTodo = await todos.find({userId:userid});
        return res.status(200).send({data:getTodo,message:"List of todos"});
    } catch (error) {
        return res.status(401).send({message:"Cannot get todos",error:error})
    }
}


const getSingleTodo = async(req,res)=>{
    try {
        const userid = req.params.userid;
        const todoid = req.params.todoid;
    

        const getSingle = await todos.findOne({_id:todoid});

        return res.status(200).send({data:getSingle})
    } catch (error) {
        return res.status(500).send({message:"Cannot get this todo"})
    }
}


const createTodos = async(req,res)=>{
    try {
        const payload = req.body;
       
        const createTodo = await new todos({...payload,userId:req.params.userid});
        await createTodo.save();
        return res.status(201).send({message:"content created successfully"});
    } catch (error) {
        return res.status(401).send({message:"Cannot create content",error:error})
    }
}


const updateTodo = async(req,res)=>{
    try {
        const todoid = req.params.todoid;

        const update = await todos.findByIdAndUpdate({_id:todoid},{$set:req.body});

        await update.save();
        return res.status(200).send({message:"Updated successfully"})
    } catch (error) {
         return res.status(500).send({message:"Couldn't update content",error:error})
    }
}


const deleteTodo = async(req,res)=>{
    try {
        const todoid = req.params.todoid;
        await todos.findByIdAndDelete({_id:todoid});
        return res.status(201).send({message:"Deletion successful!"})
    } catch (error) {
         return res.status(500).send({message:"Couldn't delete content",error:error})
    }
}
module.exports = {getTodos,createTodos,getSingleTodo,updateTodo,deleteTodo}