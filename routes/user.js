const express = require("express");
const user = require("../models/user");
const Otp = require("../models/otp");
const generateOtp = require("../Utils/GenerateOtp");
const { sendOTP } = require("../Services/email");
const route = express.Router();

route.get("/signin", (req, res) => {
    return res.render("signin");
});

route.get("/signup", (req, res) => {
    return res.render("signup");
});

route.get("/VerifyOtp", (req, res) => {
    return res.render("otppage", {
        user: req.user,
    });
});

route.post("/ValidateOtp", async (req, res) => {

    const { email, otp } = req.body;

    const record = await Otp.findOne({
        email,
        otp: otp.toString()
    });

    if (!record) {
        return res.send("Invalid OTP");
    }

    if (record.expireAt < new Date()) {
        return res.send("OTP Expired");
    }

    await user.updateOne(
        { email },
        { $set: { isVerified: true } }
    );
    await record.save();
    res.redirect("/");
});

route.post("/signup", async (req, res) => {
    const { FullName, email, password } = req.body;
    await user.create({
        FullName,
        email,
        password,
    });
    return res.redirect("/");
});

route.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await user.checkMatchAndGenerateToken(email, password);
        console.log(token);
        const otp = generateOtp();
        await Otp.create({
            email,
            otp,
            expireAt: new Date(Date.now() + 5 * 60 * 1000)
        });
        await sendOTP(email, otp);
        return res.cookie("token", token).redirect('/user/VerifyOtp');
    }
    catch (err) {
        console.log(err);
        res.render("signin", {
            error: "Incorrect Password Or Email",
        });
    }
});

route.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
})

module.exports = route