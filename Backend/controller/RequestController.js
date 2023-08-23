const Request = require("../models/RequestModel");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/ErrorHandler");

// Add to wishlist
exports.addRequest = catchAsyncErrors(async (req, res, next) => {
    const {
        RequestCategory,
        RequestSubCategory,
        Description,
        RequestBy
    } = req.body;
    const request = await Request.create({
        RequestCategory,
        RequestSubCategory,
        RequestBy,
        Description
    });

    res.status(200).json({
        success: true,
        request,
    });
});


// get All Requests
exports.getAllRequest = catchAsyncErrors(async (req, res, next) => {
    console.log("Hello")
    const Requests = await Request.find().populate("RequestBy").sort({ $natural: -1 });

    res.status(200).json({
        success: true,
        Requests,
    });
});


//Get Shop Owner Requests
exports.getRequest = catchAsyncErrors(async (req, res, next) => {
    console.log("Hello Gee")
    const request = await Request.find().populate("RequestBy").sort({ $natural: -1 });
    // console.log(request)

    const Requests=[]
    request.map((e)=>{
        if (e.RequestBy._id.toString() === req.params.id.toString()) {
            Requests.push(e)
          }
        // console.log("hello")
    })

    res.status(200).json({
        success: true,
        Requests,
    });
});


// get All Requests
exports.adminReply = catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.id)
    const AdminReply={
        Reply:req.body.Reply,
        ReplyDate:Date.now()
    }
    const newData={
        Status: req.body.Status,
        AdminReply: AdminReply,
   } 
  
   var Requests=await Request.findByIdAndUpdate(req.params.id,newData,{
    new: true,
    runValidators: true,
    useFindandModify: false,
   })
  

    res.status(200).json({
        success: true,
        Requests,
    });
});

