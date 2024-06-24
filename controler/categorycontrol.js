const { Apierr } = require("../errorhandeler/apierror");
const {Category,validateCategory} = require("../models/category");

/**
 *-------------------------------------------------
 * @access  private only admin
 * @route  /api/category/
 * @method post
 *
 * @des create new category
 * ----------------------------------------------
 */

 module.exports.creatCatrgory = async (req, res, next) => {
    try {
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const category= await Category.create({
        title:req.body.title,
        user:req.user.id,

      })
      //status 201 for creation any thing and 200 for finding
  
      res.status(201).json(category);
    } catch (err) {
      console.log(err);
      next(new Apierr(err,400));
    }
  };
  /**
 *-------------------------------------------------
 * @access   public any one
 * @route  /api/category
 * @method get
 *
 * @desget all category
 * ----------------------------------------------
 */

  module.exports.getCategory=async (req,res,next)=>{

    try{
       const category= await Category.find()
        res.status(200).json(category)
    }
    catch (err) {
        console.log(err);
        next(new Apierr(err));
      }
  }