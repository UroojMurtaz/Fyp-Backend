const express=require("express");
var cors = require('cors');
const path=require('path')
const cookieParser = require("cookie-parser");
const app=express();
app.use(cookieParser())


const ErrorHandler=require("./Middleware/error")


app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(
    cors({
      origin: ["http://localhost:3000","https://barebeauty.vercel.app","http://localhost:3001"],
      methods: ["GET", "POST","DELETE","PUT"],
      credentials: true,
    })
  );


app.use('/Backend/uploads',express.static(path.join(__dirname,'uploads')))

//Route import
const product=require("./routes/ProductRoute")
const user = require("./routes/UserRoute")
const wishcart = require("./routes/WishCartRoute");
const order = require("./routes/OrderRoutes");
const video = require("./routes/VideosRoutes");
const question = require("./routes/QuesRoute");
const shop=require("./routes/ShopRoute");
const category=require("./routes/CategoryRoute");
const subcategory = require("./routes/SubCategoryRoute");
const request = require("./routes/RequestRoute");

app.use("/api",product)
app.use("/api",user)
app.use("/api",wishcart)
app.use("/api",order)
app.use("/api",video)
app.use("/api",question)
app.use("/api",shop)
app.use("/api",category)
app.use("/api", subcategory)
app.use("/api", request)



app.use(ErrorHandler)

module.exports =app