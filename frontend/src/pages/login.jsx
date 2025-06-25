import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './CSS/login.css'

function Login() {
  const [userName, setUN] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const req = await axios.post("http://localhost:3001/login", {
        userName,
        password
      });

      const { message, isLogin, accessToken, refreshToken } = req.data;
      localStorage.setItem('accessToken',accessToken)
      localStorage.setItem('refreshToken',refreshToken)
      if (isLogin) {
        navigate("/dashboard");
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className='form-group'>
          <label>Enter Username: </label>
          <input type="text" value={userName} onChange={(e) => setUN(e.target.value)} required />
        </div>
        <div className='form-group'>
          <label>Enter Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className='submit-btn' type='submit'>Login</button>
        <p className='signup-redirect'>Don't have an account?<a href='/signup'>Create Account</a></p>
      </form>
    </div>
  );
}

export default Login;
