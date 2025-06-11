import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function display() {
    const navigate=useNavigate()
    const [taskName,setTaskName]=useState("")
    const [taskList,setList]=useState([])
    const [insert,setInsert]=useState("")
    const handleData=async (e) =>{

        const stored = localStorage.getItem('selectedItem');
        const items = stored ? JSON.parse(stored) : null;
        const temp=await items.task
        setTaskName(temp)
        const req=await axios.post("http://localhost:3001/display",{
            taskName:temp
        })
        setList(req.data.taskList)
    }

    const addList =async ()=>{
        const req=await axios.post("http://localhost:3001/addList",{
            taskName:taskName,
            item:insert
        })
        setList(req.data.taskList)
        setInsert("")
    }

    const removeTask=async ()=>{
        const req=await axios.post("http://localhost:3001/removeTask",{
            taskName:taskName
            })
        navigate("/dashboard")
    }

    const removeItem=async (index)=>{
        const item=taskList[index]
        const req=await axios.post("http://localhost:3001/removeItem",{
            taskName:taskName,
            item:item
        })
        setList(req.data.taskList)
    }

    useEffect(()=>{
        handleData();
    },[])

  return (
    <div>
        <h3>{taskName}</h3>
        <button type='button' onClick={removeTask}>Remove</button>
        <input type='text' value={insert} onChange={(e)=>setInsert(e.target.value)} placeholder='enter the activity' />
        <button type='button' onClick={addList} > Add</button>
        <div>
            {taskList.map((task,index)=>(
                <div key={index}>
                    {task}<button onClick={()=>removeItem(index)}>Remove</button>
                    </div>
            ))}
        </div>
    </div>
  )
}

export default display