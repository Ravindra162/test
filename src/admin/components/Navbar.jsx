import React, { useState,useEffect } from 'react'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import { userAtom } from '../../store/atoms/user'
import { useNavigate } from 'react-router-dom'
import {Avatar} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button
} from "@nextui-org/react";
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
     <button className='transition ease-in-out delay-400 text-black mx-10 w-36 h-12 hover:bg-[#167CD8] hover:text-white rounded-xl'>Cancellation Requests</button>
     <button className='transition ease-in-out delay-400 text-black mx-10 w-36 h-12 hover:bg-[#167CD8] hover:text-white rounded-xl'>Add train</button>
     <button className='mr-10'>
     <Dropdown className='mx-10'>
      <DropdownTrigger>
      <Avatar  className='transition ease-in-out delay-100 h-16 w-16 cursor-pointer hover:bg-[#167CD8] hover:border-3 border-[#167CD8]' src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" className='bg-white '>
       <DropdownItem key="profile"
       onClick={()=>{navigate('/user/profile')}}
       >Profile</DropdownItem>
        <DropdownItem 
        onClick={
            (e)=>{
              if(e.target.innerText==='Logout'){
                localStorage.removeItem('token');
                navigate('/')
              }
        
      
            }}
        key="logout" className="text-danger" color="danger">
        <button  className=''>{name?'Logout':'Login'}</button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    </button>
     
     
    </div>
  )
}

export default Navbar