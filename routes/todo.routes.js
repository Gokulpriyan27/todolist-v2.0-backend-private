const express = require("express");

const router = express.Router();

const {getTodos,createTodos,getSingleTodo,updateTodo,deleteTodo} =require("../controllers/todo.controller")


//get todos

router.get("/gettodos/:userid",getTodos);

//getSingleTodo

router.get("/gettodo/:userid/:todoid",getSingleTodo)

//post todo

router.post("/createtodo/:userid",createTodos);

//update todo

router.put("/updatetodo/:userid/:todoid",updateTodo);

//delete todo

router.delete("/deletetodo/:userid/:todoid",deleteTodo)

module.exports = router;