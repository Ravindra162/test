import React, { useState,useEffect } from 'react'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import { userAtom } from '../store/atoms/user'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  const [name,setName] = useRecoilState(userAtom)
  useEffect(()=>{
    axios.get('http://localhost:3000/api/user',{
       headers:{
           'x-access-token':localStorage.getItem('token')
       }
   }).then((response)=>setName(response.data))
   },[])
  return (
    <div className='h-16 w-full bg-slate-100 flex justify-between gap-0 items-center'>
      <button className='basis-1/2 ml-10'><div className='float-left text-blue-500 text-2xl font-extrabold'>RailQuest</div></button>
     <button className='transition ease-in-out delay-100 text-black mx-10 w-36 h-12 hover:bg-[#167CD8] hover:text-white rounded-xl'>Search Trains</button>
     <button className='transition ease-in-out delay-100 text-black mx-10 w-36 h-12 hover:bg-[#167CD8] hover:text-white rounded-xl'>Book Ticket</button>
     <button 
     onClick={
      (e)=>{
        if(e.target.innerText==='Logout'){
          localStorage.removeItem('token');
          navigate('/')
        }
  

      }}
     className='transition ease-in-out delay-100 text-black mx-10 w-36 h-12 hover:bg-[#167CD8] hover:text-white rounded-xl'>{name?'Logout':'Login'}</button>
    </div>
  )
}

export default Navbar