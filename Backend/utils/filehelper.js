const multer  = require('multer')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Backend/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:|\./g,'') + ' - ' + file.originalname); 
    }
    
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpg' || file.mimetype==='image/png' 
    || file.mimetype==='image/jpeg' || file.mimetype === 'video/mp4'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload=multer({storage:storage,fileFilter:fileFilter})

module.exports={upload}

