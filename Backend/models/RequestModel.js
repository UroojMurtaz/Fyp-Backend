const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  RequestBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  RequestCategory: {
    type: String,
    required: true,
   
  },
  RequestSubCategory: {
    type: String,
    required: true,
   
  },
  Description: {
    type: String,
  },
  Status: {
    type: String,
    default:"null"
  },
  AdminReply: {
    Reply: {
      type: String,
      default:"null"
    },
    ReplyDate: {
      type: Date,
    },
  },
  RequestDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Request", requestSchema);
