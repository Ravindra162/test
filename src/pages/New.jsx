import React, { useState } from 'react'
import axios from 'axios'
import NewNav from '../components/NewNav'
import Train from './Train1.png'
import {Input} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";
import { useRecoilState } from 'recoil';
import {sourceAtom} from '../store/atoms/source'
import { destinationAtom } from '../store/atoms/destination';
import { CrucksAtom } from '../store/atoms/Crucks';
import { isLoadingAtom } from '../store/atoms/isLoading';
import { trainsAtom } from '../store/atoms/trains';
import { useNavigate } from 'react-router-dom';
const New = () => {
  const navigate = useNavigate()
  const [isLoading,setIsLoading] = useRecoilState(isLoadingAtom)
  const [source,setSource] = useRecoilState(sourceAtom)
  const [destination,setDestination] = useRecoilState(destinationAtom)
  const [crucks,setCrucks]  = useRecoilState(CrucksAtom)
  const [date,setDate] = useState('')
  const [options,setOptions] = useState(['Mumbai Central','Pune Junction','Nagpur Junction','Banglore City','Hyderabad Secunderabad']);
  const [trains,setTrains]=useRecoilState(trainsAtom)
  const searchHandler = (e) =>{
    console.log(date)
    console.log(source)
    console.log(destination)
    e.preventDefault()
    axios.get(`http://localhost:3000/api/search?src=${source}&dest=${destination}&date=${date}`)
    .then(response=>{
        // setIsLoading(true)
        setTimeout(()=>{
          if(response.data.found===true){
            setTrains(response.data.trains)
          console.log(response.data.trains)
          navigate('/searchTrains')
        }
            else{
                setTrains([])
                alert("No trains Found")
            }
            // setIsLoading(false)
        },1500)
        
    })
}


  return (<div className='h-screen w-full' >  
      <NewNav/>
      {isLoading && (
          <div className="absolute h-full w-full flex justify-center items-center backdrop-blur-sm z-50">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
          </div>
            )}
      <div className="h-[85%] w-full  flex " id="Hero">
      <datalist id="browsers">
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
        <div className="h-full w-[40%]  flex justify-center items-center">
              <form method='post' onSubmit={searchHandler} className='h-[80%] w-[80%] bg-slate-200 flex flex-col justify-center items-center gap-5' >
                <input type='date'onChange={(e)=>{setDate(e.target.value)}}/>
                <Input 
                list='browsers'
                onChange={(e)=>{setSource(e.target.value)}}
                className='w-[70%]' type="text" label="Source" />
               
                <span className="material-symbols-outlined">
                swap_vert
                </span>
                
                <Input 
                list='browsers'
                onChange={(e)=>setDestination(e.target.value)}
                className='w-[70%]' type="text" label="Destination" />
                <Button type='submit' className="bg-[#7C1882] text-white">
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