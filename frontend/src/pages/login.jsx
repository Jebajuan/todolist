import  React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/login.css'

function Login() {
  const [userName, setUN] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const req = await axios.post(`${API_BASE_URL}/login`, {
        userName:userName.trim(),
        password:password.trim()
      },{
        withCredentials:true,
        headers:{
          'Content-Type':'application/json'
        }
      });

      const { message, isLogin, accessToken, refreshToken } = req.data;

      if (isLogin) {
        localStorage.setItem('accessToken',accessToken)
        localStorage.setItem('refreshToken',refreshToken)
        navigate("/dashboard");
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message);
    }
  };

  React.useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'visible'; 
  };
  }, []);

  return (
    <div className='login-page-wrapper'>
    <div className='login-container'>
      <form className='login-form'  onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className='form-group'>
          <label>Enter Username: </label>
          <input type="text" value={userName} onChange={(e) => setUN(e.target.value)} required />
        </div>
        <div className='form-group'>
          <label>Enter Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className='login-button' type='submit'>Login</button>
        <p className='signup-link'>Don't have an account?<a href='/signup'>Create Account</a></p>
      </form>
    </div>
    </div>
  );
}

export default Login;
