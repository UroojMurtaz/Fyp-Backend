const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const SubCategory = require("../models/SubCategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const {cloudinary}=require('../utils/Cloundinary')

//Add Category
exports.AddCategory = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");
  // try {
    console.log(req.file)
    const data=await cloudinary.uploader.upload(req.file.path)
    const { categoryName, categoryStatus } = req.body;
 
  var image={
    imageUrl:data.url,
    publicId:data.public_id
  }
  const category = await Category.create({
    categoryName,
    categoryStatus,
    image
  });

  res.status(201).json({
    success: true,
    category,
  });
    
  
});
//Get Category
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");
  const categories = await Category.find();
  const Subcategories = await SubCategory.find();
 
  const Count = [];
  var count = 0;
  if (Subcategories.length === 0) {
    categories.forEach((e) =>{
      Count.push({"id":e._id.toString(),"count":count});
    })
  } else {
    categories.forEach((i) => {
      Subcategories.filter((e) => {
        if (i._id.toString() === e.Category.toString()) {
          count = count + 1;
          console.log("Hello", count);
        }
      });

      Count.push({"id":i._id.toString(),"count":count});
      count = 0;
    });
  }

let categorie = [];

for(let i=0; i<categories.length; i++) {
  categorie.push({
   ...categories[i], 
   ...(Count.find((itmInner) => itmInner.id === categories[i]._id.toString()))}
  );
}

console.log(categorie);


  res.status(200).json({
    success: true,
    // categories,
    // Count,
    categorie
  });
});

//Get Category
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

//Get Single Category
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).json({
    success: true,
    category,
  });
});


//Update Subcategory
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  console.log("Edit")
  try {
    let category = await Category.findById(req.params.id);
    console.log(category)
    // Delete image from cloudinary
    // Upload image to cloudinary
    let result;
    if (req.file) {
      await cloudinary.uploader.destroy(category.image.publicId);
      result = await cloudinary.uploader.upload(req.file.path);
     var image={
        imageUrl:result.url,
        publicId:result.public_id ,

      }
    }else{
      var image={
        imageUrl:category.image.imageUrl,
        publicId:category.image.publicId,
      }
    }

    console.log(image)
    const data = {
      categoryName: req.body.categoryName || category.categoryName,
      categoryStatus: req.body.categoryStatus || category.categoryStatus,
      image:image

    };
    category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      success: true,
      category,
    });20
  } catch (err) {
    console.log(err);
  }
});

//Update Subcategory
exports.categoryWiseProduct = catchAsyncErrors(async (req, res, next) => {
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
    // categories.forEach((i) => {
    //  product.filter((e) => {
    //     if (i._id.toString() === e.category.toString()) {
    //       count = count + 1;
    //       console.log("Hello", count);
    //     }
    //   });

    //   Count.push({"id":i._id.toString(),"count":count});
    //   count = 0;
    // });

  }
  res.status(201).json({
    success: true,
    Count
  });

  
});

