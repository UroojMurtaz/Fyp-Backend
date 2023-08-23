const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Please enter Category name"],
    // unique: true,
  },
  categoryStatus: {
    type: String,
    required: [true, "Please Select Category Status"],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
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
  
});

module.exports = mongoose.model("Category", categorySchema);
