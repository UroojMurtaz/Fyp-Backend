const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // console.log("hi")
  let { token } = req.cookies;
  // console.log("token",req.cookies)
  // token=req.get("Token")
  token = req.get("Token")
  console.log("Token:", token)

  if (!token) {
    token = req.get("Token")
    if (!token) {
      return next(new ErrorHandler("Please Login for access this resource"));
    }

  }



  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // console.log("decoded:",decodedData)
  req.user = await User.findById(decodedData.id);
  console.log(req.user._id)

  next();
});

//Admin roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`${req.user.role} cant access this resource`))

    }
    next()

  }
}