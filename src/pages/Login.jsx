import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
export default function Login() {
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
  function Login(e){
     e.preventDefault()

     axios.post('http://localhost:3000/api/login',{email,password})
     .then((response)=>{

        alert(response.data.message)
        if(response.data.message==='Login Success'){
        const token = response.data.token
        localStorage.setItem('token',token)
        navigate('/user')
    }
     })
     
  }
  return (
    <div className='h-screen w-1/1 bg-[#00A884] flex flex-col justify-center items-center' id='container'>
      

        <div className='h-1/2 w-2/5 bg-slate-200 rounded-lg shadow-2xl'>
             
             <form method='post' 
             onSubmit={Login}
             className='flex flex-col justify-center items-center h-5/6 gap-10 mt-10'>
                <input 
                onChange={(e)=>setEmail(e.target.value)}
                type='email' placeholder='Email' className='h-10 w-4/5 rounded-md' required/>
                <input 
                onChange={(e)=>setPassword(e.target.value)}
                type='password' placeholder='Password' className='h-10 w-4/5 rounded-md' required/>
                 <input type='submit' value='Login' className='h-10 w-4/5 rounded-md bg-[#017561] cursor-pointer text-white font-bold'/>
                 <Link className='text-slate-700 font-bold cursor-pointer' to="/register">Not Registered?</Link>
             </form>

        </div>
      
    </div>
  )
}
