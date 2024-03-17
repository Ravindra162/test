import React from 'react'
import NewNav from '../components/NewNav'
import Train from './Train1.png'
import {Input} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";
const New = () => {
  return (<div className='h-screen w-full' >  
      <NewNav/>
      <div className="h-[85%] w-full  flex " id="Hero">

        <div className="h-full w-[40%]  flex justify-center items-center">
              <form className='h-[80%] w-[80%] bg-slate-200 flex flex-col justify-center items-center gap-5' >
                <input type='date'/>
                <Input className='w-[70%]' type="text" label="Source" />
               
                <span class="material-symbols-outlined">
                swap_vert
                </span>
                
                <Input className='w-[70%]' type="text" label="Destination" />
                <Button className="bg-[#7C1882] text-white">
                Search
                </Button>
              </form>
        </div>

             <div className="h-full w-[60%]">
                    <img 
                      className="h-full w-full"
                   src={Train} alt="Image"/>
                     </div>
               </div>
    </div>)


}

export default New