const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
      // maxLength: [20, "Product name not exceed than 20 characters"]
    },
    description: {
      type: String,
      // required: [true, "Please add a description of your product"],
      // maxlength: [4000, "Description is can not exceed than 4000 characters"]
    },
    price: {
      type: Number,
      // required: [true, "Please add a price for your product"],
      // maxLength: [8, "Price can not exceed than 8 characters"],
    },
    offerPrice: {
      type: Number,
      // maxLength: [4, "Discount price can not exceed than 4 characters"],
    },
    ActualPrice: {
      type: Number,
      // maxLength: [8, "Price can not exceed than 8 characters"],
    },

    images: [
      {
        publicId: {
          type: String,
        },
        imageUrl: {
          type: String,
          required: false,
        },
      },
    ],

    shade:[{
      _id:{
        type:Number
      },
      name:{
        type:String
      },
      shade:{
        type:String
      },
      quantity:{
        type:Number
      },

    }],
    Skincolor: {
      type: String,
      default:"All Skin Type"
      // required: [true, "Please add the skin tone"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      // required: true,
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
      // required: true,
    },
    brand: {
      type: String,
      // required: [true, "Please add a brand of your product"],
    },
    Stock: {
      type: Number,
      // required: [true, "Please add some stoke for your product"],
      // maxLength: [3, "Stock can not exceed than 3 characters"],
    },
    status: {
      type: String,
      default: "InStock",
    },
    SKU: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
