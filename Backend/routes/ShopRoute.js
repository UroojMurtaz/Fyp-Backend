const express=require("express");
const { AddShop } = require("../controller/ShopController");
const router=express.Router();
const { isAuthenticatedUser} = require("../Middleware/auth");
const { upload }= require("../utils/filehelper")

router.route('/shop/addShop').post(upload.single('file'),isAuthenticatedUser,AddShop)


module.exports = router;
