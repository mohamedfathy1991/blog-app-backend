const { Apierr } = require("../errorhandeler/apierror");
const mongoose =require('mongoose')

  const {Comment}=require('../models/commentModel')
  const {Category}=require('../models/category')
 

const path = require("path");
const { uploadImage, removeImage } = require("../utilties/cloudinary");
const Post = require("../models/postModel");
const fs = require("fs");

/**
 *-------------------------------------------------
 * @access..private  login
 * @route  /api/posts/
 * @method post
 *
 * @desc  create new post with image
 * ----------------------------------------------
 */
module.exports.Createnewpost = async (req, res, next) => {
  try {
    // 1 check if there is photo
    if (!req.file) {
      return res.status(400).json({ message: "no photo upload  " });
    }
    //2 check validate of input ==> i made in route midlware
    //3 upload photo at cordinary  use function from utility
    const imagepath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await uploadImage(imagepath);
    // 4 create new post at data base
console.log('post upload')
console.log(req.body)
    const post = await Post.create({
      tittle: req.body.title,
      describtion: req.body.describtion,
      user: req.user.id, //==> from payload of token
      category: req.body.category,
      image: { url: result.secure_url, bublicid: result.public_id },
    });
   
    // 5send respose
    fs.unlinkSync(imagepath);
    res.status(201).json(post);
    //6 delet photo from server
  } catch (err) {
    next(new Apierr(err, 400));
  }
};
/**
 *-------------------------------------------------
 * @access..all
 * @route  /api/posts/
 * @method get
 *
 * @desc getall post by category or all
 * ----------------------------------------------
 */

module.exports.getallposts = async (req, res, next) => {
  try {
    
    const { pageNumber, category } = req.query;
    let post_forpage = 2;

    if (category != "undefined") {
      console.log('category')
  
      
      const posts = await Post.find({ category })
        .sort({ createdAt: -1 })
        .populate("user", { password: false });
      return res.status(201).json(posts);
    }
    if (pageNumber) {
      const posts = await Post.find()
        .skip((pageNumber - 1) * post_forpage)
        .limit(post_forpage)
        .sort({ createdAt: -1 })
        .populate("user", { password: false });
      return res.status(201).json(posts);
    }
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", { password: false });
    return res.status(201).json(posts);
  } catch (err) {
   
    next(new Apierr(err, 400));
  }
};
/**
 *-------------------------------------------------
 * @access.all
 * @route  /api/posts/:id
 * @method get
 *
 * @desc getall one post
 * ----------------------------------------------
 */

module.exports.getspecificpost = async (req, res, next) => {
  try {

    const { id } = req.params;

    const post = await Post.findById(id).populate('comments').populate('user');
    if (!post) {
      res.status(400).json({ message: "no post found" });
    }

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    next(new Apierr(err, 400));
  }
};

/**
 *-------------------------------------------------
 * @access..all
 * @route  /api/posts/count
 * @method get
 *
 * @desc get number op posts
 * ----------------------------------------------
 */

module.exports.getpostcount = async (req, res, next) => {
  try {
    const count = await Post.count();
    if (!count) {
      res.status(400).json({ message: "no post found" });
    }

    res.status(201).json(count);
  } catch (err) {
    console.log(err);
    next(new Apierr(err, 400));
  }
};
/**
 *-------------------------------------------------
 * @access user himself or admin
 * @route  /api/posts/delet/:id
 * @method delet
 *
 * @desc delet post
 * ----------------------------------------------
 */
module.exports.deletPosts = async (req, res, next) => {
  try {
    let { id } = req.params;
    console.log('id for delet')
    console.log(id)
    const postitem = await Post.findById(id);
    if (!postitem) {
      return res.status(400).json({ message: "no post found" });
    }
    console.log(postitem)
    if (req.user.IsAdmin || req.user.id == postitem.user.toString()) {
      await removeImage(postitem.image.publicid);
      // await Post.findByIdAndDelet(req.params.id);
      const result = await Post.deleteOne({ _id: req.params.id });


      // to do  delet coment
      await Comment.deleteMany({postid:postitem._id})
      res.status(200).json({ message: "post delet" });
    } else {
      res.status(403).json({ message: "access denied or forbidden" });
    }
  } catch (err) {
    console.log(err);
    next(new Apierr(err.msg, 400));
  }
};
/**
 *-------------------------------------------------
 * @access user him self
 * @route  /api/posts/updatepost/:id

 * @method put
 *
 * @desc update the post 
 * ----------------------------------------------
 */
module.exports.updatePostCtr = async (req, res, next) => {
  try {
    // validation for in put

    // validtion  for post

    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      console.log("no post");
      return res.status(400).json({ message: "no post found" });
    } else {
      console.log("there is apost");
    }

    //  check  if user belong to this user
    if (req.user.id !== post.user.toString()) {
      return res.status(400).json({
        message: " you cant change post",
      });
    } else {
      const updatepost = await Post.findByIdAndUpdate(
        postid,
        {
          $set: {
            tittle: req.body.tittle,
            describtion: req.body.describtion,
            category: req.body.category,
          },
        },
        { new: true }
      ).populate("user", { password: false });

      res.status(200).json(updatepost);
    }

    //update posr
  } catch (err) {
    console.error(err);
    next(new Apierr(err));
  }
};
/**
 *-------------------------------------------------
 * @access user him self
 * @route  /api/posts/updatephoto/:id

 * @method put
 *
 * @desc update image photo
 * ----------------------------------------------
 */
 module.exports.updateimagephoto = async (req, res, next) => {
  try {
    if(!req.file){
      return res.status(400).json({message:"no image upload"})
    }
    // validation for image upload

    // validtion  for post
    // remove old image from cloudinary
    // add new image at cloudinary 
    // add new image at database
    const imagepath= path.join(__dirname,`../images/${req.file.filename}`)

    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      console.log("no post");
      return res.status(400).json({ message: "no post found" });
    }

    //  check  if user belong to this user
    if (req.user.id !== post.user.toString()) {
      return res.status(400).json({
        message: " you cant change post",
      });
    } else {
      console.log('change photo')

      await removeImage(post.image.publicid)
      result= await uploadImage(imagepath)
      const updatepost = await Post.findByIdAndUpdate(
        postid,
        {
          $set: {
            image: {url: result.secure_url,
                     bublicid: result.public_id
                    }}
        },
        { new: true }
      )

      fs.unlinkSync(imagepath)

      res.status(200).json(updatepost);
    }

    //update posr
  } catch (err) {
    console.error(err);
    next(new Apierr(err));
  }
};


/**
 *-------------------------------------------------
 * @access private any user login 
 * @route  /api/posts/like/:id

 * @method put
 *
 * @desc make like and dislike
 * ----------------------------------------------
 */


 module.exports.likeCtr=async(req,res,next)=>{
  try{
    
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      console.log("no post");
      return res.status(400).json({ message: "no post found" });
    }
    console.log(post)

    const like_exits= post.likes.includes(req.user.id)
    console.log(like_exits)
   
    if(like_exits){


      newpost= await Post.findByIdAndUpdate(postid,{
        $pull:{likes:req.user.id}
      },{new:true})
    }else{
       newpost= await Post.findByIdAndUpdate(postid,{
        $push:{likes:req.user.id}
      },{new:true})

    }
     res.status(200).json(newpost)



  } 

  catch (err) {
    console.error(err);
    next(new Apierr(err));
  }
 }
