const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const date = require(__dirname+'/date.js')

mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser:true,useUnifiedTopology:true});

const tasks = ['Buy Food','Cook Food','Eat Food'];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static('public')); 

const taskSchema = new mongoose.Schema({
    task: String,
});

const Task = mongoose.model("Task",taskSchema);

const buy_food = new Task({
    task: "Buy your Food as early",
});
const cook_food = new Task({
    task: "Cook your Food as early",
});
const eat_food = new Task({
    task: "Eat your Food as early",
});
const defaultsTask = [buy_food,cook_food,eat_food];


app.get("/", (req , res) => {
    const day = date.getDate();
    Task.find({},function(err,foundTasks){
        if(foundTasks.length===0){
                Task.insertMany(defaultsTask,function (err) {
        if(err){console.log(err);
        }else{
            console.log("Sucess added");
        }
         });
        res.redirect("/"); 
        }else{
                res.render('list',{
                kindOfDay:day,
                task:foundTasks,
                });
            }
    })
});

app.post("/", (req,res)=>{
    const task = req.body.task;
    const newTask = new Task({
        task:task,
    });
    newTask.save();
    res.redirect("/");
})

app.post("/delete", (req,res)=>{
    const delTask_id = (req.body.checkbox);
    console.log(delTask_id);
    Task.findOneAndRemove(delTask_id,function(err){
       if(!err){ 
           console.log("del");
           res.redirect("/");
       }else{
           console.log(err);
       }
    });
});

app.listen(3000, ()=>{ console.log("Running at port 3000"); })