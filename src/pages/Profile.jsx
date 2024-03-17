import React,{useEffect, useState} from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../store/atoms/user'
import {Button} from "@nextui-org/react";
import {ScrollShadow} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import axios from 'axios'
const Profile = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [ticketDetails,setTicketDetails] = useState([])
    const navigate = useNavigate()
    const [showTransactions,setShowTransactions] = useState(false)
    const [showBookings,setShowBookings] = useState(false)
    const [user,setUser] = useRecoilState(userAtom)
    const [transactions,setTransactions] = useState([])
    const [bookings,setBookings] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
    const openModal = () => setIsOpenModal(true);
    const closeModal = () => setIsOpenModal(false);
  
    const openCancelModal = () => setIsCancelModalOpen(true);
    const closeCancelModal = () => setIsCancelModalOpen(false);
    useEffect(()=>{

        if(!localStorage.getItem('token'))
        return navigate('/')

        axios.get('http://localhost:3000/api/user',{
           headers:{
               'x-access-token':localStorage.getItem('token')
           }
       }).then((response)=>setUser(response.data))
       },[])
    
     const recentTransaction = (e) =>{
       e.preventDefault()
       
       axios.get('http://localhost:3000/api/recent-transactions',{
        headers:{
            'x-access-token':localStorage.getItem('token')
        }
       }).then((res)=>{
        console.log(res.data.result)
          if(res.data.result.length>0){
            setTransactions(res.data.result)
            setShowTransactions(true)
          }
          else{
            alert('No transactions found ')
          }
       })
     }
    
    const recentBookings = (e) =>{
      e.preventDefault()
      axios.get('http://localhost:3000/api/recent-bookings',{
        headers:{
            'x-access-token':localStorage.getItem('token')
        }
       }).then((res)=>{
        console.log(res.data.result)
          if(res.data.result.length>0){
            setBookings(res.data.result)
            setShowBookings(true)
          }
          else{
            alert('No Bookings found ')
          }
       })
    }

    const fetchTicketDetails = (PNR) =>{
     
      axios.post('http://localhost:3000/api/fetch-ticket',{PNR},{
        headers:{
          'x-access-token':localStorage.getItem('token')
        }
      }).then(res=>{
        console.log(res.data)
        setTicketDetails(res.data)
      }).catch(err=>console.log(err))
    }

    const cancelTicket = (PNR) => {
      axios.post('http://localhost:3000/api/cancel-ticket',{PNR},{
        headers:{
          'x-access-token':localStorage.getItem('token')
        }
      }).then(res=>{
        console.log(res.data)
      }).catch(err=>console.log(err))
    }

  return (
    <div>
    <div>Profile</div>
    <div>Username:{user.username}</div>
    <div>E-mail:{user.email}</div>
    <Button color="primary" onClick={recentTransaction}>
      Your Tranasctions
    </Button>
    <Button color="primary" onClick={recentBookings}>
      Your Bookings
    </Button>
    {showTransactions&&
    <div className='m-5'>
      <div className='w-2/5 h-[20px] flex flex-row justify-between items-center'>
        <h3 className='font-extrabold'>transaction-id</h3>
        <h3 className='font-extrabold'>Amount Paid</h3>
        
      </div>
    <ScrollShadow className="w-2/5 h-[300px]">
     {transactions.map((transaction,index)=>{
               return <Card key={index} className='bg-slate-100'>
              <CardBody className='flex flex-row justify-between'>
                <p>{transaction.payment_id}</p>
                <p>|</p>
                <p>{"Rs."+transaction.payment_amount}</p>
              </CardBody>
            </Card>
     })}
    </ScrollShadow>
    </div>}
    {showBookings&&<div>
      <div className='w-3/5 h-[20px] flex flex-row justify-between items-center'>
        <h3 className='font-extrabold'>PNR</h3>
        <h3 className='font-extrabold'>Train Number</h3>
        <h3 className='font-extrabold'>Class</h3>
        <h3 className='font-extrabold'>Options</h3>
      </div>
      <ScrollShadow className="w-3/5 h-[500px]">
     {bookings.map((booking,index)=>{
               return <Card key={index} className='bg-slate-100'>
              <CardBody className='flex flex-row justify-between'>
                <p>{booking.PNR}</p>
                <p>|</p>
                <p>{booking.train_number}</p>
                <p>|</p>
                <p>{booking.class}</p>
                <p>|</p>
                <Button onPress={()=>{
                  openModal()
                  fetchTicketDetails(booking.PNR)
                  }}>View Details</Button>
      <Modal 
        backdrop="opaque" 
        isOpen={isOpenModal} 
        onOpenChange={setIsOpenModal}
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                {ticketDetails.length&&<><h1>{ticketDetails[0].train_number}</h1>
                <h2>{ticketDetails[0].source}   -  {ticketDetails[0].destination}</h2>
                {ticketDetails.map((ticket,index)=>{
                          return <div key={index}>{ticket.passenger_id}| {ticket.first_name} | {ticket.age}</div>
                })}</>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                  Close
                </Button>
                <Button color="primary" onPress={closeModal}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button onPress={openCancelModal} color='danger'>Cancel</Button>
      <Modal 
        backdrop="opaque" 
        isOpen={isCancelModalOpen} 
        onOpenChange={setIsCancelModalOpen}
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <h3>Are you sure you want to cancel this ticket?</h3>
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={closeCancelModal}>
                  No
                </Button>
                <Button color="danger" onPress={closeCancelModal} onClick={()=>{cancelTicket(booking.PNR)}}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
              </CardBody>
            </Card>
            
     })}
    </ScrollShadow></div>}
    </div>
  )
}

export default Profile