const express=require("express");
const { AddSubCategory, getAllSubCategories, getAllCategroySubCategories, updateSubCategory } = require("../controller/SubCategoryController");

const router=express.Router();
const { isAuthenticatedUser} = require("../Middleware/auth");
const { upload }= require("../utils/filehelper")

router.route('/subcategory/add').post(upload.single("file"),AddSubCategory)
router.route('/subcategory/subcategories/:id').get(getAllCategroySubCategories)
router.route('/subcategory/Allsubcategories').get(getAllSubCategories)
router.route('/subcategory/:id').put(upload.single("file"),updateSubCategory)


module.exports = router;
