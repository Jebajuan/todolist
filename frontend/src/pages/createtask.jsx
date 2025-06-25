import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
// import './CSS/create.css'

function createtask() {
    const [userName,setUN]=useState("")
    const [taskName,setTN]=useState("");
    const [inputValue,setIV]=useState("");
    const [items,setItems]=useState([]);
    const navigate=useNavigate();

    const getAccessToken=()=>localStorage.getItem('accessToken')
    const getRefreshToken=()=> localStorage.getItem('refreshToken')

    const retrieveuser=()=>{
        const token=getAccessToken()
        
        if(token){
          try{
            const decoded=jwtDecode(token)
            setUN(decoded.userName)
          }
          catch(error){
            alert("invalid token");
          }
        }
      }
    
    useEffect(()=>{
        retrieveuser();
      },[])

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

    const handleCreation=async (e)=>{
        e.preventDefault();
        try{
            const req=await axiosPostWithAuth("http://localhost:3001/create",{
                userName:userName,
                taskName:taskName,
                tasks:items
            });
            const {message,isCreate}=req.data
            console.log(message)
            if(!isCreate){
                alert(message)
            }else{
                navigate("/dashboard")
            }
        }
        catch(error){
            alert("error")
        }
    }

    const add=(e)=>{
        e.preventDefault();
        if(inputValue.trim()!== ''){
            setItems([...items,inputValue]);
            setIV('');
        }
    };

    const removeItem=(indexToRemove)=>{
        setItems(items.filter((_,index)=>index!==indexToRemove));
    };

  return (
    <div>
        <h1>Create a Task</h1>
        <form onSubmit={handleCreation}>
            <div >
                <label>Enter the task name:</label>
                <input  type="text" value={taskName} onChange={(e)=>setTN(e.target.value)} required />
            </div>
            <div >
                <label>Enter the todo things:</label>
                <input  type="text" value={inputValue} onChange={(e)=>setIV(e.target.value)}/>
                <button  onClick={add}>Add to List</button>
            </div>
            {items.length>0 &&(
                <div >
                    <h3 >Todo items</h3>
                    <ul >
                        {items.map((item,index)=>(
                            <li key={index}>
                                <span>{item}</span>
                            <button  type="button" onClick={()=>removeItem(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button type='submit' >Add task</button>
        </form>
    </div>
  )
}

export default createtask;