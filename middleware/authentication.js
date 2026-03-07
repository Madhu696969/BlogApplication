const { verifyToken } = require("../Services/Authentication");

function checkForAuthentication(cookieName){
    return (req,res,next)=>{
        const tokenValue=req.cookies[cookieName];
        if(!tokenValue){
            return next();
        }
        try{
        const userPayload=verifyToken(tokenValue);
        req.user=userPayload;
        }
        catch(err){}
        return next();
    }
} 

module.exports={checkForAuthentication}