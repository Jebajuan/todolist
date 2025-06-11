import React from 'react'
import {Link} from 'react-router-dom'

function navbar() {
  return (
    <div>
        <nav>
            <ul>
                {/* <li><Link to='/'>Home</Link></li> */}
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/signup'>Signup</Link></li>
                <li><Link to='/create'>Create</Link></li>
                <li><Link to='/dashboard'>DashBoard</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default navbar