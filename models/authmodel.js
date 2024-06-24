const DBURL='mongodb://0.0.0.0/blogproject'
const bcrybt =require('bcrypt')
const jwt=require('jsonwebtoken')


const mongoose =require('mongoose')

const schemamodel= mongoose.Schema({
    name:{type:String,
        required:true,
        trim:true,
        minlength:3, 
    
    },
    email:{type:String,
        required:true,
        trim:true,
        minlength:3, 
        unique:true
    
    }, password:{type:String,
        required:true,
        trim:true,
        minlength:3, 
    
    },
    bio:String,

    profilephoto:{
        type:Object,
      default:{
        url:"",
        publicid:null// because i use cloudinary to save image 

      }
      
        
    }, isAdmin:{
        type:Boolean,
        default:false,
        
    },
    isAccountVerfy:{
        type:Boolean,
        default:false,
        
    }

},{timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}


})


// get posts which belong the user when i made get profile 


schemamodel.virtual('post_user',{
  ref:'posts',// the name of model
 foreignField:'user',// from user in post model and it must in the postmodel
  localField:'_id'
})




schemamodel.methods.hashpassword = function(password){//new add methods in schema
    return bcrybt.hashSync(password,10)
  }
  schemamodel.methods.Createtoken=function(){
    return jwt.sign({id:this._id,IsAdmin:this.isAdmin},process.env.JWT_SECRET,{expiresIn:'1h'})

  }
  schemamodel.methods.Verfytoken= function(token){

    return jwt.verify(token,process.env.JWT_SECRET)
  }


const User= mongoose.model('users',schemamodel)


module.exports={
    User
}