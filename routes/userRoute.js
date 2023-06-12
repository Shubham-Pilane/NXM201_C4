const {Router}=require("express")
const{UserModel}=require("../models/user")
require('dotenv').config()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const{WeatherModel}=require("./models/weather")

const winston=require("winston")
const {authMiddleware}=require("../middleware/authmiddleware")
const {validMiddleware}=require("../middleware/validationMiddleware")

//redis
const Redis = require("ioredis");
const redis = new Redis();



const userRouter=Router()

// register route   1)

userRouter.post("/register",async(req,res)=>{

    const {password,email}=req.body
    try {
        const user= await UserModel.findOne({email:email})
        if(user)
        {
            res.status(200).send({"msg":"user already present"})
        }
        else{
            bcrypt.hash(password,10,async(err,hash)=>{
                if(hash)
                {
                    let pass=hash;
                    const newUser=new UserModel({...req.body,password:pass})
                    await newUser.save()
                    res.status(200).send({"msg":"New user is Registerd"})
                }
                else{
                    res.status(200).send({"msg":err})
                }
            })
        }
    } catch (err) {
        res.status(200).send({"msg":err})
    }
})

//Login route 2)

userRouter.post("/login",async(req,res)=>{
  const{email,password}=req.body
  try {
    let user=await UserModel.findOne({email:email})
    if(user)
    {
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result)
            {
                const token=jwt.sign({userID:user["_id"],user:user.name},process.env.Secret_key,{expiresIn:"5m"});
                const refreshToken=jwt.sign({userID:user["_id"],user:user.name},process.env.Secret_key,{expiresIn:"5m"})
           
            redis.set(token,user._id,"EX",300)

            res.status(200).json({"msg":"user login","token":token,"refreshtoken"})
           
            }
            else{
                res.status(200).send({"msg":"Wrong password"})
            }
        })

  }
  else{
    res.status(400).send({"msg":"Wrong password"})
  }
 } catch (error) {
    res.status(400).send({"msg":error})
  }
})







module.exports={
    userRouter
}

