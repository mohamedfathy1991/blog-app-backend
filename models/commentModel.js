


const joi =require('joi')
const mongoose = require('mongoose');
//Set up default mongoose connection

const  commentSchema= mongoose.Schema({

text:{
    type:String,
    requred:true
},
user:{
    type:mongoose.Types.ObjectId,
    ref:'users',
    requred:true
    
},
postid:{type:mongoose.Types.ObjectId,
    ref:'posts',
    requred:true},

username:{type:String,
    requred:true
}



},{
    timestamps:true
})


const Comment= mongoose.model("comments",commentSchema)

  // schema validation for input in stead of express validator
function validateCreateComment(obj){
    const  schema = joi.object({
        postid: joi.string().required().label(" enter post id"),
        text:joi.string().required().trim()
    })  
    return schema.validate(obj)      

    

}
function validateupdateComment(obj){
    const  schema = joi.object({
       
        text:joi.string().required().trim()
    })  
    return schema.validate(obj)      

    

}







module.exports={

    Comment,
    validateCreateComment,
    validateupdateComment
}