const express=require("express");
const user=require("../models/user");
const route=express.Router();

route.get("/signin",(req,res)=>{
    return res.render("signin");
});

route.get("/signup",(req,res)=>{
    return res.render("signup");
});

route.post("/signup",async (req,res)=>{
    const {FullName,email,password}=req.body;
    await user.create({
        FullName,
        email,
        password,
    });
    return res.redirect("/");
});

route.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
    const token=await user.checkMatchAndGenerateToken(email,password);
    console.log(token);
    return res.cookie("token",token).redirect("/");
    }
    catch(err){
        res.render("signin",{
            error:"Incorrect Password Or Email",
        });
    }
});

route.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports=route