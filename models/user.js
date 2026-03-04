const mongoose=require("mongoose");
const {createHmac,randomBytes}=require("crypto");
const { CreateJWTToken } = require("../Services/Authentication");

const userSchema=new mongoose.Schema({
    FullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profImg:{
        type:String,
        default:'/images/blogProf.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }

},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
});
userSchema.static("checkMatchAndGenerateToken",async function(email,password){
    const user=await this.findOne({email});
    if(!user){
        throw new Error("No User Found");
    }
    const salt=user.salt;
    const HashedPassword=user.password;
    const newHashedPassword=createHmac("sha256",salt).update(password).digest("hex");
    if(HashedPassword!==newHashedPassword){
        throw new Error("Incorrect PassWord!");
    };
    const token=CreateJWTToken(user);
    return token
})

const user=mongoose.model("User",userSchema);

module.exports=user;