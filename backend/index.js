const express = require('express')
const mdb=require('mongoose')
const app = express()
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')

app.use(express.json())
const cors =require ('cors')
app.use(cors())
const SignUp=require('./models/signupschema')
const createTask=require('./models/createSchema')

const PORT = 3001
dotenv.config()

mdb
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection Successfully");
  })
  .catch((err) => {
    console.log("Check your connection string", err);
  });

app.get("/",(req,res)=>{
    res.send("<h1> Welcome to Backend Server</h1>")
})

app.post("/signup", async (req,res)=>{
    try {
        const{userName,password,email}=req.body
        const lowerUserName=userName.toLowerCase()
        const user=await SignUp.findOne({userName:lowerUserName})
        if(user){
          return res.status(400).json({message:"Username already exist",isSignup:false})
        }
        if(password.length<6){
          return res.status(400).json({message:"Password should contain more than 6 characters",isSignup:false})
        }
        const hashPassword= await bcrypt.hash(password,10)
        const newSignUp=new SignUp({
            userName:lowerUserName,
            password:hashPassword,
            email:email,
        })
        newSignUp.save()
        res.status(201).json({message:"Signup Successful",isSignup:true})
    } catch (error) {
        res.status(400).json({message:"Signup Failed",isSignup:false})
    }
})

app.post("/create",async(req,res)=>{
  try{
    const {taskName,tasks}=req.body
    const lowerTaskname=taskName.toLowerCase()
    const task=await createTask.findOne({taskName:lowerTaskname})
    //console.log(lowerTaskname)
    if(task){
      return res.status(400).json({message:"There is an existing task",isCreate:false})
    }
    if(tasks.length<1){
      return res.status(400).json({message:"The list is empty",isCreate:false})
    }
    const newCreateTask = new createTask({
      taskName:lowerTaskname,
      taskList:tasks,
    })
    newCreateTask.save()
    res.status(201).json({message:"Task created successfully",isCreate:true})
  }
  catch(error){
    res.status(400).json({message:"Task creation failed",isCreate:false})
  }
})

app.post("/login",async (req,res)=>{
  try{
    const{userName,password}=req.body
    const lowerUserName=userName.toLowerCase()
    const user=await SignUp.findOne({userName:lowerUserName})
    if(!user){
      return res.status(400).json({message:"Username does not exsist",isLogin:false})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({message:"Incorrect password",isLogin:false});
    }
    res.status(200).json({message:"Login successful",isLogin:true})
  }
  catch(error){
    res.status(400).json({message:"Login failed",isLogin:false})
  }
})

app.get("/dashboard",async (req,res)=>{
  try{
    const count= await createTask.countDocuments()
    const tasks= await createTask.find({},"taskName")
    const taskNames=tasks.map(task=> task.taskName)
    res.status(200).json({taskno:count,taskNames:taskNames})
  }
  catch(error){
    res.status(400).json({message:"Display failed"})
  }
})

app.post("/display",async (req,res)=>{
  try{
    const {taskName}=req.body
    const task=await createTask.findOne({taskName:taskName})
    const taskList=task.taskList
    res.status(200).json({taskList})
  }
  catch{
    res.status(400).json({message:"Display failed"})
  }
})

app.post("/removeTask",async (req,res)=>{
  try{
    const {taskName}=req.body
    await createTask.deleteOne({taskName:taskName})
    const tasks= await createTask.find({},"taskName")
    const taskNames=tasks.map(task=> task.taskName)
    console.log(taskName)
    res.status(200).json({message:"Deletion Sucessful",taskName:taskNames})
  }
  catch(error){
    res.status(400).json({message:"Deletion Failed"})
  }
})

app.post("/removeItem",async (req,res)=>{
  try{
    const {taskName,item}=req.body
    await createTask.updateOne({taskName:taskName},{$pull:{taskList:item}})
    const task=await createTask.findOne({taskName:taskName})
    const taskList=task.taskList
    res.status(200).json({taskList:taskList})
  }
  catch(error){
    res.status(400).json({message:"Deletion failed"})
  }
})

app.post("/addList",async(req,res)=>{
  try{
    const {taskName,item}=req.body
    await createTask.updateOne({taskName:taskName},{$push:{taskList:item}})
    const task=await createTask.findOne({taskName:taskName})
    const taskList=task.taskList
    res.status(200).json({taskList:taskList})
  }
  catch(error){
    res.status(400).json({message:"Insertion failed"})
  }
})

app.listen(PORT,()=>console.log("Server started successfully"))