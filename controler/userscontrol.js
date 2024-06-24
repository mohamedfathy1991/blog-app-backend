const { Apierr } = require("../errorhandeler/apierror");
const { User } = require("../models/authmodel");
const bcrybt = require("bcrypt");
const mongoose = require("mongoose");
const path = require("path");
const { uploadImage, removeImage, removeMultipleImage } = require("../utilties/cloudinary");
const {Comment}=require('../models/commentModel')
const Post=require('../models/postModel')


const fs = require("fs");
/**
 *-------------------------------------------------
 * @access..private  admin
 * @route  /api/users/alluser
 * @method post
 *
 * @desc  get alluser
 * ----------------------------------------------
 */
module.exports.getalluser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    next(new Apierr(400, err));
  }
};

/**
 *-------------------------------------------------
 * @access..puplic
 * @route  /api/users/profile/:id
 * @method get
 *
 * @desc  get profile user
 * ----------------------------------------------
 */
module.exports.getprofileuser = async (req, res, next) => {

  try {
    const user = await User.findById(req.params.id, { password: 0 }).populate('post_user');

    if (!user) {
      return res.status(400).json({ message: "no user found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(new Apierr(400, err));
  }
};
/**
 *-------------------------------------------------
 * @access..private  only userhimself
 * @route  /api/users/profile/:id
 * @method put
 *
 * @desc  update user
 * ----------------------------------------------
 */
module.exports.updateuser = async (req, res, next) => {
  try {
    let newpassword;
    if (req.body.password) {
      newpassword = await bcrybt.hash(req.body.password, 10);
    }
   
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { name: req.body.name, bio: req.body.bio, password: newpassword },
        // new true mean  when i make res.json(user) ===>send the user with new update
        // not send the old user
      },
      { new: true }
    );
  
    

    res.status(200).json({
      message: "updatetds",
      user,
    });
  } catch (err) {
    next(new Apierr(400, err));
  }
};

/**
 *-------------------------------------------------
 * @access..private  only login
 * @route  /api/users/profile/upload-profile-photo
 * @method post
 *
 * @desc  profile photo uplad
 * ----------------------------------------------
 */


module.exports.profilephotoupload = async (req, res, next) => {
  try {
    //1 validation if threre is image or not
    if (!req.file) {
      return res.status(400).json({ message: "no file upload " });
    }
    console.log(" the path is ");

    //**2 ***get the path of image which multer made it
    const imagepath = path.join(__dirname, `../images/${req.file.filename}`);
    console.log(imagepath);
    //3 uplad to cloudinary

    const result = await uploadImage(imagepath);
    console.log(result.secure_url);

    //4 add image url id
    //req.user.id this from verfy token i made object req.user=(payload)==>resukt of verfy token
    console.log("req.user.id");

    console.log(req.user.id);
    let use = await User.findById(req.user.id);

    console.log(use);

    //5 remove old photo from cloudinary
    if (use.profilephoto.publicid !== null) {
      console.log('not null and there is image profile')
      await removeImage(use.profilephoto.publicid);
    }

    //6 change in db profile photo


      use.profilephoto = {
      url: result.secure_url,
      publicid: result.public_id,
    };
    console.log(use)
     await use.save();
     //7 remove photo from server from folder image
     fs.unlinkSync(imagepath)
  

    res.status(200).json({ message: "upload photo success", 
    user :use
 });
  } catch (err) {
    console.log(err);
    next(new Apierr(err));
  }
};

/**
 *-------------------------------------------------
 * @access..private  only userhim self or admin
 * @route  /api/users/profile/delet/:id
 * @method delet
 *
 * @desc delet the phrofile pgoto
 * ----------------------------------------------
 */



 module.exports.deletuser=async(req,res,next)=>{
  console.log("delete youser")
  
  try{
    // 1 get user from db
    
  const user =await User.findById(req.params.id)
    if(!req.params.id){
        return res.json({message:"not user found"})
      }
  //2 @TODO get all posts and  from db of this user
  
   const posts = await Post.find({user:user})
   console.log(posts)
   
  //  ######## in ned to convert posts to array to send it to remove multiple image in cloudinary 
    const imagepublicids=posts?.map(post=>post.image.bublicid)

// it take array of image id
if(imagepublicids?.length>0){
  await removeMultipleImage(imagepublicids)  

}
  //3 @TODO delet posts of user

  


  //4  delet phofile imagage from cordinary of user
    await removeImage(user.profilephoto.publicid)


 //5 @TODO delet user comment and posts
 await Post.deleteMany({user:user._id})
  await Comment.deleteMany({user:user._id})

 // delet user himself
   await User.findByIdAndDelete(req.params.id)
   res.status(200).json({
    message:"user delet"
   })
  }catch(err){
    next (new Apierr(err.message,400))
  }


}