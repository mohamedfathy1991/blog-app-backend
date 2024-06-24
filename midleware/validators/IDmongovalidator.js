

const check = require("express-validator").check;
const validatorresult= require('express-validator').validationResult



module.exports.checkid=[
    check("id").isMongoId().withMessage(" error id please enter valid id")
]


module.exports.validatorresult=(req, res,next) => {
    const err = validatorresult(req);
    if (!err.isEmpty()) {
      res.json({ error: err.array()[0] });
    }
    next()
  }