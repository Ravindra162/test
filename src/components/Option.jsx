import React from 'react'
import {useRecoilState,useRecoilValue } from 'recoil';
import { TicketAtom } from '../store/atoms/Ticket';
import { isLoadingAtom } from '../store/atoms/isLoading';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
const Option = ({setSelect,setClassData,setTrainData,trainData,classData}) => {
  const [isLoading,setIsLoading] = useRecoilState(isLoadingAtom)
  const navigate = useNavigate()
  const [ticket,setTicket] = useRecoilState(TicketAtom)
  return (
   <>
   {isLoading&&<Loading/>}
   <div className='absolute h-48 w-1/3 bg-slate-200 bg-blur left-1/3 top-1/2 text-black' id='closable'>
      
        <h3>TrainName - {trainData.train_name}</h3>
        <h3>class  - {classData.class}</h3>
        <h3>Price - {classData.ticket_price}</h3>
        <div className='bg-red-400 flex justify-evenly'>
            <button className='bg-green-500'
            onClick={
              ()=>{
                setIsLoading(true)
                setTimeout(()=>{setTicket({
                  trainName:trainData.train_name,
                  trainNumber:trainData.train_number,
                  class:classData.class,
                  price:classData.ticket_price,
                  passengerCount:1
                })
                  setIsLoading(false)
                  navigate('/user/filldetails')

                },1000)

            }}
            >
                  Book
            </button>
        <button className='h-1/4 bg-red-300 '
              onClick={()=>{
                setSelect(false)
              }}
              >Close</button>

        </div>
             
            </div>
            </>
  )
}

export default Option