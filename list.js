const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const date = require(__dirname+'/date.js')


const tasks = ['Buy Food','Cook Food','Eat Food'];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static('public')); 



app.get("/", (req , res) => {
    const day = date.getDate();

    res.render('list',{
        kindOfDay:day,
        task:tasks
    });
});

app.post("/", (req,res)=>{
    let task = req.body.task;
    tasks.push(task);
    
    res.redirect("/");
})

app.listen(3000, ()=>{ console.log("Running at port 3000"); })