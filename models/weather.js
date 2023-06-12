const mongoose=require("mongoose")

const weatherSchema=mongoose.Schema({
    city:{type:String},
    data:{type:Object},
})

const WeatherModel=mongoose.model("weather",weatherSchema)

module.exports={
    WeatherModel
}