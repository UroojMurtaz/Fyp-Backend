const Shop = require("../models/ShopModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const{ cloudinary,uploadSingle}=require('../utils/Cloundinary')
//Add ShopOwner
exports.AddShop = catchAsyncErrors(async (req, res, next) => {
 var userId=await User.findById(req.user.id)
 console.log("file",req.file.path)
 const data=await uploadSingle(req.file.path)
 console.log("data",data)
 var image={
  imageUrl:data.url,
  publicId:data.public_id

}

 const newData={
      profilePhoto: image,
      FullName: req.body.FullName,
      phoneNumber:req.body.phoneNumber,
      CNIC: req.body.CNIC,
      bussinessAddress: req.body.bussinessAddress,
      Shop:"Activated",
 } 

 var user=await User.findByIdAndUpdate(userId,newData,{
  new: true,
  runValidators: true,
  useFindandModify: false,
 })

 var shop=await Shop.create({
  shopOwner:userId,
  shopName: req.body.shopName,
  shopPlace: req.body.shopPlace,


 })

 res.status(200).json({
  success: true,
  user,
  shop
});




});

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  var photo = await User.findById(req.user.id);
  const fileA = [];
  if (req.file === undefined) {
    console.log("hello");
    // photo=photo
    // photo=photo.profilePhoto[0].filePath
    console.log("photo", photo.profilePhoto[0].filePath);
    var file = {
      filePath: photo.profilePhoto[0].filePath,
    };
    fileA.push(file);
    console.log("file", fileA);
  } else {
    file = {
      fileName: req.file.originalName,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    };
    fileA.push(file);
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    profilePhoto: fileA,
    FullName: req.body.FullName,
    Country: req.body.Country,
    Address: req.body.Address,
    phoneNumber: req.body.phoneNumber,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Update Subcategory
exports.total = catchAsyncErrors(async (req, res, next) => {
  const id=req.params.id
   console.log(req.params.id)
    
    const categories = await Category.find();
  
    const products = await Product.find().populate(
      "category","categoryName"
    );
    const product=[]
    products.filter((e) => {
      if (e.user.toString() === id.toString()){
         product.push(e) 
      }
    });
  
    // console.log(product)
    
    const Count = [];
    var count = 0;
    if (product.length === 0) {
      categories.forEach((e) =>{
        Count.push({"id":e._id.toString(),"count":count});
      })
    } else {
      console.log("hello")
      categories.forEach((i)=>{
        product.filter((e)=>{
          if(i._id.toString()===e.category._id.toString()){
            count = count + 1;
          }
          // console.log(i)
        })
        Count.push({"name":i.categoryName,"count":count});
        count = 0;
      })
  
    }
    res.status(201).json({
      success: true,
      Count
    });
  
    
  });

