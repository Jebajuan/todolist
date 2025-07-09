import React from 'react'
import {Link, useNavigate , useLocation} from 'react-router-dom'
import axios from 'axios'
import './CSS/navbar.css'

function navbar() {

  const navigate=useNavigate()
  const location=useLocation()
  
  const API_BASE_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

  const handleLogout=async()=>{
    const refreshToken=localStorage.getItem('refreshToken')
    if(refreshToken){
      try{
        await axios.post(`${API_BASE_URL}/logout`,{refreshToken},{
        withCredentials:true,
        headers:{
          'Content-Type':'application/json'
        }
      })
        alert("logout Successful");
      }
      catch(error){
        alert("Logout failed")
      }
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <div className='navbar-container'>
        <nav className='navbar-nav'>
            <ul className='navbar-list'>
                <li className='navbar-item'><Link to='/dashboard' className={`navbar-link ${location.pathname==='/dashboard' ? 'active' :''}`}>DashBoard</Link></li>
                <li className='navbar-item'><Link to='/create' className={`navbar-link ${location.pathname==='/create' ? 'active' :''}`}>Create</Link></li>
                <li className='navbar-item'><button className='navbar-button' onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    </div>
  )
}

export default navbar