
const { Createnewpost, getallposts, getspecificpost, getpostcount, deletPosts, updatePostCtr, updateimagephoto, likeCtr } = require('../controler/postsControl')
const { upload, chekimageErr } = require('../midleware/uploadimage')
const { checkid,validatorresult } = require('../midleware/validators/IDmongovalidator')
const { postvlidator, postValidationResult } = require('../midleware/validators/postsvalidator')
const { verfytoken } = require('../midleware/verfytokenMidleWare/verfytoken')

const router= require('express').Router()




//api/posts/all


router.route('/all')
.post(verfytoken,upload,chekimageErr,postvlidator,postValidationResult,Createnewpost)
.get(getallposts)


//api/posts/count

router.get('/count',getpostcount)



//api/posts/:id
router.get("/post/:id" ,checkid,validatorresult, getspecificpost)



//api/posts/delet/:id
router.delete("/delet/:id", verfytoken,checkid,validatorresult, deletPosts)



//api/posts/updatepost/:id
router.put("/updatepost/:id", verfytoken,checkid,validatorresult, updatePostCtr)


// api/posts/updatephoto/:id



router.put("/updatephoto/:id", verfytoken,checkid,validatorresult,upload,chekimageErr, updateimagephoto)

// /api/posts/like/:id

router.put("/like/:id", verfytoken,checkid,validatorresult, likeCtr)





module.exports=router