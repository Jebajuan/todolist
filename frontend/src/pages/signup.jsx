import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import './CSS/signup.css'

function signup() {
    const [userName,setUN]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const navigate=useNavigate()
    const handleSignUp= async (e) =>{
        e.preventDefault()
        try{
          const req= await axios.post("http://localhost:3001/signup",{
            userName,
            password,
            email
          });

          const {message, isSignup}=req.data

          if(isSignup){
            navigate("/dashboard")
          }else{
            alert(message)
          }
        }
        catch(err){
          alert(err.response?.data?.message)
        }
    }

  return (
    <div >
        <form onSubmit={handleSignUp}>
            <div id='input'>
                <label>Username</label>
                <input type="text" value={userName} onChange={(e)=>setUN(e.target.value)} required/>
            </div>
            <div id='input'>
                <label>password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div id='input'>
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div>
              <button type='submit'>Sign up</button>
            </div>
        </form>
        already have an account 
        <a href='/login'>Login</a>
    </div>
  )
}

export default signup