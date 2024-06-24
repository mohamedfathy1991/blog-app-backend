
var mongoose = require('mongoose');
require('dotenv').config()
const asynchandler= require('express-async-handler')

//Set up default mongoose connection
const mongoDB = process.env.DBURL

module.exports=async()=>{
    try{
  await mongoose.connect(process.env.DBURL)
  console.log(`CONECTED+  ${process.env.DBURL}` )
}catch(err){
    console.log('err coure in db')
    process.exit(1)

}

}

  
 
