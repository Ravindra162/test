import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
export default function Register() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [username,setUserName] = useState('')
    function registerUser(e){
        e.preventDefault()
        axios.post('http://localhost:3000/api/register',{email,password,username})
        .then(res=>{

            alert(res.data.message)
        })
        .catch(err=>console.log(err))
    
    }
  return (
    <div className='h-screen w-1/1 flex flex-col justify-center items-center' id='container'>

        <div className='h-1/2 w-2/5 bg-slate-200 rounded-lg shadow-2xl'>
             
             <form method='post' 
             onSubmit={registerUser}
             className='flex flex-col justify-center items-center h-5/6 gap-10 mt-10'>
                <input type='email' 
                onChange={(e)=>setEmail(e.target.value)}
                placeholder='Email' className='h-56 w-4/5 rounded-md' required/>
                <input
                onChange={(e)=>setUserName(e.target.value)} 
                type='text' placeholder='Username' className='h-56 w-4/5 rounded-md' required/>
                <input type='password' 
                onChange={(e)=>setPassword(e.target.value)}
                placeholder='Password' className='h-56 w-4/5 rounded-md' required/>
                 <input type='submit' value='Register' className='h-20 w-1/5 rounded-md bg-[#017561] cursor-pointer text-white font-bold hover:text-lg hover:h-36 transition-all'/>
                 <Link className='text-slate-700 font-bold cursor-pointer hover:text-xl transition-all' to="/">Already Registered?</Link>
             </form>

        </div>
      
    </div>
  )
}
