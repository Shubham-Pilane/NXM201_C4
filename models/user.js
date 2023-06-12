const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{type:String},
    password:{type:String}
})

const UserModel=mongoose.model("user",userModel)

module.exports={
    UserModel
}