const express = require("express");
const { addRequest ,getAllRequest,adminReply, getRequest} = require("../controller/RequestController");
const router = express.Router();
const { isAuthenticatedUser } = require("../Middleware/auth");
const { upload } = require("../utils/filehelper")

router.route("/request/add").post(isAuthenticatedUser, addRequest);
router.route("/request/All").get(getAllRequest);
router.route("/request/adminReply/:id").put(adminReply);
router.route("/request/getShopOwnerRequests/:id").get(getRequest);




module.exports = router;
