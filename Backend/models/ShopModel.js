const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopPlace: {
    type: String,
    required: true,
  },
 
  createAt: {
    type: Date,
    default: Date.now()
}
});


      

module.exports = mongoose.model("Shop", shopSchema);
