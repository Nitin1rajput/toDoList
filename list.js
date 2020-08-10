const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify: false });



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static('public')); 

const taskSchema = new mongoose.Schema({

    task: String,
});
const listSchema = new mongoose.Schema({

    name: {
        type:String,
        required:true,
    },
    items: [taskSchema],
});

const Task = mongoose.model("Task",taskSchema);
const List = mongoose.model("list", listSchema);

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
    
    Task.find({},function(err,foundTasks){
        if(foundTasks.length===0){
        Task.insertMany(defaultsTask,function (err) {
        if(err){console.log(err);
        }else{
            console.log("Sucess added");
            res.redirect("/"); 
        }
         });
        }else{
                res.render('list',{
                kindOfDay:"Today",
                task:foundTasks,
                });
            }
    })
});

app.post("/", (req,res)=>{
    const task = req.body.task;
    const listName = req.body.submit;
    const newTask = new Task({
        task:task,
    });

    if(listName==="Today"){
        newTask.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}, function(err,foundList){
            foundList.items.push(newTask);
            foundList.save();
            res.redirect("/"+listName);
        });
    }

})

app.post("/delete", (req,res)=>{
    const delTask_id =( req.body.checkbox);
    const listName = req.body.listName;
    // console.log(delTask_id.length-1);
    let str = delTask_id.slice(0,24);
    // console.log(str.length);
    mongoose.isValidObjectId(new mongoose.Types.ObjectId(str));
    if(listName==="Today"){
        // console.log(delTask_id);
        Task.findOneAndRemove(str,function(err){
       if(!err){ 
        //    console.log("del");
           res.redirect("/");
       }else{
           console.log(err);
       }
        });
    }
    else{
          List.findOneAndUpdate({name:listName},{$pull:{items:{_id:str}}},function (err,result) {
            if(!err){
                // console.log("Hora hai");
                res.redirect("/"+listName);
        }else{
            console.log(err);
        }
        });
        
        
   
    }
    
});

//custiom lists or routes

app.get("/:customListRoute",function(req,res){
    const customListRoute = req.params.customListRoute;
    List.findOne({name:customListRoute},function (err,foundList) {
        if(!err){
            if(!foundList){
                const list = new List({
                    name:customListRoute,
                    items:defaultsTask,
                });
                list.save();
                console.log("dobara");
                res.redirect("/"+customListRoute);
            }else{
                console.log("binadobara");
                res.render("list",{
                    kindOfDay:foundList.name,
                    task:foundList.items,
                    });

            }
        }        
    })
})

app.listen(3000, ()=>{ console.log("Running at port 3000"); })