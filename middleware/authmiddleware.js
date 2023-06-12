const authMiddleware=(req,res,next)=>{
    if(!req.user)
    {
        return res.status(400).json({"msg":"Unauthorized"})
    }
    next()
}

module.exports={
    authMiddleware
}