import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import {z} from 'zod'
import axios from 'axios'

const Add = () => {
  const trainInfo = z.object({
    trainName:z.string(),
    trainNumber:z.string().max(5),
    startDate:z.string(),
    startTime:z.string(),
    endDate:z.string(),
    endTime:z.string(),
    source:z.string(),
    destination:z.string()
  })
  const [trainData,setTrainData] = useState({
    trainName:'',
    trainNumber:'',
    startDate:'',
    startTime:'',
    endDate:'',
    endTime:'',
    source:'',
    destination:''
  })

   const [classData,setClassData] = useState([{
    class:'',
    price:''
   }])

  const [routes, setRoutes] = useState([
    {
      stationName: '',
      stopNo: '',
      arrivalDate: '',
      departureDate: '',
      arrivalTime: '',
      departureTime: ''
    }
  ]);
  const [compartments,setCompartments] = useState([{
    compartmentName:'',
    class:'',
    capacity:''
  }])

  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  const addNewClass = () =>{
    setClassData(prevClass=>{
        const classes = [...prevClass]
        classes.push({
            class:'',
            price:''
        })
        return classes
    })
    setOpenAccordionIndex(null)
  }

  const removeClass = (index) =>{

    if(classData.length<3){
      return  alert("Please add sufficient number of Classes")
    }

    setClassData(prevClasses=>{
        const classes = [...prevClasses]
        classes.splice(index)
        return classes
    })
    
  }

  const addNewCompartment = () =>{
    setCompartments(prevCompartments=>{
        const compartments = [...prevCompartments]
        compartments.push({
            compartmentName:'',
            class:'',
            capacity:''
        })
        return compartments
    })
    setOpenAccordionIndex(null)
  }


  const removeCompartment = (index) =>{

    if(compartments.length<3){
      return  alert("Please add sufficient number of compartments")
    }

    setCompartments(prevCompartments=>{
        const compartment = [...prevCompartments]
        compartment.splice(index)
        return compartment
    })
    
  }

  const addNewRoute = () => {
    setRoutes(prevRoutes => [
      ...prevRoutes,
      {
        stationName: '',
        stopNo: '',
        arrivalDate: '',
        departureDate: '',
        arrivalTime: '',
        departureTime: ''
      }
    ]);
    // Close currently open accordion
    setOpenAccordionIndex(null);
  };
  const removeRoute = (index) =>{
    if(routes.length<2){
        return alert("You should add atleast 2 stations in Routes")
    }
    setRoutes(prevRoutes=>{
        const updatedRoutes = [...prevRoutes]
        updatedRoutes.splice(index,1)
        return updatedRoutes
    })
  }

  return (
    <div className='h-[80%] w-2/3 p-0 flex justify-center items-center overflow-y'>
      <Accordion className='h-full w-full'>
        <AccordionItem key='1' aria-label='Add Train' title='Add Train'>
          <form className='h-full w-full flex flex-col justify-center items-center gap-5 p-8 rounded-xl bg-slate-500'>
            <input 
            onChange={(e)=>{setTrainData(prevData=>({
               ...prevData,trainName:e.target.value
            }))
        }}
            type='text' placeholder='Enter Train Name' className='input input-bordered w-full max-w-xs bg-slate-100' />
            <input 
            onChange={(e)=>setTrainData(prevData=>({
                ...prevData,trainNumber:e.target.value
             }))}
            type='number' placeholder='Enter Train Number' className='input input-bordered w-full max-w-xs bg-slate-100' required/>
             <input 
            onChange={(e)=>{setTrainData(prevData=>({
               ...prevData,source:e.target.value
            }))
        }}
            type='text' placeholder='Enter source' className='input input-bordered w-full max-w-xs bg-slate-100' />
             <input 
            onChange={(e)=>{setTrainData(prevData=>({
               ...prevData,destination:e.target.value
            }))
        }}
            type='text' placeholder='Enter destination' className='input input-bordered w-full max-w-xs bg-slate-100' />
            <label htmlFor='start-date'>Start Date:</label>
            <input 
            onChange={(e)=>setTrainData(prevData=>({
                ...prevData,startDate:e.target.value
             }))}
            type='date' placeholder='Enter start Date' className='input input-bordered w-full max-w-xs bg-slate-100 basis-4' required/>
            <label htmlFor='start-time'>Start Time:</label>
            <input 
            onChange={(e)=>setTrainData(prevData=>({
                ...prevData,startTime:e.target.value
             }))}
            type='time' placeholder='Enter Start Time' className='input input-bordered w-full max-w-xs bg-slate-100' required/>
            <label htmlFor='end-date'>End Date:</label>
            <input 
            onChange={(e)=>setTrainData(prevData=>({
                ...prevData,endDate:e.target.value
             }))}
            type='date' placeholder='Enter End Date' className='input input-bordered w-full max-w-xs bg-slate-100 basis-4' required/>
            <label htmlFor='end-time'>End Time:</label>
            <input 
            onChange={(e)=>setTrainData(prevData=>({
                ...prevData,endTime:e.target.value
             }))}
            type='time' placeholder='Enter End Time' className='input input-bordered w-full max-w-xs bg-slate-100' required/>
            
          </form>
        </AccordionItem>
        <AccordionItem key='2' aria-label='Add Routes' title='Add Routes'>
          <Accordion>
            {routes.map((route, index) => (
              <AccordionItem
                key={index}
                aria-label='new Route'
                title='new route'
                open={openAccordionIndex === index}
                onToggle={() => setOpenAccordionIndex(openAccordionIndex === index ? null : index)}
              >
               <form className='h-full w-full flex flex-col justify-center items-center gap-5 p-8 bg-slate-500 rounded-xl'>
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].stationName = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.stationName}
      type='text'
      placeholder='Enter Station Name'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].stopNo = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.stopNo}
      type='number'
      placeholder='Enter Stop number'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <label htmlFor='arrival-date'>Arrival Date:</label>
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].arrivalDate = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.arrivalDate}
      type='date'
      placeholder='Enter start Date'
      className='input input-bordered w-full max-w-xs bg-slate-100 basis-4'
    />
    <label htmlFor='arrival-time'>Arrival Time:</label>
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].arrivalTime = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.arrivalTime}
      type='time'
      placeholder='Enter Start Time'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <label htmlFor='departure-date'>Departure Date:</label>
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].departureDate = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.departureDate}
      type='date'
      placeholder='Enter End Date'
      className='input input-bordered w-full max-w-xs bg-slate-100 basis-4'
    />
    <label htmlFor='departure-time'>Departure Time:</label>
    <input 
      onChange={(e) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].departureTime = e.target.value;
        setRoutes(updatedRoutes);
      }}
      value={route.departureTime}
      type='time'
      placeholder='Enter End Time'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <Button color='success' onClick={addNewRoute}>
      Add another route
    </Button>
    <Button color='danger' onClick={() => removeRoute(index)}>
      remove this route
    </Button>
  </form>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionItem>
        <AccordionItem key='3' aria-label='Add compartment' title='Add compartments'>
        <Accordion>
            {compartments.map((compartment, index) => (
              <AccordionItem
                key={index}
                aria-label='new Route'
                title='new compartment'
                open={openAccordionIndex === index}
                onToggle={() => setOpenAccordionIndex(openAccordionIndex === index ? null : index)}
              >
                <form className='h-full w-full flex flex-col justify-center items-center gap-5 p-8 bg-slate-500 rounded-xl'>
    <input 
      onChange={(e) => {
        const updatedCompartments = [...compartments];
        updatedCompartments[index].compartmentName = e.target.value;
        setCompartments(updatedCompartments);
      }}
      value={compartment.compartmentName}
      type='text'
      placeholder='Enter Compartment Name'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <input 
      onChange={(e) => {
        const updatedCompartments = [...compartments];
        updatedCompartments[index].class = e.target.value;
        setCompartments(updatedCompartments);
      }}
      value={compartment.class}
      type='text'
      placeholder='Enter Class'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <input 
      onChange={(e) => {
        const updatedCompartments = [...compartments];
        updatedCompartments[index].capacity = e.target.value;
        setCompartments(updatedCompartments);
      }}
      value={compartment.capacity}
      type='text'
      placeholder='Enter capacity'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <Button color='success' onClick={addNewCompartment}>
      Add another compartment
    </Button>
    <Button color='danger' onClick={() => removeCompartment(index)}>
      remove this compartment
    </Button>
  </form>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionItem>
     <AccordionItem key='15' title='Add class'>

     <Accordion>
            {classData.map((classes, index) => (
              <AccordionItem
                key={index}
                aria-label='new Route'
                title='new compartment'
                open={openAccordionIndex === index}
                onToggle={() => setOpenAccordionIndex(openAccordionIndex === index ? null : index)}
              >
                <form className='h-full w-full flex flex-col justify-center items-center gap-5 p-8 bg-slate-500 rounded-xl'>
    <input 
      onChange={(e) => {
        const updatedClass = [...classData];
        updatedClass[index].class = e.target.value;
        setClassData(updatedClass);
      }}
      value={classData.class}
      type='text'
      placeholder='Enter Class'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
    <input 
      onChange={(e) => {
        const updatedClass = [...classData];
        updatedClass[index].price = e.target.value;
        setClassData(updatedClass);
      }}
      value={classData.price}
      type='number'
      placeholder='Enter price'
      className='input input-bordered w-full max-w-xs bg-slate-100'
    />
   
    <Button color='success' onClick={addNewClass}>
      Add another class
    </Button>
    <Button color='danger' onClick={() => removeClass(index)}>
      remove this class
    </Button>
  </form>
              </AccordionItem>
            ))}
          </Accordion>

     </AccordionItem>
       
      </Accordion>
      <Button color='success'
            onClick={()=>{
                try{
                trainInfo.parse(trainData)
                console.log(trainData)
                console.log(routes)
                console.log(compartments)
                console.log(classData)
                axios.post('http://localhost:3000/api/admin/addTrain',{trainData,routes,compartments,classData},{
                  headers:{
                    'x-access-token':localStorage.getItem('token')
                  }
                }).then((res)=>{
                  console.log(res.data)
                })
               }
                catch(err){return console.log(err)}
            }}
            >Add</Button>
    </div>
  );
};

export default Add;
