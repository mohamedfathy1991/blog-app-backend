const check= require('express-validator').check
const validatorresult= require('express-validator').validationResult




// validation for registeration
const Userinputvlidator=[
    
    check('name').notEmpty().withMessage('entername'),
    check('email').isEmail().withMessage('enter email pls'),
    check('password').isLength({min:3}).withMessage('enter password'),
    check('confirmPassword').custom((value,{req})=>{
        if(value ==req.body.password) return true
        else throw "password not matched" 
      })



]
const Userloginvlidator=[
    check('email').isEmail().withMessage('enter email pls'),
    check('password').isLength({min:3}).withMessage('enter password'),
    



]


// user update validation
const Userupdatevalidation=[
    check('name').notEmpty(),
   
    
    check('name').isLength({min:3}).withMessage('entername more than 3 letter'),
    
     check('password').isLength({min:3}).withMessage('enter password'),
    


]


const inputresult=(req,res,next)=>{

    const error= validatorresult(req)
    
    
        if (!error.isEmpty()) {
            console.log(error)
            return res.status(400).json({ errors: error.array()[0] });
          

    }else{
        next()
    }




}
module.exports={
    inputresult,
    Userinputvlidator,
    Userloginvlidator,
    Userupdatevalidation


}