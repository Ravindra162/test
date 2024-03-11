import React,{useState} from 'react'
import  axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { trainsAtom } from '../store/atoms/trains'
import {sourceAtom} from '../store/atoms/source'
import { destinationAtom } from '../store/atoms/destination'
import { isLoadingAtom } from '../store/atoms/isLoading'
import Option from './Option'
import { CrucksAtom } from '../store/atoms/Crucks'
const TrainSearch = () => {
  const [isLoading,setIsLoading] = useRecoilState(isLoadingAtom)
  const [src,setSrc] = useRecoilState(sourceAtom)
    const [crucks,setCrucks] = useRecoilState(CrucksAtom)
    const [dest,setDest] =useRecoilState(destinationAtom)
    const [date,setDate] = useState('')
    const [trains,setTrains]=useRecoilState(trainsAtom)
    const [options] = useState(['Mumbai Central','Pune Junction','Nagpur Junction','Banglore City','Hyderabad Secunderabad']);
    const [select,setSelect]=useState(false)
    const [trainData,setTrainData] = useState();
    const [classData,setClassData] = useState();    
    const searchHandler = (e) =>{
      console.log(date)
      e.preventDefault()
      axios.get(`http://localhost:3000/api/search?src=${src}&dest=${dest}&date=${date}`)
      .then(response=>{
          setIsLoading(true)
          setTimeout(()=>{
            if(response.data.found===true){
              setTrains(response.data.trains)
            console.log(response.data.trains)
          }
              else{
                  setTrains([])
                  alert("No trains Found")
              }
              setIsLoading(false)
          },1500)
          
      })
  }
  const book = (trainData,classData) =>{
    setIsLoading(true)
    setTimeout(()=>{
      setSelect(true)
    setClassData(classData)
    setTrainData(trainData)
    setCrucks({source:src,destination:dest,date:date})
    setIsLoading(false)
    },1000)
   
    
  }
    




  return (<div className='h-full w-full flex-col'>

          {isLoading && (
          <div className="absolute h-full w-full flex justify-center items-center backdrop-blur-sm z-50">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
          </div>
            )}
    {select&&<Option setSelect={setSelect} setClassData={setClassData} setTrainData={setTrainData} trainData={trainData} classData={classData}/>}


    <datalist id="browsers">
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
  
    <div className='h-2/5 w-full  flex justify-evenly items-center gap-20' id='train_background'>
    
        <div className='h-[20%] w-3/5  p-2'>
        <form method='post'
        onSubmit={searchHandler}
        className='h-full w-full bg-white flex gap-2 items-center '>
        <input 
        onChange={(e)=>{setDate(e.target.value)}}
        className='h-full basis-1/5 bg-slate-100 hover:bg-[#167CD8] cursor-pointer' type='date' required/>
        <input 
        list='browsers'
        onChange={(e)=>{setSrc(e.target.value)}}
        className='h-full basis-1/3 bg-slate-100' type='name' placeholder='Source' required/>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
        <input 
        list='browsers'
        onChange={(e)=>setDest(e.target.value)}
        className='h-full basis-1/3 bg-slate-100' type='name' placeholder='Destination' required/>
        <input type='submit' className='cursor-pointer h-full bg-blue-200 hover:bg-[#167CD8] text-black basis-[15%]' value={"Search"}/>
        </form>
        </div>
    </div>
    <div className='h-[54%] w-full bg-[#AFD0F1] flex flex-col items-center justify-center overflow-scroll gap-10 p-10'>
    
       <div className="h-full w-full overflow-auto border border-gray-300 p-4">
      {/* Add your content here */}
      <ul className="h-full w-full">
      {trains.map((train, index) => (
        <li key={index} className='h-full w-full bg-blue-200 text-black '>
            <div className='h-1/3= w-full text-xl flex justify-evenly bg-slate-100 items-center'> 
                <div>{train.train_number}</div>
                <div>|</div>
                <div>{train.train_name}</div>
            </div>
            <div className='h-3/4 w-full bg-blue-300 flex flex-col justify-evenly'>
                <div className='h-1/4 w-full flex justify-evenly bg-slate-600 items-center'>
                    <div>{src}</div>
                    <div>---------------</div>
                    <div>{dest}</div>
                </div>
               
                  <div className='h-3/4 w-full flex justify-center items-center gap-10'>
                      {train.class_price_avail.map((classData, index) => (
                          <div key={index} className={`h-24 w-1/5 border-2 bg-white border-black flex flex-col justify-center items-center cursor-pointer rounded-lg `}
                          onClick={()=>{
                            book(train,classData)
                          }}
                          >
                         
                              <p className='text-xl'>{classData.class}</p><hr/>
                              <p>Tickets: {classData.available_tickets}</p>
                          </div>
                      ))}
                   
                </div>
            </div>
        </li>
    ))}
      </ul>
    </div>            
</div>

    </div>
  )
}

export default TrainSearch