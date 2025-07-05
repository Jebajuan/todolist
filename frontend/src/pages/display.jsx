import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import './CSS/display.css'

function display() {
    const navigate=useNavigate()
    const [userName,setUN]=useState("")
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
                localStorage.removeItem('selectedItem')
                return null
            }
            const res=await axios.post("http://localhost:3001/refresh-token",{refreshToken})
            localStorage.setItem('accessToken',res.data.accessToken)
            return res.data.accessToken
        }
        catch(error){
            navigate('/login')
            localStorage.removeItem('selectedItem')
            return null
        }
    }

    const axiosPostWithAuth =async(url,data)=>{
        let token=getAccessToken()
        try{
            return await axios.post(url,data,{
                headers:{Authorization:`Bearer ${token}`}
            })
        }
        catch(error){
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                token=await refreshAccessToken();
                if(!token) throw error
                return await axios.post(url,data,{
                    headers:{Authorization:`Bearer ${token}`}
                })
            }
            throw error
        }
    }

    const handleData=async (user) =>{
        const stored = localStorage.getItem('selectedItem');
        
        const items = stored ? JSON.parse(stored) : null;
        const temp=items.task
        setTaskName(temp)
        const req=await axiosPostWithAuth("http://localhost:3001/display",{
            userName:user,
            taskName:temp
        })
        setList(req.data.taskList || [])
        
    }

    const addList =async ()=>{
        if(!insert.trim()){
            alert("Enter a item");
            return
        }
        try{
            const req=await axiosPostWithAuth("http://localhost:3001/addList",{
                userName:userName,
                taskName:taskName,
                item:insert.trim()
            })
            setList(req.data.taskList || [])
            setInsert("")
        }catch(error){
            alert("Failed to add item")
        }
    }

    const removeTask=async ()=>{
        try{
            const req=await axiosPostWithAuth("http://localhost:3001/removeTask",{
                userName:userName,
                taskName:taskName
                })
            navigate("/dashboard")
            localStorage.removeItem('selectedItem')
        }catch(error){
            alert("failed to remove task")
        }
    }

    const removeItem=async (index)=>{
        try{
            const item=taskList[index]
            const req=await axiosPostWithAuth("http://localhost:3001/removeItem",{
                userName:userName,
                taskName:taskName,
                item:item
            })
            setList(req.data.taskList || [])
        }catch(error){
            alert("Failed to remove item");
        }
    }
    

    useEffect(()=>{
        const run=async()=>{
            const token=getAccessToken()
            if(token){
                try{
                    const decoded=jwtDecode(token)
                    setUN(decoded.userName)
                    await handleData(decoded.userName)
                }
                catch(error){
                    navigate('/login')
                    localStorage.removeItem('selectedItem')
                }
            }
        }
        run();
    },[])

  return (
    <div className='display-container'>
        <h1 className='task-title'>{taskName}</h1>
        <div className='add-item-container'>
        <input className='task-input' type='text' value={insert} onChange={(e)=>setInsert(e.target.value)} placeholder='enter the activity' />
        <button className='add-btn' type='button' onClick={addList} > Add</button>
        </div>
        <div className='task-list'>
            {taskList.map((task,index)=>(
                <div className='task-item' key={index} >
                    <span className='item-text'>{task}</span>
                    <button className='remove-item-btn' onClick={()=>removeItem(index)} >Remove</button>
                    </div>
            ))}
        </div>
        <button className='delete-task-btn' type='button'  onClick={removeTask}>Delete Task</button>
    </div>
  )
}

export default display