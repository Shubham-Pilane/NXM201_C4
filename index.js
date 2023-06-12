const express= require("express")
const {connection}=require("./db")
const{WeatherModel}=require("./models/weather")
const app=express()
const{userRouter}=require("./routes/userRoute")
app.use(express.json())
const Redis = require("ioredis");
const redis = new Redis();
const winston = require('winston');
const rateLimit=require("express-rate-limit")
const axios=require("axios")
const {authMiddleware}=require("../middleware/authmiddleware")
const {validMiddleware}=require("../middleware/validationMiddleware")

app.get("/",(req,res)=>{
    res.send("This is home page")
})

app.use("/user",userRouter)

// --------------********   Beacuse of lack of time evrything is in index.js 
// there is no seperate route for Weather  *******--------------------


// ---------------------******---------------------------

// Getting weather information

app.get("weatherinfo",async(req,res)=>{
    try { 

        //First catching the Data 3)
        
        const {city}=req.query
        const catcheData= await redis.get(city)

        if(catcheData)
        {
            res.status(200).send(catcheData)
        }
        else{
            const apiURL=`https://api.weatherstack.com/current?access_key=e87ccd2e6fbe2ded06e16fc9e599096c&query=${city}`
            const res=await axios.get(apiURL)
            const weatherData=res.data
            res.status(200).send(weatherData)
    
            //set the data in redis for 30 min 4)
    
            redis.set(city,JSON.stringify(weatherData),1800)
    
            //now save the weather data in mongoDb  5)
    
            const weather=new WeatherModel({
                city,
                data:weatherData
            })
            await weather.save()
    
        }

       
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


//winston setup 6)

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log' }),
    ],
  });


  //Rate limiter   7)

  const limiter=rateLimit({
    windoMs: 3 * 60 * 1000,
    //Rate limiter for 3 minutes
    max:1,
  })
  app.use(limiter)



app.listen(8000,async()=>{
try {
    await connection
    console.log("connected to db atlas")
} catch (error) {
    console.log(error)
}
})
