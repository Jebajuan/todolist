import React from 'react'
import {Link} from 'react-router-dom'
import './CSS/navbar.css'

function navbar() {
  return (
    <div>
        <nav>
            <ul>
                {/* <li><Link to='/'>Home</Link></li> */}
                <li><Link to='/dashboard'>DashBoard</Link></li>
                <li><Link to='/create'>Create</Link></li>
                <li><Link to='/login'>Logout</Link></li>
                {/* <li><Link to='/signup'>Signup</Link></li> */}
                
                
            </ul>
        </nav>
    </div>
  )
}

export default navbar