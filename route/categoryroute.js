const { creatCatrgory,getCategory } = require('../controler/categorycontrol')
const { checkid, validatorresult } = require('../midleware/validators/IDmongovalidator')
const { verfytoken, verfytokenAndAdmin } = require('../midleware/verfytokenMidleWare/verfytoken')
const { route } = require('./postroute')

const router= require('express').Router()

// /api/category/

router.post('/category', verfytokenAndAdmin,creatCatrgory)


router.get('/category',getCategory)





module.exports=router