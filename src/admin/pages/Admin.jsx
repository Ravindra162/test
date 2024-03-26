import React from 'react'
import Navbar from '../components/Navbar'
import Add from '../components/Add'
const Admin = () => {
  return (<div className='h-screen w-full'>
    <Navbar/>
    <div className='h-[93.35%] w-full flex justify-center items-center'>
    <Add/>
    </div>
    </div>
  )
}

export default Admin