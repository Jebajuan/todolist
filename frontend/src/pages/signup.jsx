import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function signup() {
    const [username,setUN]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const navigate=useNavigate()
    const handleSignUp= async (e) =>{
        e.preventDefault()
        const req=await axios.post("http://localhost:3001/signup",{
            userName:username,
            password:password,
            email:email
          })
          const {message,isSignup} =req.data;
          if(!isSignup){
            alert(message)
          }else{
            navigate("/login") 
          }
    }
  return (
    <div>
        <form onSubmit={handleSignUp}>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e)=>setUN(e.target.value)} required/>
            </div>
            <div>
                <label>password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <button type='submit'>Sign up</button>
        </form>
        already have an account 
        <a href='/login'>Login</a>
    </div>
  )
}

export default signup