const { User } = require("../models/authmodel");

const asynchandler = require("express-async-handler");
const bcrybt = require("bcrypt");
const { Apierr } = require("../errorhandeler/apierror");
const jwt= require('jsonwebtoken')

/**
 *-------------------------------------------------
 * @access  all
 * @route  /api/auth/register
 * @method post
 *
 * @desc register user
 * ----------------------------------------------
 */
module.exports.Adduser = async (req, res, next) => {
  console.log(req.body.name)
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("email is used");
      return res.status(400).json({ error: " email is used" });
    } else {
      console.log("no email");
      let pass= req.body.password
      let newpass= await bcrybt.hash(pass,10) 


      let dataaa = await new User({
        name: req.body.name,
        email: req.body.email,
        password: newpass
      });

       console.log(dataaa);
      await dataaa.save();
      res.status(201).json("user saved");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
/**
 *-------------------------------------------------
 * @access  all
 * @route  /api/auth/login
 * @method post
 *
 * @desc LOGIN user
 * ----------------------------------------------
 */
module.exports.loginuser=async(req,res,next)=>{

try{
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
      return  res.status(400).json({message:"email not found"}) ;
  
   

  }

  
  const checkpassword= await bcrybt.compare(req.body.password,user.password)
  if(!checkpassword){
    console.log('errr password')
     return res.status(400).json({message:" password in correct"})

  }
  const token=user.Createtoken()//user is object from schema and creattoken is methods in schema
  res.status(200).json({
    user:user,
    token:token

  })


  
}catch(err){
  console.log(err)

  next(new Apierr(err,400))
}

}
