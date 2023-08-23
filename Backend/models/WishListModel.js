const mongoose = require("mongoose");

const wishlishSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter your product name"],
      },
      productPrice: {
        type: Number,
        required: [true, "Please enter your product price"],
      },
      productImage: {
        type: String,
        required: [true, "Please enter your product image"],
      },
      userId: {
        type: String,
        required: [true, "Please enter your user id"],
      },
      productId:{
        type: String,
        required: [true, "Please enter your user id"],
      }
});

module.exports = mongoose.model("Wishlist", wishlishSchema);
