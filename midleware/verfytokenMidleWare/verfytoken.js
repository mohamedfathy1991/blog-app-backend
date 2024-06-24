 const jwt =require('jsonwebtoken')

module.exports.verfytoken= (req,res,next)=>{
   
    // i send with token word Barear and i remove it at header
    const tokenverfy= req.headers.authorization
  
    
    
    if (tokenverfy){
          const token= tokenverfy.split(" ")[1] 
        try{
            console.log('try payload')
         const payload= jwt.verify(token,process.env.JWT_SECRET)
         console.log(payload)

         req.user=payload
          next()

        }catch(err){
            return res.status(401).json({
                message:"  error token experied"
            })



        }

    }else{

        return res.status(401).json({
            message:"not allowed please send token"
        })
    }


}

module.exports.verfytokenAndAdmin=async(req,res,next)=>{
    this.verfytoken(req,res,()=>{
        if(! req.user.IsAdmin){
        res.status(402).json({message:"you are not admin"})
        }else{
            next()
            
        }
    })

}
// this check for is the user is himself to update his data
module.exports.verfytokenuserhimself=async(req,res,next)=>{
    this.verfytoken(req,res,()=>{
        if(   req.user.id == req.params.id){
            next()

        
        }else{
            res.status(402).json({message:"you are not allow to change data "})
            
        }
    })

}

// check if is admin or the user himself
module.exports.verfytokenuserhimselforAdmin=async(req,res,next)=>{
    this.verfytoken(req,res,()=>{
        if(   req.user.id == req.params.id||   req.user.IsAdmin  ){
            next()

        
        }else{
            res.status(402).json({message:"you are not allow to delet user "})
            
        }
    })

}