import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function login() {
    const [username,setUN]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate()
    const handlelogin =async (e)=>{
        e.preventDefault();
        const req=await axios.post("http://localhost:3001/login",{
            userName:username,
            password:password
        })
        const message=req.data.message
        const isLogin=req.data.isLogin
        if(!isLogin){
            alert(message)
        }else{
            navigate("/dashboard")
        }
    }
  return (
    <div>
        <form onSubmit={handlelogin}>
            <div>
                <label htmlFor="">Username:</label>
                <input type="text" value={username} onChange={(e)=>setUN(e.target.value)} required/>
            </div>
            <div>
                <label htmlFor="">Password:</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button type='submit'>Sign in</button>
        </form>
        don't have an account?
        <a href='/signup'>signup</a>
    </div>
  )
}

export default login