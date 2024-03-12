import React,{useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import TrainSearch from '../components/TrainSearch'
import axios from 'axios'
import { userAtom } from '../store/atoms/user'
import { useRecoilState, useRecoilValue } from 'recoil'
export default function User_sample() {
  const [user,setUser] = useRecoilState(userAtom)

  
  return (
    <div className='h-screen w-full bg-white overflow-hidden'>
    <Navbar/>   
    <TrainSearch/>
    </div>
  )
}
