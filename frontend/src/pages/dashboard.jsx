import axios from 'axios'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import './CSS/dashboard.css'

function dashboard() {
  const [userName,setUN]=useState("");
  const [taskno,setTaskno]=useState()
  const [tasks,setTasks]=useState([]);
  const navigate=useNavigate()

  const getAccessToken=()=> localStorage.getItem('accessToken')
  const getRefreshToken=()=> localStorage.getItem('refreshToken')

  const refreshAccessToken=async() =>{
    try{
      const refreshToken=getRefreshToken()
      if(!refreshToken){
        navigate("/login")
        return null
      }
      const res=await axios.post("http://localhost:3001/refresh-token",{refreshToken})
      localStorage.setItem('accsessToken',res.data.accessToken)
      return res.data.accessToken
    }
    catch(err){
      navigate("/login")
      return null
    }
  }

  const axiosPostWithAuth=async(url,data)=>{
    let token=getAccessToken();
    try{
      return await axios.post(url,data,{
        headers:{Authorization:`Bearer ${token}`}
      })
    }catch(error){
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        token = await refreshAccessToken();
        if (!token) throw error;

        return await axios.post(url, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      throw error;
    }
  }

  const handleData= async (user) =>{
    try{
      const req=await axiosPostWithAuth("http://localhost:3001/dashboard",{
        userName:user
      })
      const {taskno, taskNames}=req.data
      setTaskno(taskno)
      setTasks(taskNames)
    }
    catch(error){
      alert("error")
    }
  }

  const removeTask=async (index)=>{
    try{
      const taskName=tasks[index];
      const req=await axiosPostWithAuth("http://localhost:3001/removeTask",{
        userName:userName,
        taskName:taskName
      })
      setTasks(req.data.taskName)
      setTaskno(prev=>prev-1)
    }catch(error){
      console.log("Failes to remove task");
    }
  }

  const handleClick = (item) =>{
    localStorage.setItem('selectedItem', JSON.stringify(item));
  }

  useEffect(()=>{
    const run=async ()=>{
      const token=getAccessToken()
      if(token){
        try{
          const decoded=jwtDecode(token);
          setUN(decoded.userName)
          await handleData(decoded.userName)
        }
        catch(error){
          navigate("/signup")
        }
      }
    }
    run()
  },[])



  return (
    <div className='dashboard-content'>
      <h1 className='dashboard-title'>Dashboard</h1>
      <p className='task-summary'>Total number of Task: {taskno}</p>
      
      <div className='task-list'>
        {tasks.map((task,index)=>(
          <div className='task-card' key={index}>
          <a className='task-name' href='/display' onClick={()=>handleClick({task})}>{task}</a>
           <button className='task-remove' type='button' onClick={()=>removeTask(index)}>Remove</button>
          </div>
        ))}
      </div>
      <p className='create-prompt'>Want to create a new task?<a className='create-link' href='/create'>Create</a></p>
    </div>
    
  )
}

export default dashboard