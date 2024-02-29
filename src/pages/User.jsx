import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState,useRecoilValue,useSetRecoilState } from 'recoil'
import { usernameAtom } from '../store/atoms/username'
import { trainsAtom } from '../store/atoms/trains'
import axios from 'axios'

const Hello = () => {
    const navigate = useNavigate()
    const [name,setName] = useRecoilState(usernameAtom)
    const [src,setSrc] = useState('')
    const [dest,setDest] =useState('')
    const [date,setDate] = useState('')
    const [trains,setTrains]=useRecoilState(trainsAtom)
     useEffect(()=>{
     axios.get('http://localhost:3000/api/user',{
        headers:{
            'x-access-token':localStorage.getItem('token')
        }
    }).then((response)=>setName(response.data))
    },[])

    const searchHandler = (e) =>{
        console.log(date)
        e.preventDefault()
        axios.get(`http://localhost:3000/api/search?src=${src}&dest=${dest}&date=${date}`)
        .then(response=>{
            if(response.data.found===true)
            setTrains(response.data.trains)
            else{
                setTrains([])
            }
        })
    }


  return (<div className='h-screen w-full bg-slate-300 text-black'>
    <div>Hello {name}</div>
    <button className='h-10 w-15 bg-red-500' onClick={()=>{
        localStorage.removeItem('token')
        navigate('/')
    }}>
        Logout
    </button>
    <div className='h-5/6 w-full bg-green-300'>
    <form method='get' 
    onSubmit={searchHandler}
    className='h-20 p-5 flex justify-center items-center bg-red-100'>
        <input type="date" name='date'
        min='2024-02-27' max='2024-03-27'
        required={true}
        onChange={(e)=>{setDate(e.target.value)}}
        className='h-12 w-30 bg-yellow-500 text-slate-700 mx-20'
        />
        <input type="name" placeholder='source'
        required={true}
        onChange={(e)=>{setSrc(e.target.value)}}
        className='h-12 w-30 bg-yellow-500 text-black mx-20'
        ></input>
          <input type="name" placeholder='destination'
          required={true}
          onChange={(e)=>setDest(e.target.value)}
        className='h-12 w-30 bg-yellow-500 text-black mx-20'
        ></input>
        <button
        className='h-8 w-20 bg-green-300 rounded-xl'
        >Search</button>
    </form>
    <div className='w-full h-full bg-red-400 flex flex-col justify-center items-center gap-2'>
    



    </div>
    </div>
    </div>)
}

export default Hello