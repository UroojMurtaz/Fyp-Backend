const multer  = require('multer')

const storage=multer.diskStorage({
    destination:(req,image,cb)=>{
        cb(null,'Backend/uploads')
    },
    imagename:(req,image,cb)=>{
        cb(null, new Date().toISOString().replace(/:|\./g,'') + ' - ' + image.originalname); 
    }
    
})

const imageFilter=(req,image,cb)=>{
    if(image.mimetype==='image/jpg' || image.mimetype==='image/png' 
    || image.mimetype==='image/jpeg' || image.mimetype === 'video/mp4'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const Videoupload=multer({storage:storage,imageFilter:imageFilter})

module.exports={Videoupload}

