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
            userName:userName.trim(),
            password:password.trim(),
            email:email.trim()
          });

          const {message, isSignup ,accessToken, refreshToken}=req.data
          localStorage.setItem('accessToken',accessToken)
          localStorage.setItem('refreshTokn',refreshToken)
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
    <div className='signup-page-wrapper'>
    <div className='signup-container'>
        <form className='signup-form' onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
            <div className='signup-form-group'>
                <label>Username</label>
                <input type="text" value={userName} onChange={(e)=>setUN(e.target.value)} required/>
            </div>
            <div className='signup-form-group'>
                <label>password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className='signup-form-group'>
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <button className='signup-button' type='submit' >Sign up</button>
            <p className='login-redirect'>Already have an account?<a href="/login">Login</a></p>
        </form>
    </div>
    </div>
  )
}

export default signup