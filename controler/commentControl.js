const { Apierr } = require("../errorhandeler/apierror");
const { User } = require("../models/authmodel");
const { Comment, validateCreateComment, validateupdateComment } = require("../models/commentModel");

/**
 *-------------------------------------------------
 * @access  private log in users
 * @route  /api/commnet/addcomment
 * @method post
 *
 * @des create comments for posts
 * ----------------------------------------------
 */

module.exports.creatNewComment = async (req, res, next) => {
  try {
    const { error } = validateCreateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { postid } = req.body;
    const profile = await User.findById(req.user.id);
    const comment = await Comment.create({
      text: req.body.text,
      postid: postid,
      user: req.user.id,
      username: profile.name,
    });
    //status 201 for creation any thing and 200 for finding

    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    next(new Apierr(err));
  }
};
/**
 *-------------------------------------------------
 * @access  private admin only
 * @route  /api/commnet/allcomments
 * @method get
 *
 * @des get all comment
 * ----------------------------------------------
 */

module.exports.getallcomment = async (req, res, next) => {
  try {
    const allcomment = await Comment.find().populate("user");
    res.status(200).json(allcomment);
  } catch (err) {
    next(new Apierr(err, 400));
  }
};

/**
 *-------------------------------------------------
 * @access  private admin only or user him self
 * @route  /api/comnet/delet/:id
 * @method delet
 *
 * @des get all comment
 * ----------------------------------------------
 */

module.exports.deletcomment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(400).json({ message: "no comment found" });
    }
    if (req.user.IsAdmin || req.user.id == comment.user.toString()) {
      await Comment.findByIdAndDelet(req.params.id);
      res.status(200).json({ message: "comme" });
    } else {
      res.status(403).json({ message: "not allow to delet comment" });
    }
  } catch (err) {
    next(new Apierr(err, 400));
  }
};
/**
 *-------------------------------------------------
 * @access  private  user him self
 * @route  /api/comment/update/:id
 * @method put
 *
 * @des update comment
 * ----------------------------------------------
 */

module.exports.updateComment = async (req, res, next) => {
  try {
    const { error } = validateupdateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const comment= await Comment.findById(req.params.id)
    if(!comment){
        // 404 for not found
        return res.status(404).json({message:"no comment found"})
    }
    if(req.user.id!==comment.user.toString()){
        return res.status(403).json({message:"not allow to update"})
    }else{
      console.log(req.body.text)
       const newcomment= await Comment.findByIdAndUpdate(req.params.id,{
            $set:{text:req.body.text}
        },{new:true})
        res.status(200).json(newcomment)
    }


    //status 201 for creation any thing and 200 for finding

    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    next(new Apierr(err));
  }
};
