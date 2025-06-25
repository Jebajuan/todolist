import React from 'react'
// import './CSS/home.css'

function home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Your To-Do List Web Page</h1>
      <p className="home-description">
      Organize your tasks, boost your productivity, and never miss a deadline. 
      Easily add, edit, and remove tasks to keep your day on track. 
      Prioritize important activities and track your progress effortlessly. 
      Stay focused, reduce stress, and achieve your goals with ease.
      </p>
    <div className="home-button-wrapper">
    <a href="/login" className="home-link">
      <button type="button" className="home-button">Get Started</button>
    </a>
  </div>
</div>


  )
}

export default home