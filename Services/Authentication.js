const JWT=require("jsonwebtoken");
const SECRETKEY="Madhu@123"

function CreateJWTToken(user){
    const payload={
        _id:user.id,
        email:user.email,
        name:user.FullName,
        profImg:user.profImg,
        role:user.role,
        isVerified:user.isVerified,
    }
    const token=JWT.sign(payload,SECRETKEY);
    return token;
}

function verifyToken(token){
    const payload=JWT.verify(token,SECRETKEY);
    return payload;
}

module.exports={
    CreateJWTToken,
    verifyToken
}
