const Videos = require("../models/VideoModel")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors=require("../Middleware/catchAsyncErrors")
const {cloudinary}=require('../utils/Cloundinary')


  //Shop owner
  exports.postVideo = catchAsyncErrors(async (req, res, next) => {
    console.log("hello");
    
    const files = req.files;
    for(const file of files){
      if(file.mimetype==="image/jpg" || file.mimetype==='image/png' 
      || file.mimetype==='image/jpeg'){
        const { path } = file;
        const data=await cloudinary.uploader.upload(path)
        var image={
          imageUrl:data.url,
          publicId:data.public_id
        }
        console.log(image)
      console.log(path)
        console.log("Image")
      }

      if(file.mimetype==="video/mp4"){
          const { path } = file;
        console.log(path)
        console.log("Video")
     cloudinary.uploader.upload(path,
            {
                resource_type: "video",
                
              },
            
            (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            else{
              var video={
                vpublicId:result.public_id,
                videoUrl:result.url
              }
            }
            console.log("video",video)
            const {
              title,
              Description,
              BrandName,
              user
          } = req.body;
          const category = Videos.create({
            user,
            title,
            Description,
            video,
            image,
            BrandName
          });
        
          res.status(201).json({
            success: true,
            message:"Video Post successfully"
            });
        }
        );
        
      }

    }
  });


exports.addVideos = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        BrandName,
        Description,
        videoId,
        coverPhoto
    } = req.body;
    const videos = await Videos.create({
        title,
        BrandName,
        Description,
        videoId,
        coverPhoto
    });
  
    res.status(200).json({
      success: true,
      videos,
    });
  });


  exports.ShopVideo = catchAsyncErrors(async (req, res, next) => {
    console.log("ur file is:");
    const title = req.body.title
    const BrandName = req.body.BrandName
    const Description = req.body.Description
    const coverPhoto = req.body.coverPhoto
    const publicId= req.body.publicId
    const imageUrl = req.body.imageUrl
    const image={
      publicId,
      imageUrl
    }
    console.log(image)
    const category = await Videos.create({
      title,
      BrandName,
      Description,
      coverPhoto,
      image
    });
  
    res.status(201).json({
      success: true,
      category,
      });
    });
exports.getVideos = catchAsyncErrors(async (req, res, next) => {
    const videos = await Videos.find();
  
    res.send(videos);
  });

  //Post Video
exports.PostVideo = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");
    console.log(req.file.mimetype)
      cloudinary.uploader.upload(req.file.path,
          {
              resource_type: "video",
              
            },
          
          (err, result) => {
          if (err) {
              console.log(err);
              return res.status(500).send(err);
          }
          else{
            console.log(result)
            var image={
              imageUrl:result.url,
              publicId:result.public_id
            }
            const { categoryName, categoryStatus } = req.body;
 

  const category = Category.create({
    categoryName,
    categoryStatus,
    image
  });
  res.status(201).json({
    success: true,
    category,
  });

          }
      }
      );
});