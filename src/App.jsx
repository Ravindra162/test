import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import User from './pages/User'
import User_sample from './pages/User_sample'

export default function App() {
  return (
    <Router>
      
       <Routes>

         <Route exact path='/' element={<Login/>}/>
         <Route exact path='/register' element={<Register/>}/>
         {/* <Route exact path='/user' element={<User/>}/> */}
         <Route exact path='/user' element={<User_sample/>}/>
       </Routes>



    </Router>
  )
}
