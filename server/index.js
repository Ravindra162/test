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
    const {userId,ticketInfo,passengers} = req.body
    console.log(ticketInfo)
    console.log(passengers)
    pool.query(`INSERT INTO payment (payment_amount, date, method, user_id)
                VALUES (?, NOW(), 'NETBANKING',?);`,[ticketInfo.price*ticketInfo.passengerCount,userId],(err,result,fields)=>{
                    if(err)return console.log(err)
                    console.log(result.insertId)
                    res.json({
                     isDone:true,
                     payment_id:result.insertId})
                })
  })


  function generatePNR(existingNumbers) {
    const generatedPNR = Math.floor(Math.random() * (1999999999 - 100000000 + 1)) + 1000000000;

    if (existingNumbers.includes(generatedPNR)) {
        // If it exists, generate a new PNR
        return generatePNR(existingNumbers);
    } else {
        return generatedPNR;
    }
}
function generateSeat(class_type) {
    let seat;
    if (class_type === '3A') {
        seat = Math.floor(Math.random() * 64) + 1;
    } else if (class_type === '2A') {
        seat = Math.floor(Math.random() * 54) + 1;
    } else if (class_type === 'Sleeper') {
        seat = Math.floor(Math.random() * 80) + 1;
    } else if (class_type === '1A') {
        seat = Math.floor(Math.random() * 32) + 1;
    } else {

        seat = null;
    }
    return seat;
}
function generateCompartment(class_type){
    let threeTier = ['B1','B2','B3']
    let sleeperTier = ['S1','S2','S3','S4']
    let twoTier = ['A1','A2']
    let oneTier = 'H1'
    if(class_type==='3A')
    {
         return threeTier[Math.floor(Math.random()*threeTier.length)]
    }
    else if(class_type==='2A'){
        return twoTier[Math.floor(Math.random()*twoTier.length)]
    }
    else if(class_type==='1A')
    return oneTier
    else{
        return sleeperTier[Math.floor(Math.random()*sleeperTier.length)]
    }
}




app.post('/api/book-ticket', (req, res) => {
    const ticket = req.body.ticketDetails;
    const userId = req.body.userId;
    const passengers = req.body.passengers;
    const crucks = req.body.crucks;
    const { payment_id } = req.body;
    
    let offsetDays;
    let startDateTime;
    let endDateTime;
    let generatedPNR;
    
    pool.getConnection((err, connection) => {
        if (err) {
            return console.error(err);
        }
        
        connection.beginTransaction((err) => {
            if (err) {
                return console.error(err);
            }
            
            // QUERY - 1: Get offsetDays and startDateTime
            connection.query(`SELECT DAY(arrival_time) AS DAY, TIME(arrival_time) AS TIME FROM routes1 WHERE train_number=? AND (curr_station=? OR curr_station=?)`,
                [ticket.trainNumber, crucks.source, crucks.destination], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error(err);
                            connection.release();
                        });
                    }
                    // Calculate endDateTime based on offsetDays and month logic

                    offsetDays = result[1].DAY - result[0].DAY;
                    offsetDays =  result[1] - result[0]
                    startDateTime = crucks.date+' '+result[0].TIME
                    let currentMonth = crucks.date.substr(5,2)
                    let currentDate = crucks.date.substr(8,2)
                    let end_date = currentDate;
                    
                        if(currentMonth==='01' || currentMonth==='03' || currentMonth==='05' || currentMonth==='07' || currentMonth==='08' || currentMonth==='10' || currentMonth==='12'){
                            if(currentDate=='31'){
                                end_date=parseInt(end_date)
                                end_date+=offsetDays%31
                            }
                        }
                        else if(currentMonth==='04' || currentMonth==='06' || currentMonth==='09' || currentMonth==='11'){
                               end_date=parseInt(end_date)
                               end_date+=offsetDays%30
                        }
                        else if(currentMonth==='02'){
                            end_date=parseInt(end_date)
                            end_date+=offsetDays%28
                        }
                
                    
                    console.log('Current date : '+currentDate)
                    console.log('Current month : '+currentMonth)
                    console.log('StartTime : '+startDateTime)
                  


                 
                    endDateTime = crucks.date.substr(0,8)+end_date+' '+result[1].TIME
                    console.log('EndTIme: ',endDateTime)

                    
                    console.log('Start Time: ', startDateTime);
                    console.log('End Time: ', endDateTime);
                    
                    // QUERY - 2: Get PNR
                    connection.query('SELECT PNR FROM ticket', (err, res) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error(err);
                                connection.release();
                            });
                        }
                        
                        generatedPNR = generatePNR(res);
                        
                        // QUERY - 3: Insert Passengers
                        connection.query('INSERT INTO passenger (first_name, last_name, age, gender, contact) VALUES ?', [passengers.map(passenger => [passenger.passengerName, passenger.passengerName, passenger.Age, passenger.Gender, passenger.ContactNo])], (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error(err);
                                    connection.release();
                                });
                                
                            }
                            let insertedPassengerIds = []
                                let lastInsertedId = result.insertId;
                               let numberOfPassengersInserted = passengers.length;

                              // Store the inserted IDs in the array
                               for (let i = 0; i < numberOfPassengersInserted; i++) {
                              insertedPassengerIds.push(lastInsertedId + i);
                              console.log(insertedPassengerIds)
                                       }
                            console.log('Passengers Inserted');

                            
                            // QUERY - 4: Insert Ticket
                            connection.query(`INSERT INTO ticket (PNR, train_number, source, destination, start_date, end_date, class, bookedBy_id, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [generatedPNR, ticket.trainNumber, crucks.source, crucks.destination, startDateTime, endDateTime, ticket.class, userId, payment_id], (err, res) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            console.error(err);
                                            connection.release();
                                        });
                                        
                                    }
                                    
                                    console.log('Inserted Id: ', res.insertId);
                                    let bookingValues = []
                                    insertedPassengerIds.forEach(passenger => {
                                        bookingValues.push({trainNumber:ticket.trainNumber, class:ticket.class, Date:startDateTime, seat:generateSeat(ticket.class), compartment:generateCompartment(ticket.class), PNR:generatedPNR, passenger_id:passenger});
                                    });
                                    console.log(bookingValues)
                                    
                                    // QUERY - 5: Insert Payment
                                    connection.query(`INSERT INTO bookings
                                                     (train_number, class_type, date, seat_number, compartment_name, PNR, passenger_id) VALUES
                                                     ?`,
                                        [bookingValues.map(booking=>[booking.trainNumber,booking.class,booking.Date,booking.seat,booking.compartment,booking.PNR,booking.passenger_id])], (err, result) => {
                                            if (err) {
                                                return connection.rollback(() => {
                                                    console.error(err);
                                                    connection.release();
                                                });
                                            }
                                            
                                            console.log('Bookings Inserted');
                                            // Commit the transaction
                                            connection.commit((err) => {
                                                if (err) {
                                                    return connection.rollback(() => {
                                                        console.error(err);
                                                        connection.release();
                                                    });
                                                }
                                                
                                                console.log('Transaction Completed');
                                                connection.release();
                                            });
                                        });
                                });
                        });
                    });
                });
        });
    });
});


//     //Points to be done
//     // 2. ticket insertion
//     // 3. passenger insertion
//     // 4. booking insertion
//     // 5. ticket count updation in class table

app.listen(PORT || process.env.PORT,()=>{
    console.log('Server is running on port 3000')
})