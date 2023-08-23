const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    
    userOrderedPlaced: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    trackigID: {
      type: String,
      required: true,
    },
    shippingInfo: {
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        pinCode: {
          type: Number,
        },
        phoneNo: {
          type: Number,
        },
      },
      paymentInfo: {
        id: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
      },
      paidAt: {
        type: Date,
        required: true,
      },
      shippingPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      year: {
        type: String,
      },
      AdminStatus: {
        type: String,
      },
      orderStatus: {
        type: String,
        required: true,
        default: "Processing",
      },
      deliveredAt: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
   

});

module.exports = mongoose.model("OrderItem", orderItemSchema);