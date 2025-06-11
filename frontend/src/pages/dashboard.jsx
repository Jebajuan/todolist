import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'

function dashboard() {
  const [taskno,setTaskno]=useState()
  const [tasks,setTasks]=useState([]);
  const handleData= async (e) =>{
    const req=await axios.get("http://localhost:3001/dashboard")
    setTaskno(req.data.taskno)
    setTasks(req.data.taskNames)
  }

  const removeTask=async (index)=>{
    const taskName=tasks[index];
    const req=await axios.post("http://localhost:3001/removeTask",{
      taskName:taskName
    })
    setTasks(req.data.taskName)
  }

  const handleClick = (item) =>{
    localStorage.setItem('selectedItem', JSON.stringify(item));
    console.log(item)
  }
  useEffect(()=>{
    handleData();
  },[])
  return (
    <div>
      <h1>Dashboard</h1>
      Total number of Task {taskno}<br></br>
      Want to create a new task?<a href='/create'>Create</a><br></br>
      <div>
        {tasks.map((task,index)=>(
          <div key={index}>
          <a href='/display' onClick={()=>handleClick({task})}>{task}</a> <button type='button' onClick={()=>removeTask(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default dashboard