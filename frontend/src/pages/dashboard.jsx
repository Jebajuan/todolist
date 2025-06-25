import axios from 'axios'
import {useState, useEffect} from 'react'
// import './CSS/dashboard.css'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

function dashboard() {
  const [userName,setUN]=useState("")
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
      localStorage.setItem(res.data.accessToken)
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
    const taskName=tasks[index];
    const req=await axiosPostWithAuth("http://localhost:3001/removeTask",{
      taskName:taskName
    })
    setTasks(req.data.taskName)
    setTaskno(prev=>prev-1)
  }

  const handleClick = (item) =>{
    localStorage.setItem('selectedItem', JSON.stringify(item));
  }

  useEffect(()=>{
    const run=async ()=>{
      const token=getAccessToken()
      if(token){
        try{
          const decoded=jwtDecode(token)
          setUN(decoded.userName)
          await handleData(decoded.userName)
        }
        catch(error){
          navigate("/login")
        }
      }
    }
    run()
  },[])



  return (
    <div className='dashboard-container'>
      <h1>Dashboard</h1>
      <p className='task-count'>Total number of Task: {taskno}</p>
      
      <div className='tasks-container'>
        {tasks.map((task,index)=>(
          <div key={index}>
          <a href='/display' onClick={()=>handleClick({task})}>{task}</a> <button type='button' onClick={()=>removeTask(index)}>Remove</button>
          </div>
        ))}
      </div>
      <p>Want to create a new task?<a href='/create'>Create</a></p>
    </div>
  )
}

export default dashboard