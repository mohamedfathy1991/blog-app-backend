 class Apierr extends Error{

   constructor(message,status){
    super()
   

    this.message=message.message?message.message:message// message.message to get all in formation
    this.status= status
   }

 }

const Errhandler= (err,req,res,next)=>{
  console.log(err)

  res.status(err.status).json({message:err.message,
      stack: process.env.NODE_ENV==="production"?null: err.stack,

      status:err.status
  })

}


 module.exports={
  Apierr,Errhandler
 }