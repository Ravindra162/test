const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const {createPool} = require('mysql')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const pool = mysql.createPool({
    host:process.env.HOST,
    user:'ulvmgjqopj6xyagv',
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})


pool.query(`SELECT * from trains1`,function(err,result,fields){
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
        res.json({
                username:result[0].username,
                userId:result[0].user_id
         })
     })
})


function arrangeData(trainsArray) {
    let i;
    let currentTrain = '..'; // Initialize with a dummy value
    let res = [];

    for (i = 0; i < trainsArray.length; i++) {
        if (currentTrain !== trainsArray[i].train_number) {
            // If it's a new train, push a new train object into the result array
            currentTrain = trainsArray[i].train_number;
            res.push({
                train_number: currentTrain,
                train_name: trainsArray[i].train_name,
                class_price_avail: [{
                    class: trainsArray[i].class_type,
                    available_tickets: trainsArray[i].available_tickets,
                    ticket_price: trainsArray[i].ticket_price
                }]
            });
        } else {
            // If it's the same train, find its entry in the result array and add class data
            const trainIndex = res.findIndex(train => train.train_number === currentTrain);
            res[trainIndex].class_price_avail.push({
                class: trainsArray[i].class_type,
                available_tickets: trainsArray[i].available_tickets,
                ticket_price: trainsArray[i].ticket_price
            });
        }
    }
    return res;
}


app.get('/api/search',(req,res)=>{
    const src= req.query.src
    const dest = req.query.dest
    const date = req.query.date
    console.log('source  - '+src)
    console.log('destination  - '+dest)
    console.log('date - '+date)
    pool.query(`
    SELECT  t1.train_number,t1.train_name,TIME(r2.arrival_time) AS
     sourceTime,DATE(r2.arrival_time) AS
     sourceDate,TIME(r1.arrival_time) AS destinationTime, DATE(r1.arrival_time) AS destinationDate,
      c.class_type,    
      c.seats_available AS available_tickets,    
       c.ticket_price 
       FROM trains1 t1 JOIN 
       routes1 r2 ON t1.train_number = r2.train_number JOIN routes1 r1 ON 
       r2.train_number = r1.train_number  JOIN      
       class c ON t1.train_number = c.train_number 
       WHERE r2.curr_station =? AND r1.curr_station =?    
       AND r2.stop_no < r1.stop_no  AND DATE(c.train_date) =?;

    `,[src,dest,date],(err,result,fields)=>{
       
        if(err)
        return console.log(err)
        if(result.length){
            // co   nsole.log(result)
            var new_result = arrangeData(result)
            console.log(new_result[0])
            
            return res.json({
                found:true,
                trains:new_result
            })
     
    }
        console.log(false)
        return res.json({
            found:false
        })
        

    })

})

  app.post('/api/payment',(req,res)=>{
    const {userId,ticketInfo} = req.body
    console.log(userId)
    console.log(ticketInfo)
    pool.query('insert into tickets ')
    return res.json({
        isDone:true
    })
  })


app.post('/DonePayment',(req,res)=>{
    const ticket = req.body.ticketDetails
    const userId = req.body.userId
    const passengers = req.body.passengers
    console.log(ticket)
    console.log(userId)
    console.log(passengers)

})

app.post('book-ticket',(req,res)=>{
    
})

app.listen(PORT || process.env.PORT,()=>{
    console.log('Server is running on port 3000')
})