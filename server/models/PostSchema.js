const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postUserRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //whose Post
  postText: { type: String, required: true },
  // userName: { type: String, required: true },
//   avatar: { type: String, required: true },
  likes: [
    {
      likeUserRef: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, //list of users who liked
    },
  ],
  dislikes: [
    {
      dislikeUserRef: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, //list of users who disliked
    },
  ],
  comments: [
    {
      commentUserRef: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // whose comment on this post
      commentText: { type: String },
      userName: { type: String, required: true },
      avatar: { type: String, required: true },
      commentCreatedAt: { type: String, required: true },
    },
  ],
},{timestamps:true});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
