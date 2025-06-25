import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import './CSS/display.css'

function display() {
    const navigate=useNavigate()
    const [taskName,setTaskName]=useState("")
    const [taskList,setList]=useState([])
    const [insert,setInsert]=useState("")

    const getAccessToken=()=>localStorage.getItem('accessToken')
    const getRefreshToken=()=> localStorage.getItem('refreshToken')

    const refreshAccessToken=async()=>{
        try{
            const refreshToken=getRefreshToken()
            if(!refreshToken){
                navigate('/login')
                return null
            }
            const res=await axios.post("http://localhost:3001/refresh-token",{refreshToken})
            localStorage.setItem('accessToken',res.data.accessToken)
            return res.data.accessToken
        }
        catch(error){
            navigate('/login')
            return null
        }
    }

    const axiosPostWithAuth =async(url,data)=>{
        let token=getAccessToken
        try{
            return await axios.post(url,data,{
                headers:{Authorization:`bearer ${token}`}
            })
        }
        catch(error){
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                token=await refreshAccessToken();
                if(!token) throw error
                return await axios.post(url,data,{
                    headers:{Authorization:`bearer ${token}`}
                })
            }
            throw error
        }
    }

    const handleData=async (e) =>{

        const stored = localStorage.getItem('selectedItem');
        const items = stored ? JSON.parse(stored) : null;
        const temp=await items.task
        setTaskName(temp)
        const req=await axiosPostWithAuth("http://localhost:3001/display",{
            taskName:temp
        })
        setList(req.data.taskList)
    }

    const addList =async ()=>{
        const req=await axiosPostWithAuth("http://localhost:3001/addList",{
            taskName:taskName,
            item:insert
        })
        setList(req.data.taskList)
        setInsert("")
    }

    const removeTask=async ()=>{
        const req=await axiosPostWithAuth("http://localhost:3001/removeTask",{
            taskName:taskName
            })
        navigate("/dashboard")
    }

    const removeItem=async (index)=>{
        const item=taskList[index]
        const req=await axiosPostWithAuth("http://localhost:3001/removeItem",{
            taskName:taskName,
            item:item
        })
        setList(req.data.taskList)
    }

    useEffect(()=>{
        handleData();
    },[])

  return (
    <div className='task-container'>
        <h1 className='task-title'>{taskName}</h1>
        <div className='input-group'>
        <input className='task-input' type='text' value={insert} onChange={(e)=>setInsert(e.target.value)} placeholder='enter the activity' />
        <button className='btn add-btn' type='button' onClick={addList} > Add</button>
        </div>
        <div className='task-list'>
            {taskList.map((task,index)=>(
                <div key={index} className='task-item'>
                    <span>{task}</span>
                    <button onClick={()=>removeItem(index)} className='btn remove-btn'>Remove</button>
                    </div>
            ))}
        </div>
        <button type='button' className='btn remove-task-btn' onClick={removeTask}>Delete Task</button>
    </div>
  )
}

export default display