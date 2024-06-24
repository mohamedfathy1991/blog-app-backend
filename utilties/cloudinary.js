const  cloudinary=require('cloudinary').v2
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
  });


//   uplad image from req.file.filename


const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result;
    } catch (error) {
      new Error(' error in cloudinary pls check')
      console.error(error);
    }
};

// remove old image from cloudinary after updated it



const removeImage = async (imagepublicid) => {


    try {
      // Upload the image take bublicid
      const result = await cloudinary.uploader.destroy(imagepublicid);
      console.log(result);
      return result
    } catch (error) {
      console.error(error);
    }
};


const removeMultipleImage = async (imagepublicids) => {


  try {
    // delet   multiple  image imagepublicids is array
  
    const result = await cloudinary.v2.api.delete_resources(imagepublicids)
    console.log(result);
    return result
  } catch (error) {
    console.error(error);
  }
};


module.exports={
    uploadImage,removeImage,
    removeMultipleImage
}