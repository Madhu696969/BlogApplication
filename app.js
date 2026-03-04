require("dotenv").config()
const express=require('express');
const { url } = require('inspector');
const mongoose=require("mongoose");
const path=require('path');
const blog=require("./models/blog")
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");
const app=express();
const cookieParser=require("cookie-parser");
const { checkForAuthentication } = require('./middleware/authentication');
const PORT=8000 || process.env.PORT



mongoose.connect(process.env.MONGO_URL).then(()=>console.log("MongoDb Connected")).catch(err=>console.log(err.message));
app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.use(express.static(path.resolve("./public")));

app.get("/",async (req,res)=>{
    const AllBlogs=await blog.find({});
    console.log(AllBlogs);
    res.render("home",{
        user:req.user,
        blogs:AllBlogs,
    });
})
app.listen(PORT,()=>{
    console.log("Server Started");
})