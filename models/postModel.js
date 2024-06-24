const mongoose = require('mongoose')




const postschema=mongoose.Schema({
    tittle:{type:String,
    
        required:true,
        trim:true,
        minlength:2,
        maxlength:200
    
    },
    describtion:{type:String,
    
        required:true,
        trim:true,
        minlength:2,
        maxlength:200
    
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    category:{
        type:String,
        required:true,
       
    },
    image:{
        type:Object,
        default:{
            url:'',
            bublicid:null
        }
    },
    likes:[{ type:mongoose.Schema.Types.ObjectId, ref:'users'}]
},{timestamps:true,
    toJSON:{virtuals:true},
toObject:{virtuals:true}

})

postschema.virtual('comments',{
    ref:'comments',// this is the name of model brlong to comment,
   
   
    foreignField:'postid',// element from comment mondel

   
    localField:'_id'

})


const Post = mongoose.model('posts',postschema)




module.exports= Post
