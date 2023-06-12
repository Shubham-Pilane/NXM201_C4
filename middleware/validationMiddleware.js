const validMiddleware=(req,res,next)=>{
    const{city}=req.query

    if(typeof city !=="String" || city.match(/[0-9!@#$%^&{}<>]/)) 
    {
        return res.status(400).json({"msg":"Invalid city Format"})
    }
    nexxt()
}

module.exports={
    validMiddleware
}