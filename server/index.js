const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const {createPool} = require('mysql')

const pool = mysql.createPool({
    host:'bvverqzslppwa4mfqfxs-mysql.services.clever-cloud.com',
    user:'ulvmgjqopj6xyagv',
    password:'JcMrdq6hp6Oyw5yKlCgR',
    database:'bvverqzslppwa4mfqfxs'
})
// const pool = createPool({
//     host:'localhost',
//     user:'ravindra162',
//     password:'Ravndra@562',
//     database:'railway'
// })

pool.query(`SELECT * from trains`,function(err,result,fields){
    if(err)throw err
    console.log('CONNECTED TO DB')
})
const PORT = 3000
app.use(cors({
    origin:'*',
    methods:['GET','POST']
}))
app.use(express.json())
const authMiddleware = (req,res,next) =>{
    const authToken = req.headers['x-access-token']
    if(authToken){
        const token = jwt.verify(authToken,process.env.JWT_SECRET)
        req.user = token
        next()
    }
    else{
        res.status(404).send('User Missed his chance')
    }

}
app.post('/api/register', async (req, res) => {
   
    const {username, email, password} = req.body
    const role = 0;
  
    pool.query(`select email from users where email=?`,[email],(err,result,fields)=>{
        console.log(result)
        if(result.length!==0){
            res.json({message:'User Already Exists'})
        }
        else {
            pool.query(`insert into users (role,username,password,email) values (1,?,?,?)`,[username,password,email],(err,result,fields)=>{
                  if(err){
                      res.json({message:err.message})
                  }
                  return res.json({message:'Registered Successfully'})
            })
        }
    })
})
app.post('/api/login',async (req,res)=>{
    const {email,password} = req.body
    console.log(email)
    pool.query(`select * from users where email=?`,[email],(err,result,fields)=>{
       if(err) return err;
       if(result.length===0)return res.json({message:"No User Exists"})
        if(result[0]){
            if(result[0].password===password){
                const token = jwt.sign({email:email},process.env.JWT_SECRET)
                res.json({message:'Login Success',token})
            }
            else{
                res.json({message:'Incorrect Password'})
            }
        }
        else{
            res.json({message:'User Not Found'})    
        }
    })
})

app.get('/api/user',authMiddleware,(req,res)=>{
     const userEmail = req.user.email
     pool.query(`select * from users where email=?`,[userEmail],(err,result,fields)=>{
        if(err)console.log(err)
        res.json(result[0].username)
     })
})

// app.get('/api/search',(req,res)=>{
//     const src= req.query.src
//     const dest = req.query.dest
//     const date = req.query.date
//     console.log('source  - '+src)
//     console.log('destination  - '+dest)
//     console.log('date - '+date)
//     pool.query(`
//     SELECT s1.train_number
//     FROM station s1
//     JOIN station s2 ON s1.train_number = s2.train_number
//     WHERE s1.stop < s2.stop
//     AND (
//         (s1.station_name = ? AND s2.station_name =?)
//     );
//     `,[src,dest,src,dest],async(err,result,fields)=>{
//         if(err) return console.log(err)
//         if(result.length===0)return res.json({
//             found:false,
//             trains:[]
//         })
//         else{
//            var res_len = result.length
//            var arr = []
//            while(res_len--)arr.push(result[res_len].train_number)
//            await pool.query(`SELECT train_name from trains where train_number in (?)`,[arr],(err,result,fields)=>{
//                   if(err)return console.log(err)
//                   if(result.length)
//                   return res.json({
//                 found:true,
//                 trains:result
//                 })
                
//                      })
//         }
//     })
// })

app.get('/api/search',(req,res)=>{
    const src= req.query.src
    const dest = req.query.dest
    const date = req.query.date
    console.log('source  - '+src)
    console.log('destination  - '+dest)
    console.log('date - '+date)
    pool.query(`
    SELECT 
    t1.train_number,
    t1.train_name,
    (SELECT TIME(r2.arrival_time) FROM routes1 r2 WHERE r2.train_number = t1.train_number AND r2.curr_station = ?) AS arrival_time_at_source
FROM 
    trains1 t1
WHERE 
    t1.train_number IN (
        SELECT r2.train_number 
        FROM routes1 r2 
        JOIN routes1 r1 ON r2.train_number = r1.train_number 
        WHERE 
            r2.curr_station = ? 
            AND r1.curr_station = ?
            AND r2.stop_no < r1.stop_no 
            AND DATE(r2.arrival_time) = ?
    );
    `,[src,src,dest,date],(err,result,fields)=>{
       
        if(err)
        return console.log(err)
        if(result.length){
            console.log(result)
     
        return res.json({
            found:true,
            trains:result
        })}
        console.log(false)
        return res.json({
            found:false
        })
        

    })
//     pool.query(`
//     SELECT s1.train_number
//     FROM station s1
//     JOIN station s2 ON s1.train_number = s2.train_number
//     WHERE s1.stop < s2.stop
//     AND ( let arr=[]
//         (s1.station_name = ? AND s2.station_name =?)
//     );
//     `,[src,dest,src,dest],async(err,result,fields)=>{
       
// })
})



app.listen(PORT || process.env.PORT,()=>{
    
    console.log('Server is running on port 3000')
    console.log('Connected to mysql database')
})