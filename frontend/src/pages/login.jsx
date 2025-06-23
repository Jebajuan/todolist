import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

      const { message, isLogin } = req.data;

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Enter Username: </label>
          <input type="text" value={userName} onChange={(e) => setUN(e.target.value)} required />
        </div>
        <div>
          <label>Enter Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type='submit'>Login</button>
      </form>
      <div>Don't have an account? <a href='/signup'>Create Account</a></div>
    </div>
  );
}

export default Login;
