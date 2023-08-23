const Question = require("../models/QuesModel")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors=require("../Middleware/catchAsyncErrors")
const Features = require("../utils/Features")



// get ques
exports.getAllQuestions = catchAsyncErrors(async (req, res) => {
    const questions = await Question.find().sort({ $natural: -1 });
  
    res.status(200).json({
        success: true,
        questions,
      });

})

exports.getQuestion = catchAsyncErrors(async (req, res) => {
    const questions = await Question.findById(req.params.id)
  
    res.status(200).json({
        success: true,
        questions,
      });

})




// ques
exports.createUserQues = catchAsyncErrors(async (req, res, next) => {
    const { userQues} = req.body;

    const question = await Question.create({
        userQues,
        user: req.user._id,
        name: req.user.name,
    });
  
    res.status(200).json({
      success: true,
      question,
    });
});

// answer
exports.createans = catchAsyncErrors(async (req, res, next) => {
    const { userAnswer, quesId } = req.body;

    const Ans = {
        user: req.user._id,
        name: req.user.name,
        userAnswer
    };

    const question = await Question.findById(quesId);
        question.Answer.push(Ans);
    

  

    await question.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

exports.shopOwnerAns = catchAsyncErrors(async (req, res, next) => {
    const u=req.params.id
    const { userAnswer, quesId,userImg} = req.body;

    const Ans = {
        user:u,
        name: "ShopOwner",
        userAnswer,
        userImg
    };

    const question = await Question.findById(quesId);
        question.Answer.push(Ans);

    await question.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// ques
exports.createShopOwnerQues = catchAsyncErrors(async (req, res, next) => {
    const { userQues,userImg} = req.body;
    const u=req.params.id

    const question = await Question.create({
        userQues,
        user: u,
        name: "ShopOwner",
        userImg
    });
  
    res.status(200).json({
      success: true,
      question,
    });
});


