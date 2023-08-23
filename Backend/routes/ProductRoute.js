const express = require("express")
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    createProductReview,
    getSingleProductReviews,
    deleteReview,
    getShopOwnerProducts,
    getAll
} = require("../controller/ProductController")
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth")
const { upload }= require("../utils/filehelper")

router.route('/product/new').post(upload.array('files'),createProduct)

router.route('/product/products').get(getAllProducts)
router.route('/products/ShopOwner/:id').get(isAuthenticatedUser,authorizeRoles("ShopOwner"),getShopOwnerProducts)

router.route('/product/review').post(isAuthenticatedUser, createProductReview)

router.route('/reviews').get(getSingleProductReviews)

router.route("/reviews").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview)
router.route("/p").get(getAll)

router
    .route('/product/:id')
    .put(updateProduct)
    .delete(isAuthenticatedUser,deleteProduct)
    .get(getSingleProduct)

module.exports = router
