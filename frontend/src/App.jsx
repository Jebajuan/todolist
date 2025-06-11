import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './pages/navbar'
import Signup from './pages/signup'
import Login from './pages/login'
import Create from './pages/createtask'
import Dashboard from './pages/dashboard'
import Display from './pages/display'
import Home from './pages/home'

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/display" element={<Display />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
