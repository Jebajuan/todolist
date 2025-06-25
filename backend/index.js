const express = require('express')
const mdb=require('mongoose')
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cors =require ('cors')

const SignUp=require('./models/signupschema')
const createTask=require('./models/createSchema')

dotenv.config()

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

mdb
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection Successfully");
  })
  .catch((err) => {
    console.log("Check your connection string", err);
  });

let refreshTokens = [];

const auth=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  const token= authHeader && authHeader.split(' ')[1]

  if(!token){
    return res.status(400).json({message:"Access denied"})
  }

  try{
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
    req.user=decoded
    next()
  }
  catch(err){
    return res.status(400).json({message:"Invalid token"})
  }
}

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
        if(password.length<5){
          return res.status(400).json({message:"Password should contain more than 6 characters",isSignup:false})
        }
        const hashPassword= await bcrypt.hash(password,10)
        const newSignUp=new SignUp({
            userName:lowerUserName,
            password:hashPassword,
            email:email,
        })
        await newSignUp.save()

        const payload={
          userName:lowerUserName
        }
        const accessToken=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"2h"})
        const refreshToken=jwt.sign(payload,process.env.REFRESH_SECRET_KEY,{expiresIn:"1d"})
        refreshTokens.push(refreshToken)
        res.status(201).json({message:"Signup Successful",isSignup:true,accessToken,refreshToken})
    } catch (error) {
        res.status(400).json({message:"Signup Failed",isSignup:false})
    }
})

app.post("/create",async(req,res)=>{
  try{
    const {userName,taskName,tasks}=req.body
    const lowerTaskname=taskName.toLowerCase()
    const task=await createTask.findOne({userName:userName,taskName:lowerTaskname})
    if(task){
      return res.status(400).json({message:"There is an existing task",isCreate:false})
     }
    if(tasks.length<1){
      console.log(userName)
      return res.status(400).json({message:"The list is empty",isCreate:false})
    }
    // console.log(userName)
    const newCreateTask = new createTask({
      userName:userName,
      taskName:lowerTaskname,
      taskList:tasks
    })
    await newCreateTask.save()
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
    const payload={
      userName:user.userName
    }
    const accessToken=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"2h"});
    const refreshToken=jwt.sign(payload,process.env.REFRESH_SECRET_KEY,{expiresIn:"1d"})
    refreshTokens.push(refreshToken)
    res.status(200).json({message:"Login successful",isLogin:true,accessToken,refreshToken})
  }
  catch(error){
    res.status(400).json({message:"Login failed",isLogin:false})
  }
})

app.post("/dashboard",auth,async (req,res)=>{
  try{
    const {userName}=req.body
    const count= await createTask.countDocuments({userName:userName})
    const tasks= await createTask.find({userName:userName}, "taskName")
    const taskNames=tasks.map(task=> task.taskName)
    res.status(200).json({taskno:count,taskNames:taskNames})
  }
  catch(error){
    res.status(400).json({message:"Display failed"})
  }
})

app.post("/display",auth,async (req,res)=>{
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

app.post("/removeTask",auth,async (req,res)=>{
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

app.post("/removeItem",auth,async (req,res)=>{
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

app.post("/addList",auth,async(req,res)=>{
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

app.post("/refresh-token",(req,res)=>{
  const {refreshToken}=req.body
  if(!refreshToken){
    return res.status(400).json({message:"No refresh Token"})
  }
  if(!refreshToken.includes(refreshTokens)){
    return res.status(400).json({message:"Invalid refresh token"})
  }

  try{
    const decoded=jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY);
    const payload={userName:decoded.userName}
    const accessToken=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"2h"})
    res.status(200).json({accessToken})
  }
  catch(err){
    res.status(400).json({message:"Refresh token invalid"})
  }
})

app.post("/logout",(req,res)=>{
  const {refreshToken}=req.body
  refreshTokens=refreshTokens.filter(token=>token !== refreshToken);
  res.status(200).json({message:"Logout successfull"})
})

app.listen(PORT,()=>console.log("Server started successfully"))