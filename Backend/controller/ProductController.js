const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Features = require("../utils/Features");
const {cloudinary,cloudinaryImageUploadMethod }=require('../utils/Cloundinary')

// Post Product --Shopowner
exports.createProduct = async (req, res, next) => {
  try {
    let filesArray = [];
    const files = req.files;
    console.log(files)
    for(const file of files){
      const { path } = file;
      console.log(path)
     var data=await cloudinaryImageUploadMethod(path);
    //  console.log(data.url)
     var image={
      imageUrl:data.url,
      publicId:data.public_id
    }
    console.log(image)
    filesArray.push(image);
    }
    console.log("shade",req.body.shade)
    const shade=req.body.shade
   const a=JSON.parse(shade)
   console.log(a)
    
    // // shade.map((e)=>{
    // //   console.log(e.name)
    // // })
    // var my_obj=req.body.shade
    // var my = JSON.stringify(my_obj);
    // console.log(my)
    
    const multipleFiles = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      Skincolor: req.body.Skincolor,
      category: req.body.category,
      brand: req.body.brand,
      Stock: req.body.Stock,
      subCategory: req.body.subCategory,
      SKU: req.body.SKU,
      ActualPrice: req.body.ActualPrice,
      user: req.body.user,
      images: filesArray,
      shade:a
    });

    await multipleFiles.save();

    res.status(201).json({
      success:true,
      multipleFiles

    });
  } catch (error) {
    res.json({
      success:false,
      message:error.message
    })
  }
};

// GET All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  console.log("hello ")
  const products = await Product.find().populate(
    "category","categoryName"
  ).populate(
    "subCategory","subcategoryName"
  );
  console.log(products)
  res.status(201).json({
    success: true,
    products,
  });
});

exports.getShopOwnerProducts = catchAsyncErrors(async (req, res) => {
    console.log("Get All Products ShopOwner")
  const id = req.params.id;
  // console.log(req.user._id)

  const products = await Product.find().populate(
    "category","categoryName"
  );
   const product=[]
  products.filter((e) => {
    if (e.user.toString() === id.toString()){
       product.push(e)
        
    }
  });
  if(product){
    res.json({
        success:true,
        product
    })
  }
  else{
    res.json({
        success:false,
        message:"no product found"
    })
}
//   console.log(product);
});

// UPDATE Product --Shopowner
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product is not found with this id", 404));
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      Skincolor: req.body.Skincolor,
      category: req.body.category,
      brand: req.body.brand,
      Stock: req.body.Stock,
      subCategory: req.body.subCategory,
      SKU: req.body.SKU,
      ActualPrice: req.body.ActualPrice,
      // user:req.user.id,
      // images: filesArray
    },
    {
      new: true,
      runValidators: true,
      useUnified: false,
    }
  );
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product --Shopowner
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  console.log("Deelete");
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product delete",
  });
});

//Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product is not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev) => rev.user === req.user._id);

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user === req.user._id)
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get All reviews of a single product
exports.getSingleProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product is not found with this id", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review --Admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found with this id", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});


// GET All Products
exports.getAll = catchAsyncErrors(async (req, res) => {
  console.log("hello ")
  const products = await Product.find()
  products.map((e)=>{
    
    (e.shade).map((i)=>{
      // console.log(i)
      if(i.name==="Glow Pink"){
        console.log(e)
      }
    })
  
  })
  // console.log(products)
  res.status(201).json({
    success: true,
    products,
  });
});