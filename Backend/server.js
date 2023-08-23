const app=require('./app')
const mongoose = require("mongoose")
const dotenv=require("dotenv")
// const ConnectDB=require("./db/Database.js")

//Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down the server for Handling Uncaught Exception`)

})

//config
dotenv.config({
    path:"Backend/config/.env"
})

//Connect Database
const ConnectDB = async (req,res,next) => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI, {
            dbName: 'BareBeauty',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Connection is ready")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
ConnectDB()

//create Server
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost${process.env.PORT}`)
})


//Unhandled Promise

process.on("unhandledRejection",(err)=>{
    console.log(`Shutting down server fot ${err.message}`)
    console.log(`Shuttind down server due to unhandled promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})

