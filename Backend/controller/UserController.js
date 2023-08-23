const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

//Register User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

//Register ShopOwner
exports.createShopOwner = catchAsyncErrors(async (req, res, next) => {
  // const { email, newpassword,role } = req.body;

  const user = await User.create({
    email: req.body.registerEmail,
    password:req.body.newpassword,
    role: req.body.role,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

//Add ShopOwner
exports.AddShopOwner = catchAsyncErrors(async (req, res, next) => {
  try {
    const fileA=[]
    const file = {
      fileName: req.file.originalName,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    };
    fileA.push(file)

  
   
    const ShopOwner = await User.create({
      FullName: req.body.FullName,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      Address: req.body.Address,
      Country: req.body.Country,
      email: req.body.email,
      password: req.body.password,
      profilePhoto: fileA,
      role: req.body.role,
      Status:req.body.Status
      // // user:req.user.id,
      // images: filesArray
    });
    
    await ShopOwner.save();

      // res.status(201).send(multipleFiles);
      res.json({
        success:true,
        ShopOwner
      })

  } catch (error) {
    res.json({
      success:false,
      message:error.message
    })
  }
});

//Login User
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
  const {email, password} = req.body;

  if(!email || !password){
      return next(new ErrorHandler("Please Enter your Email & Password", 400));
  }
  const user = await User.findOne({email}).select('+password');

  if(!user){
      return next(new ErrorHandler("No User with this email or password was found",401));
  }

  const isPasswordMatched = await user.comparePassword(password);

if (!isPasswordMatched) {
  return next(
    new ErrorHandler("User is not find with this email & password", 401)
  );
}

sendToken(user, 201, res);
});

//Logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

//forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //get ResetPassword Token
  var resetToken = user.getResetToken();
   
  console.log("Before",resetToken)
  await user.save({
    validateBeforeSave: false,
  });
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/users/password/reset/${resetToken}`;

  resetToken = user.resetPasswordToken;

  const resetPasswordUrl = `${process.env.FRONTEND}/users/password/reset/${resetToken}`;
  console.log("After",resetToken)

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  try {
    await sendMail({
      email: user.email,
      subject: `BareBeauty Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      user,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // create Token hash

  // const resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");

  const resetPasswordToken=req.params.token

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password url is invalid or has been expired")
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password is not matched with the new password")
    );
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get User detail
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password is not matched with the new password", 400)
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  // sendToken(user, 200, res);
  res.status(201).json({
    success:true,
    message:"Password updated Sucessfully"
  })
});

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  var photo=await User.findById(req.user.id)
  const fileA=[]
  if(req.file===undefined){
    console.log("hello")
    // photo=photo
    // photo=photo.profilePhoto[0].filePath
    console.log("photo",photo.profilePhoto[0].filePath)
    var file={
      filePath:photo.profilePhoto[0].filePath
    }
    fileA.push(file)
    console.log("file",fileA)
  }else{
     file = {
      fileName: req.file.originalName,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    };
    fileA.push(file)
  }
  
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    profilePhoto: fileA,
    FullName:req.body.FullName,
    Country:req.body.Country,
    Address:req.body.Address,
    phoneNumber:req.body.phoneNumber

  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  res.status(200).json({
    success: true,
    user
  });
});

// exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
//   const fileA = [];
//   if (!req.files) {
//     // File does not exist.
//     console.log("No file");
//   } else {
//     // File exists.
//     console.log("File exists");
//   }
  // if (!req.files) {
  //   console.log("No file");
  //   var userId = await User.findById(req.user.id);
  //   userId = userId.profilePhoto[0].filePath;
  //   console.log("userId", userId);
  //   var file = {
  //     // fileName: "" ,
  //     filePath: userId,
  //     // fileType: userId.profilePhoto[0].fileType ,
  //   };
  //   // console.log(file);
  //   fileA.push(file);
    // console.log("file", fileA);
//   }else{
//     file = {
//       filePath: req.file.path,
//     };
//     fileA.push(file);
//     console.log("file when upload", fileA);
  
//   }

  
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     profilePhoto: fileA,
//   };
//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindandModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// Get All users ---Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get All users ---Admin
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const Role=req.query.role
  console.log("role",Role)
   const users=await User.find({role:Role}).sort({ $natural: -1 });
   res.status(200).json({
    success: true,
    users,
  });
  // const users = await User.find(req.params.role);

  // res.status(200).json({
  //   success: true,
  //   users,
  // });
});

// Get Single User Details ---Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+role");

  if (!user) {
    return next(new ErrorHandler("User is not found with this id", 400));
  }

  if (user.role === "admin") {
    res.status(200).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User ---Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User is not found with this id"));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Delete Account ---User
exports.deleteAccount = catchAsyncErrors(async(req,res,next) =>{

  const user = await User.findById(req.params.id);

   if(!user){
       return next(new ErrorHandler("User is not found with this id"));
   }

   await user.remove();

   res.status(200).json({
       success: true,
       message:"User deleted successfully"
   })
});

// Activate Or Deactivate Account ---Admin
exports.UpdateAccountStatus = catchAsyncErrors(async(req,res,next) =>{

  let user = await User.findById(req.params.id);

   if(!user){
       return next(new ErrorHandler("User is not found with this id"));
   }

   user=await User.findByIdAndUpdate(user,{
    Status:req.body.Status
   },{
    new:true,
    runValidators:true,
    useUnified:false
   })

   res.status(200).json({
       success: true,
       user
   })
});

//Get Count
exports.getCount=catchAsyncErrors(async(req,res,next)=>{
  // const role=req.query.role
  // console.log(role)
   let Totaluser=await User.countDocuments({role:"user"})
   let TotalShopOwners=await User.countDocuments({role:"ShopOwner"})
   let activate=await User.countDocuments({role:"ShopOwner",Status:"Activated"})
   let deactivate=await User.countDocuments({role:"ShopOwner",Status:"Deactivated"})
   res.json({
    success:true,
    Totaluser,
    TotalShopOwners,
    activate,
    deactivate
   })
})

