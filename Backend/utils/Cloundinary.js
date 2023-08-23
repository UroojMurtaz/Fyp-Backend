const cloudinary=require("cloudinary").v2

cloudinary.config({
    cloud_name:"dhmolukeg",
    api_key:"659896932697738",
    api_secret:"xlA4CnypcOM48Gku7vM2e3jn18U",
    // secure: true
})
const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
             url:res.url,
             public_id:res.public_id
            }) 
          }
        ) 
    })
  }

const uploadSingle=async(file)=>{
  const data=await cloudinary.uploader.upload(file)
  return {
    url:data.url,
    public_id:data.public_id
   }
}
 
module.exports={cloudinary,cloudinaryImageUploadMethod,uploadSingle}



// removeFromCloudinary = async (public_id) => {
//     await cloudinary.uploader.destroy(public_id, function (error, result) {
//         console.log(result, error)
//     })
// }

// module.exports = { uploadToCloudinary, removeFromCloudinary }