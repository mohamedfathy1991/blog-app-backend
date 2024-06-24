const { creatNewComment, getallcomment, deletcomment, updateComment } = require('../controler/commentControl')
const { checkid, validatorresult } = require('../midleware/validators/IDmongovalidator')
const { verfytoken, verfytokenAndAdmin } = require('../midleware/verfytokenMidleWare/verfytoken')

const router= require('express').Router()



// /api/comment/addcomme
router.post('/addcomment', verfytoken,creatNewComment)



// /api/comment/allcomment
router.get('/allcoment',verfytokenAndAdmin,getallcomment)


router.get('/delet/:id',verfytoken,checkid,validatorresult,deletcomment)
// /api/comment/update/:id
router.put('/update/:id',verfytoken,checkid,validatorresult,updateComment)


module.exports=router