require("dotenv").config();
const nodemailer = require("nodemailer");

const Transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,             
  secure: false,          
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendOTP = async (email, otp) => {
    await Transport.sendMail({
        from: "Blogify",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`
    })
}

module.exports = { sendOTP };


