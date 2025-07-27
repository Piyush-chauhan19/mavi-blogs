import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProtectWrapper from './pages/UserProtectorWrapper';
import 'remixicon/fonts/remixicon.css';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import ShowBlog from './pages/ShowBlog';
import User from './pages/User';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassowrd from './pages/ResetPassword';
import ChangeUsername from './pages/ChangeUsername';
import EditBlog from './pages/EditBlog';
import Unauthorised from './pages/Unauthorised';



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorised />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/user/:username" element={<User />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<ShowBlog />} />
        {/* Protected Routes */}
        <Route path="/blog/create-blog" element={<UserProtectWrapper><CreateBlog /></UserProtectWrapper>} />
        <Route path="/profile" element={<UserProtectWrapper><Profile /></UserProtectWrapper>} />
        <Route path="/reset-password" element={<UserProtectWrapper><ResetPassowrd /></UserProtectWrapper>} />
        <Route path="/blog/edit/:id" element={<UserProtectWrapper><EditBlog /></UserProtectWrapper>} />
        <Route path='/change-username' element={<UserProtectWrapper><ChangeUsername /></UserProtectWrapper>} />
      </Routes>
    </div>
  )
}

export default App