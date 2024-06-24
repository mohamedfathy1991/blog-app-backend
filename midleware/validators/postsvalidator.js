const check= require('express-validator').check
const validatorresult= require('express-validator').validationResult


// validation for post input
const postvlidator=[
    check('title').notEmpty().withMessage('enter title'),
    check('describtion').notEmpty().withMessage('enter describtion'),
    check('category').notEmpty().withMessage('enter category'),




]
const postValidationResult=(req,res,next)=>{
    console.log("pooost ")
    console.log(req.body)
    const error= validatorresult(req)
    
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0] });
          

    }else{
        next()
    }




}
module.exports={
    postvlidator,
    postValidationResult

}