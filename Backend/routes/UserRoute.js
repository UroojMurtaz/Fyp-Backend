const express=require("express");
const { createUser, loginUser, logoutUser, forgetPassword,
    resetPassword, userDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, 
    deleteUser,AddShopOwner,deleteAccount, getUsers, UpdateAccountStatus, getCount, createShopOwner} = require("../controller/UserController");
const router=express.Router();
const { isAuthenticatedUser,authorizeRoles } = require("../Middleware/auth");
const { upload }= require("../utils/filehelper")

router.route('/user/register').post(createUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/forgetPassword').post(forgetPassword);
router.route('/user/resetPassword/:token').put(resetPassword);
router.route('/user/deleteAccount/:id').delete(isAuthenticatedUser, deleteAccount)

router.route('/shopowner/register').post(createShopOwner)
router.route('/admin/addShopowner').post(upload.single('file'),isAuthenticatedUser,AddShopOwner)

router.route('/me').get(isAuthenticatedUser, userDetails)

router.route('/me/update').put(isAuthenticatedUser, updatePassword)

router.route('/me/update/info').put(upload.single('file'),isAuthenticatedUser, updateProfile)

router.route('/admin/updateStatus/:id').put(UpdateAccountStatus)

// router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("admin"), getAllUsers)

router.route('/admin/users').get(getAllUsers)
router.route('/admin/user').get(getUsers)
router.route('/user/deleteAccount/:id').get(deleteAccount)

router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles("admin"), getSingleUser)

router.route('/admin/user/:id').delete(isAuthenticatedUser, deleteUser)
router.route('/admin/count').get(getCount)
module.exports = router;
