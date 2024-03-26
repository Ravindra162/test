import React from 'react'
import {Button, ButtonGroup} from "@nextui-org/react";
const NewNav = () => {
  return (
    <>
    <div className="h-[15%] w-full  flex justify-between items-center" id="Navbar">
        <div className="h-full w-3/5 flex justify-evenly items-center mr-10" id="Navbar-left">
       <h2 className="font-bold text-4xl ">RailQuest</h2>
       <div className='h-12 w-24 flex justify-center items-center'><h3 className="cursor-pointer text-xl transition ease-in-out delay-400 hover:text-[#7C1882] hover:-translate-y-1 hover:scale-110 duration-100">Home</h3></div>
       <div className='h-12 w-24 flex justify-center items-center'><h3 className="cursor-pointer text-xl transition ease-in-out delay-400 hover:text-[#7C1882] hover:-translate-y-1 hover:scale-110 duration-100">Services</h3></div>
       <div className='h-12 w-24 flex justify-center items-center'><h3 className="cursor-pointer text-xl transition ease-in-out delay-400 hover:text-[#7C1882] hover:-translate-y-1 hover:scale-110 duration-100">About</h3></div>
    </div>
    <div className="h-full w-2/5 flex justify-center items-center" id="Navbar-right">
    <Button className="bg-[#7C1882] text-white p-4">
                Login
                </Button>
    </div>
    </div>
    
    </>
  )
}

export default NewNav