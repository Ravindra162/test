import React, { useEffect } from 'react'
import NewNav from './NewNav'
import {Input} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";
import {ScrollShadow} from "@nextui-org/react";
import { trainsAtom } from '../store/atoms/trains';
import { useRecoilState } from 'recoil';
const NewTrains = () => {
  const [trains,setTrains] = useRecoilState(trainsAtom)
  useEffect(()=>{
    console.log('Train details loading.....')
    console.log(trains)
  },[])
  
  return (<div className='h-screen w-full' >  
      <NewNav/>
      <div className="h-[85%] w-full  flex " id="Hero">

        <div className="h-full w-[40%]  flex justify-center items-center">
              <form className='h-[80%] w-[80%] bg-slate-200 flex flex-col justify-center items-center gap-5' >
                <input type='date'/>
                <Input className='w-[70%]' type="text" label="Source" />
               
                <span className="material-symbols-outlined">
                swap_vert
                </span>
                
                <Input className='w-[70%]' type="text" label="Destination" />
                <Button className="bg-[#7C1882] text-white">
                Search
                </Button>
              </form>
        </div>

             <div className="h-full w-[60%]  flex justify-center items-center">
             <ScrollShadow className="w-[95%] h-[95%] ">

                {trains.map((elem,index)=>{
                  return  <div className='h-1/3 w-4/5 bg-slate-100 flex flex-col justify-center items-center m-10'>
                  <h2 className='basis-[15%] w-full'>Train Number  -  Trainname</h2>
                  <h2 className='basis-[15%]' w-full>04:00 NZM - 19h 35m  - 23:05ABC </h2>
                  <div className='basis-[70%] bg-[#96469A] w-full flex justify-center items-center gap-10 p-5'>

                      <div className='h-1/2 w-1/4 bg-green-100'>

                      </div>
                      <div className='h-1/2 w-1/4 bg-green-100'>

                      </div>
                      <div className='h-1/2 w-1/4 bg-green-100'>

                      </div>
                       <div className='h-1/2 w-1/4 bg-green-100'>

                      </div>

                  </div>
              </div>
              
                })}

               
                
               
                
             </ScrollShadow>
            </div> 
               </div>
    </div>)


}

export default NewTrains