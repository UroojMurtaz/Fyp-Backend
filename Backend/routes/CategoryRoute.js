const express=require("express");
const { AddCategory, getAllCategories,getCategories, AddImage, getSingleCategory, updateCategory, categoryWiseProduct } = require("../controller/CategoryController");
const router=express.Router();
const { isAuthenticatedUser} = require("../Middleware/auth");
const { upload }= require("../utils/filehelper")


router.route('/category/addCategory').post(upload.single("file"),AddCategory)
router.route('/category/categories').get(getAllCategories)
router.route('/category/Allcategories').get(getCategories)
router.route('/category/:id').get(getSingleCategory)
router.route('/category/:id').put(upload.single("file"),updateCategory)
router.route('/categoryWiseProduct/:id').get(categoryWiseProduct)


module.exports = router;
