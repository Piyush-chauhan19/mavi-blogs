import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProtectWrapper from './pages/UserProtectorWrapper';
import 'remixicon/fonts/remixicon.css';
import Profile from './pages/Profile';



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserProtectWrapper><Home /></UserProtectWrapper>} />
        <Route path="/profile" element={<UserProtectWrapper><Profile /></UserProtectWrapper>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
      </Routes>
    </div>
  )
}

export default App