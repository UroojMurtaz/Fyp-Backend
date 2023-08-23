const express=require("express")
const { addVideos, getVideos, ShopVideo,postVideo} = require("../controller/VideoController")
const router=express.Router()
const { upload }= require("../utils/filehelper")
const { Videoupload }= require("../utils/VideoHelper")

router.route("/video/newVideo").post(addVideos);
router.route("/video/getVideo").get(getVideos);
router.route('/video/shopvideo').post(upload.single("file"),ShopVideo)


router.route('/video/shopOnwer/postVideo').post(upload.array("files"),postVideo)

module.exports=router