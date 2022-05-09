const express = require("express");
const Post = require("../models/PostSchema");
const Route = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

Route.get("/", auth, async (request, response) => {
  try {
    const data = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "postUserRef" });
    const verify = response.locals.userInfo;
    let ans = data.map((val) => {
      let isMyPost;
      let commentsNo = val.comments.length;
      let likesNo = val.likes.length;
      let dislikesNo = val.dislikes.length;
      let isLiked;
      let isDisliked;
      let tempLiked=val.likes.find((like)=>verify==like['likeUserRef']);
      tempLiked?isLiked=true:isLiked=false;
      let tempDisliked=val.dislikes.find((dislike)=>verify==dislike['dislikeUserRef']);
      tempDisliked?isDisliked=true:isDisliked=false;
      
      let avatar=val.postUserRef.avatar;
      let postCreatedAt = val.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      let postId = val["_id"];
      if (verify == val.postUserRef["_id"]) {
        isMyPost = true;
      } else {
        isMyPost = false;
      }
      return {
        userName: val.postUserRef.userName,
        postText: val.postText,
        isMyPost,
        postCreatedAt,
        postId,
        commentsNo,
        likesNo,
        dislikesNo,
        isLiked,
        isDisliked,
        avatar
      };
    });
    response.status(200).json({ data: ans });
  } catch (error) {
    console.log(error);
    response.status(400).json({ error });
  }
});

Route.post(
  "/post",
  [body("postText").notEmpty().withMessage("Post Text required")],
  auth,
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { postText } = request.body;
      const verify = response.locals.userInfo;
      let post = new Post({ postText, postUserRef: verify });
      await post.save();

      response.status(201).json("Success");
    } catch (error) {
      response.status(400).json({ error });
    }
  }
);

Route.put("/like/:postId", auth, async (request, response) => {
  try {
    const { postId } = request.params;
    const {userInfo} =response.locals;
    const getinit = await Post.findById(postId);
    let isLiked = getinit.likes.find((val)=>val.likeUserRef==response.locals.userInfo);
    let isDisliked = getinit.dislikes.find((val)=>val.dislikeUserRef==userInfo);
    if(isDisliked){
      await Post.findByIdAndUpdate(postId,{
        $pull:{dislikes:{dislikeUserRef:userInfo}}
      })
       response.status(202).json("OK");
    }
    if(isLiked){
      await Post.findByIdAndUpdate(postId,{
        $pull:{likes:{likeUserRef:userInfo}}
      })
      return response.status(202).json("OK");
    }
    else{
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: {likeUserRef:response.locals.userInfo} },
      });
      response.status(201).json("OK");
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error });
  }
});
// Route.put("/like/delete/:postId", auth, async (request, response) => {
//   try {
//     const { postId } = request.params;
//     await Post.findByIdAndUpdate(postId, {
//       $pull: { likes: {likeUserRef:response.locals.userInfo} },
//     });
//     response.status(202).json("OK");
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({ error });
//   }
// });

Route.put("/dislike/:postId", auth, async (request, response) => {
  try {
    const { postId } = request.params;
    const {userInfo} =response.locals;
    const getinit = await Post.findById(postId);
    let isLiked = getinit.likes.find((val)=>val.likeUserRef==response.locals.userInfo);
    let isDisliked = getinit.dislikes.find((val)=>val.dislikeUserRef==userInfo);
    if(isLiked){
      await Post.findByIdAndUpdate(postId,{
        $pull:{likes:{likeUserRef:userInfo}}
      })
    }
    if(isDisliked){
      await Post.findByIdAndUpdate(postId,{
        $pull:{dislikes:{dislikeUserRef:userInfo}}
      })
      return response.status(202).json("OK");
    }
    else{
      await Post.findByIdAndUpdate(postId, {
        $push: { dislikes: {dislikeUserRef:userInfo} },
      });
      response.status(201).json("OK");
      }
    // const { postId } = request.params;
    // await Post.findByIdAndUpdate(postId, {
    //   $push: { dislikes: {dislikeUserRef:response.locals.userInfo} },
    // });
    // response.status(201).json("OK");
  } catch (error) {
    console.log(error);
    response.status(500).json({ error });
  }
});
// Route.put("/dislike/delete/:postId", auth, async (request, response) => {
//   try {
//     const { postId } = request.params;
//     await Post.findByIdAndUpdate(postId, {
//       $pull: { dislikes: {dislikeUserRef:response.locals.userInfo} },
//     });
//     response.status(202).json("OK");
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({ error });
//   }
// });

Route.delete('/post/delete/:postId',auth,async(request,response)=>{
  try{
    let {postId} = request.params;
    let post = await Post.findById(postId);
    if(response.locals.userInfo!=post['postUserRef']){
      return response.status(403).json("Forbidden");
    }
    await Post.findByIdAndDelete(postId);
    response.status(200).json("OK");
  }catch(error){
    console.log(error);
    response.status(500).json({error});
  }
})


module.exports = Route;
