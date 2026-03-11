const express = require("express");
const multer = require("multer");
const path = require("path");
const route = express.Router();
const Blog = require("../models/blog");
const user = require("../models/user");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    }
})

const upload = multer({
    storage: storage
});

route.get("/addblog", (req, res) => {
    return res.render("addblog", {
        user: req.user
    })
});

route.get("/:id", async (req, res) => {
    if (!require("mongoose").Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Invalid Blog ID");
    }
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({
        blogId: req.params.id
    }).populate("createdBy");
    if (!blog) return res.status(404).send("Blog not found");
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    })
});
route.post("/comment/:blogId", async (req, res) => {
    try {
        if (!req.body.Comment || req.body.Comment.trim() === "") {
            throw new Error("Comment cannot be empty");
        }
        await Comment.create({
            Comment: req.body.Comment,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });
        res.redirect(`/blog/${req.params.blogId}`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Error creating comment: " + err.message);
    }
});
route.post("/", upload.single("coverImg"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImg: `/uploads/${req.file.filename}`
    });
    return res.redirect(`/blog/${blog._id}`);
})


module.exports = route