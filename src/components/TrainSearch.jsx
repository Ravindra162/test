import React,{useState} from 'react'
import  axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { trainsAtom } from '../store/atoms/trains'
import { usernameAtom } from '../store/atoms/username'
const TrainSearch = () => {
  const [name,setName] = useRecoilState(usernameAtom)
  const [src,setSrc] = useState('')
    const [dest,setDest] =useState('')
    const [date,setDate] = useState('')
    const [trains,setTrains]=useRecoilState(trainsAtom)
    const searchHandler = (e) =>{
      console.log(date)
      e.preventDefault()
      axios.get(`http://localhost:3000/api/search?src=${src}&dest=${dest}&date=${date}`)
      .then(response=>{
          if(response.data.found===true){
          setTrains(response.data.trains)
        console.log(response.data.trains)}
          else{
              setTrains([])
          }
      })
  }


  return (<div className='h-full w-full flex-col'>
    <div className='h-2/5 w-full  flex justify-evenly items-center gap-20' id='train_background'>
        {/* <div className='h-1/4 w-1/4  text-black flex justify-center items-center'>
         <h2 className='text-5xl font-extrabold'></h2>
        </div> */}
        <div className='h-[20%] w-3/5  p-2'>
        <form method='post'
        onSubmit={searchHandler}
        className='h-full w-full bg-white flex gap-2 items-center '>
        <input 
        onChange={(e)=>{setDate(e.target.value)}}
        className='h-full basis-1/5 bg-slate-100 hover:bg-[#167CD8] cursor-pointer' type='date' required/>
        <input 
        onChange={(e)=>{setSrc(e.target.value)}}
        className='h-full basis-1/3 bg-slate-100' type='name' placeholder='Source' required/>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
        <input 
        onChange={(e)=>setDest(e.target.value)}
        className='h-full basis-1/3 bg-slate-100' type='name' placeholder='Destination' required/>
        <input type='submit' className='cursor-pointer h-full bg-blue-200 hover:bg-[#167CD8] text-black basis-[15%]' value={"Search"}/>
        </form>
        </div>
    </div>
    <div className='h-3/5 w-full bg-red-400'>
            {/* {trains.length?trains[0].train_number:'456'} */}
            {trains.map(train => (
          <div key={train.train_number}>
            Train Number: {train.train_number},
             Current Station: {train.train_name}
          </div>
        ))}
          
    </div>
    </div>
  )
}

export default TrainSearch