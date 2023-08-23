const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type: 'String',
        minlength: [3, "Please enter a name atleast 3 characters"],
        maxlength: [15, "Name can not big than 15 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Please enter your password!"],
        minlength: [8, "Password should be greater than 8 characters"],
        select: false,
      },
      Status:{
        type:String,
        default:"Activated"
      },
      role: {
        type: String,
        default: "user",
      },
      Shop:{
        type:String,
        default:"Deactivated"
      },
      profilePhoto: {
        publicId: {
          type: String,
        },
        imageUrl: {
          type: String,
          required: false,
        },
      },
      CNICphoto: {
        publicId: {
          type: String,
        },
        imageUrl: {
          type: String,
          required: false,
        },
      },
  
      FullName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      CNIC: {
        type: String,
      },
      bussinessAddress: {
        streetAddress: {
          type: String,
        },
        HouseNo: {
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
        // location: {
        //   type: String,
        // },
      },
     
      resetPasswordToken: String,
      resetPasswordTime: Date,

});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//forget password
userSchema.methods.getResetToken = function (){
  //generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //hashing and adding the resetPass token to the schema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
  this.resetPasswordTime = Date.now()+ 15 * 60 * 1000;
  return resetToken;
};


module.exports = mongoose.model("User", userSchema);