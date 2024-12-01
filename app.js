
const express=require('express');
const courseRouter=require('./routes/courseRouter');


const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.end('hello world')
})

app.use('/courses',courseRouter);

module.exports=app;




