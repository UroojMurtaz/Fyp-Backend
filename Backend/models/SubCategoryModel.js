const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  Category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategoryName: {
    type: String,
    required: true,
    unique: true,
  },
  subcategoryStatus: {
    type: String,
    required: true,
  },
  image:{
    publicId: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
 
  createAt: {
    type: Date,
    default: Date.now()
}
});


      

module.exports = mongoose.model("SubCategory", subcategorySchema);
