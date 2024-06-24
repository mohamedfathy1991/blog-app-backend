const router= require('express').Router()
const {getalluser, getprofileuser, updateuser, profilephotoupload, deletuser} =require('../controler/userscontrol')
const {verfytoken,verfytokenAndAdmin, verfytokenuserhimself, verfytokenuserhimselforAdmin}= require('../midleware/verfytokenMidleWare/verfytoken')
const {checkid,validatorresult}= require('../midleware/validators/IDmongovalidator')
const { inputresult, Userupdatevalidation } = require('../midleware/validators/uservalidator')



 const {upload,chekimageErr}=require('../midleware/uploadimage')
const { Apierr } = require('../errorhandeler/apierror')

// /api/users/alluser
router.get('/alluser', verfytokenAndAdmin, getalluser)



// /api/users/profile/:id
// i made express validator for id because you mult enter valid mongoose id
router.get('/profile/:id',verfytoken,checkid,validatorresult, getprofileuser)


// /api/users/profile/:id  update user 
router.put('/profile/:id', verfytokenuserhimself,Userupdatevalidation,inputresult,updateuser)


// /api/users/profile/:id  delet user  

router.delete('/profile/delet/:id', verfytokenuserhimselforAdmin,checkid,validatorresult,Userupdatevalidation,deletuser)



// /api/users/profile/upload-profile-photo  upload photo for user

router.post('/profile/upload-profile-photo', verfytoken,
upload,chekimageErr,profilephotoupload)


module.exports=router