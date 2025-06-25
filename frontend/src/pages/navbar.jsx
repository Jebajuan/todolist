import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
// import './CSS/navbar.css'

function navbar() {

  const navigate=useNavigate()

  const handleLogout=async()=>{
    const refreshToken=localStorage.getItem('refreshToken')
    if(refreshToken){
      try{
        await axios.post("http://localhost:3001/logout",{refreshToken})
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
    <div>
        <nav>
            <ul>
                <li><Link to='/dashboard'>DashBoard</Link></li>
                <li><Link to='/create'>Create</Link></li>
                <li><Link onClick={handleLogout} to='/login'>Logout</Link></li> 
            </ul>
        </nav>
    </div>
  )
}

export default navbar