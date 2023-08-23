const express=require("express");
const {addToWishlist, getWishlistData, removeWishlistData, addToCart, getCartData, removeCartData, updateCart} = require("../controller/WishCartController");
const { isAuthenticatedUser } = require("../Middleware/auth");
const router=express.Router();

router.route('/wishlist/getwishlist').get(isAuthenticatedUser, getWishlistData);

router.route('/wishlist/addToWishlist').post(isAuthenticatedUser, addToWishlist);

router.route('/wishlist/removewishlist/:id').delete(isAuthenticatedUser, removeWishlistData);

router.route('/cart/addToCart').post(isAuthenticatedUser, addToCart);

router.route('/cart/getCart').get(isAuthenticatedUser, getCartData);

router.route('/cart/removeCart/:id').delete(isAuthenticatedUser, removeCartData);

router.route("/cart/updateCart/:id").put(isAuthenticatedUser, updateCart);

module.exports=router
