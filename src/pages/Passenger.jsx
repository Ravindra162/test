import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { TicketAtom } from '../store/atoms/Ticket';
import { useRecoilState } from 'recoil';
import axios  from 'axios'; 
const Passenger = () => {
  const navigate = useNavigate()
  const [ticket,setTicket] = useRecoilState(TicketAtom)
  const [passengers,setPassengers] = useState([{
    passengerName:'',
    Age:18,
    Gender:'',
    ContactNo:'',
    Country:'',
  }])
  const addNewPassenger = () =>{
    setPassengers([...passengers,{}])
    setTicket(prevTicket => ({ ...prevTicket, passengerCount: prevTicket.passengerCount + 1 }));  }
    const removePassenger = (indexToRemove) => {
      setPassengers(passengers.filter((_, index) => index !== indexToRemove));
      setTicket(prevTicket => ({ ...prevTicket, passengerCount: prevTicket.passengerCount - 1 })); 
    };
  const makePayment = async (e) =>{

    e.preventDefault()

    if(ticket.passengerCount>0)
     
    alert('Payment Done')

    }

  return (
       
    <center><div className='h-screen w-full justify-center items-center gap-5 overflow-scroll'>
       
     <div className='h-[20%] w-1/3 bg-green-400 rounded-lg'>
     Train-Number: {ticket.trainNumber}<br/>
     Train-name  : {ticket.trainName}<br/>
     class       : {ticket.class}<br/>
     Price       : {ticket.price}<br/>
     Number of passengers: {ticket.passengerCount}<br/>
     Total Amount Payable : {ticket.passengerCount*ticket.price}
     </div>
     <form method='post' onSubmit={makePayment}>
     {passengers.map((passengers,index)=>{
      return <div key={index+1} className='h-[70%] w-1/2 bg-yellow-200 rounded-xl overflow-y-scroll flex flex-col justify-center items-center m-5'>
  
      <div className='h-96 w-full flex flex-col justify-center items-center gap-5 bg-slate-300'>
         <input 
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='name' placeholder='Passenger Name' required/>
          <input 
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='number' placeholder='Passenger Age' required/>
          <select 
          name='gender'
          required={true}
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'>
          <option value=''>
            Select Gender
          </option>
          <option value='Male'>
            Male
          </option>
          <option value='Female'>
            Female
          </option>
          <option value='Other'>
            Other
          </option>
         
         </select>
         <input 
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='number' placeholder='Contact No.' required/>
          <input 
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='number' placeholder='Passenger Age' required/>
         <button onClick={() => removePassenger(index)}>Remove</button>

      </div>
      </div>
     })}
     <button
     className='m-5'
    type='submit'
     >
      Proceed
     </button>
     </form>
     <button
     onClick={addNewPassenger}
     >Add new Passenger</button>
     </div></center>

  )
}

export default Passenger