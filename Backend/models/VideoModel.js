const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
    title:{
        type: String,
       required: true
    },
    Description:{
        type: String,
        required: true
    },
   
    BrandName:{
      type: String,
      required: true
  },
    image:{
      publicId:{
        type: String
      },
       
        imageUrl: {
          type: String,
          required: false,
        },
      },
      video:{
        vpublicId:{
          type: String
        },
         
          videoUrl: {
            type: String,
            required: false,
          },
        },
});

module.exports = mongoose.model("Videos", videoSchema);
