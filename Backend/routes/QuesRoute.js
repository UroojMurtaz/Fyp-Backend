const express=require("express")
const { createUserQues, getAllQuestions, createans,getQuestion, shopOwnerAns, createShopOwnerQues} = require("../controller/QuesController")
const router=express.Router()
const {isAuthenticatedUser}=require("../Middleware/auth")

router.route("/question/newQues").post(isAuthenticatedUser, createUserQues);
router.route("/question/getQues").get(getAllQuestions);
router.route("/question/getAnswer/:id").get(getQuestion);
router.route("/question/newAns").post(isAuthenticatedUser, createans);
router.route("/question/newAnsShopowner/:id").post(isAuthenticatedUser, shopOwnerAns);
router.route("/question/newQuesShopowner/:id").post(isAuthenticatedUser, createShopOwnerQues);

module.exports=router