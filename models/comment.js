const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    Comment:{
        type:String,
        required:true,
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog",
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});

const comment=mongoose.model("comment",commentSchema);

module.exports=comment;