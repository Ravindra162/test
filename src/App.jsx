import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import Option from './components/Option'
import User_sample from './pages/User_sample'
import Success from './pages/Success'
import Failed from './pages/Failed'
import Passenger from './pages/Passenger'

export default function App() {
  return (
    <Router>
      
       <Routes>

         <Route exact path='/' element={<Login/>}/>
         <Route exact path='/register' element={<Register/>}/>
         {/* <Route exact path='/user' element={<User/>}/> */}
         <Route exact path='/user' element={<User_sample/>}/>
         <Route exact path='/option' element={<Option/>}/>
         <Route exact path='/user/filldetails' element={<Passenger/>}/>
         <Route exact path='/user/payment/success' element={<Success/>}/>
         <Route exact path='/user/payment/failed' element={<Failed/>}/>
       </Routes>



    </Router>
  )
}
