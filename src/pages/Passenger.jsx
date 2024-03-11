import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { TicketAtom } from '../store/atoms/Ticket';
import { userAtom } from '../store/atoms/user';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CrucksAtom } from '../store/atoms/Crucks';
import Navbar from '../components/Navbar';
import axios  from 'axios'; 
const Passenger = () => {
  const navigate = useNavigate()
  const crucks = useRecoilValue(CrucksAtom)
  const [username,setUsername] = useRecoilState(userAtom)
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
    setTicket(prevTicket => ({ ...prevTicket, passengerCount: prevTicket.passengerCount + 1 }));  
  }
    const removePassenger = (indexToRemove) => {
      setPassengers(passengers.filter((_, index) => index !== indexToRemove));
      setTicket(prevTicket => ({ ...prevTicket, passengerCount: prevTicket.passengerCount - 1 })); 
    };
  const makePayment = async (e) =>{

    e.preventDefault()

    if(ticket.passengerCount>0)
    { 
    alert('Payment Done')
    axios.post('http://localhost:3000/api/payment',{ticketInfo:ticket,userId:username.userId,passengers}).then((res)=>{
      console.log(res.data.payment_id)
      if(res.data.isDone===true){

        axios.post('http://localhost:3000/api/book-ticket',{ticketDetails:ticket,userId:username.userId,passengers,crucks,payment_id:res.data.payment_id}).then((res)=>{
          
          console.log(res.data)

        })
      }
    
    })
  }

    }
    const handlePassengerChange = (index, field, value) => {
      setPassengers(prevPassengers => {
          const updatedPassengers = [...prevPassengers];
          updatedPassengers[index] = {
              ...updatedPassengers[index],
              [field]: value
          };
          return updatedPassengers;
      });
  };

  return (<>
    <Navbar/>
    <center><div className='h-screen w-full justify-center items-center gap-5 overflow-scroll'>
       
     <div className='h-[22%] w-1/3 bg-green-400 rounded-lg'>
     Source      : {crucks.source}<br/>
     Destination : {crucks.destination}<br/>
     Travel Date : {crucks.date}<br/>
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
 onChange={(e) => handlePassengerChange(index, 'passengerName', e.target.value)}
         className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='name' placeholder='Passenger Name' required/>
          <input 
           onChange={(e) => handlePassengerChange(index, 'Age', e.target.value)}
          className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='number' placeholder='Passenger Age' required/>
          <select 
                     onChange={(e) => handlePassengerChange(index, 'Gender', e.target.value)}
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
          onChange={(e) => handlePassengerChange(index, 'ContactNo', e.target.value)}
             className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='number' placeholder='Contact No.' required/>
         <input 
          onChange={(e) => handlePassengerChange(index, 'Country', e.target.value)}
             className=' h-12 w-1/2  border-2 border-black rounded-md text-xl'
         type='name' placeholder='Country' required/>
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
     </>

  )
}

export default Passenger