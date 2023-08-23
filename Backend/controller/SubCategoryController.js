const SubCategory = require("../models/SubCategoryModel");
const Category = require("../models/CategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const cloudinary=require("cloudinary").v2
// const cloudinary=require('../utils/Cloundinary')
const{uploadSingle}=require('../utils/Cloundinary')

//Add Category
exports.AddSubCategory = catchAsyncErrors(async (req, res, next) => {
 var cat=req.body.Category
 console.log(cat)
 var Cat=await Category.findById(cat)
//  console.log(Cat)

 if(!Cat){
  return next(new ErrorHandler("Category does not exist"));
 }

 var Subcategories = await SubCategory.find()
 let x = new Boolean(true);
 Subcategories.filter((e)=>{
  if(e.subcategoryName===req.body.subcategoryName){
    x=false;
  }
 })

 if(!x){
  return next(new ErrorHandler("Category Already exist"));
 }

 const data=await cloudinary.uploader.upload(req.file.path)
 console.log("data,",data)
 var image={
  imageUrl:data.url,
  publicId:data.public_id
}
  const newSubCategory = await SubCategory.create({
    Category: req.body.Category,
    subcategoryName: req.body.subcategoryName,
    subcategoryStatus: req.body.subcategoryStatus,
    image:image
  });
    res.status(201).json({
      success: true,
      newSubCategory
    });
});
//Get Category
exports.getAllCategroySubCategories = catchAsyncErrors(async (req, res, next) => {
    console.log("hello")
    const id=req.params.id;
    var Subcategories = await SubCategory.find().populate(
      "Category","categoryName"
    );


   const SubCat=[]
   Subcategories.filter((e) => {
    if (e.Category._id.toString() === id.toString()){
      SubCat.push(e)
        
    }
  });
  if(SubCat){
    res.json({
        success:true,
        SubCat
    })
  }
  else{
    res.json({
        success:false,
        message:"no Category found"
    })
}
  
    // res.status(200).json({
    //   success: true,
    //   Subcategories,
    // });
  });

  //Get Category
exports.getAllSubCategories = catchAsyncErrors(async (req, res, next) => {
  console.log("hello")
  var Subcategories = await SubCategory.find().populate(
    "Category","categoryName"
  );

  res.status(200).json({
    success: true,
    Subcategories,
  });
});

//Update Subcategory
exports.updateSubCategory = catchAsyncErrors(async (req, res, next) => {
  console.log("Edit")
  try {
    let subcategory = await SubCategory.findById(req.params.id);
    console.log(subcategory)
    // Delete image from cloudinary
    // Upload image to cloudinary
    let result;
    if (req.file) {
      await cloudinary.uploader.destroy(subcategory.image.publicId);
      result = await cloudinary.uploader.upload(req.file.path);
     var image={
        imageUrl:result.url,
        publicId:result.public_id ,
      }
    }else{
      var image={
        imageUrl:subcategory.image.imageUrl,
        publicId:subcategory.image.publicId,
      }
    }

    console.log(image)
    const data = {
      Category:req.body.Category || subcategory.Category,
      subcategoryName: req.body.subcategoryName || subcategory.subcategoryName,
      subcategoryStatus: req.body.subcategoryStatus || subcategory.subcategoryStatus,
      // imageUrl:result?.url || subcategory.imageUrl,
      // publicId:result?.public_id || subcategory.public_id,
      image:image

    };
    subcategory = await SubCategory.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      success: true,
      subcategory,
    });
  } catch (err) {
    console.log(err);
  }
});

