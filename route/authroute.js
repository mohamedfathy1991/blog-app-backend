const router= require('express').Router()
const { Userinputvlidator , inputresult,Userloginvlidator} =require( '../midleware/validators/uservalidator')
const {Adduser, loginuser}=require('../controler/authcontrol')





// /api/auth/register
router.post('/register',
Userinputvlidator ,
inputresult,
Adduser)
// /api/auth/login
router.post('/login',
// Userloginvlidator ,
// inputresult,
loginuser)



module.exports=router