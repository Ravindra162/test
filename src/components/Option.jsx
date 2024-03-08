import React from 'react'
import { useRecoilState } from 'recoil';
import { TicketAtom } from '../store/atoms/Ticket';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Option = ({setSelect,setClassData,setTrainData,trainData,classData}) => {
  const navigate = useNavigate()
  const [ticket,setTicket] = useRecoilState(TicketAtom)
  return (
    <div className='absolute h-48 w-1/3 bg-slate-200 bg-blur left-1/3 top-1/2 text-black' id='closable'>
        <h3>TrainName - {trainData.train_name}</h3>
        <h3>class  - {classData.class}</h3>
        <h3>Price - {classData.ticket_price}</h3>
        <div className='bg-red-400 flex justify-evenly'>
            <button className='bg-green-500'
            onClick={
              ()=>{
                setTicket({
                  trainName:trainData.train_name,
                  trainNumber:trainData.train_number,
                  class:classData.class,
                  price:classData.ticket_price,
                  passengerCount:1
                })
              navigate('/user/filldetails')
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
  )
}

export default Option