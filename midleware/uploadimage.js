const path =require('path')
const multer =require('multer')
const { Apierr } = require('../errorhandeler/apierror')



const storage= multer.diskStorage({
    destination:(req,File, cb)=>{
      cb(null,path.join(__dirname,'../images'))
    },
    filename:(req,file,cb)=>{

        
      
      cb(null ,  '-'+   new Date().toISOString ().replace(/:/g,'-') + file.originalname)
    }
  })
  
const upload=multer({
    storage:storage,
    limits: {
      fileSize: 1024*1024*5 //mean 5 mb
  },
  fileFilter:   (req, file, cb) => {
    if ( file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
      console.log('error in phote upload')
        return cb( {message:'error in format emage'});
    }}
  
  
  }  ).single('image')

  // if there is an error in type of file and size i make midle ware to take error 
  //

  const chekimageErr=(err,req,res,next)=>{
    console.log('check image')
    if(err){
      console.log('error in image')
      console.log(err)
        next(new Apierr("err in image from server",400))
    }
    next()


}

module.exports={
  upload,chekimageErr
}

  