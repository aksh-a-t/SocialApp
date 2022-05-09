const app = require("express")();
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
const Post = require("./models/PostSchema");
const User = require("./models/UserSchema");

dotEnv.config({ path: "./env/.env" });

const initializeio = (io) => {

  io.use(function (socket, next) {
    try{
      if (socket.handshake.auth && socket.handshake.auth.token) {
        let token = socket.handshake.auth.token;
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          socket["userInfo"] = decoded["_id"];
          next();
        });
      } else {
        next(new Error("Authentication error"));
      }    
    }catch(error){
      console.log(error);
    }
  }).on("connection", function (socket) {
    try{
      socket.on("join", async (payload) => {
        socket.join(payload.room);
        let post = await Post.findById(payload.room);
  
        let ans = post.comments
          .sort((a, b) => {
            let valA = a.commentCreatedAt;
            let valB = b.commentCreatedAt;
            if (valA > valB) return -1;
            else if (valA < valB) return 1;
            else return 0;
          })
          .map((val) => {
            let isMyComment = false;
            if (val["commentUserRef"] == socket["userInfo"]) {
              isMyComment = true;
            }
            let commentCreatedAt = new Date(
              val.commentCreatedAt
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return {
              commentId:val['_id'],
              commentText: val.commentText,
              commentCreatedAt,
              userName: val.userName,
              avatar:val.avatar,
              isMyComment,
            };
          });
        socket.emit("dbcomments", { data: [...ans] });
      });
      socket.on("chat", async (payload) => {
        try {
          let commentCreatedAt = new Date().toISOString();
          let user = await User.findById(socket["userInfo"]);
          let newDoc=await Post.findByIdAndUpdate(payload.room, {
            $push: {
              comments: {
                commentText: payload.commentText,
                commentUserRef: socket["userInfo"],
                commentCreatedAt,
                userName:user.userName,
                avatar:user.avatar
              },
            },
          },{returnDocument:'after'});
          
          let tempfind = newDoc['comments'].filter((val)=>val['commentText']===payload.commentText);
          let newtemp = tempfind.filter((val)=>val['commentCreatedAt']===commentCreatedAt+'');
          tempfind=newtemp.find((val)=>val['commentUserRef']==socket["userInfo"]);
             commentCreatedAt = new Date(
            commentCreatedAt
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          socket.emit("chat", {
            commentId:tempfind['_id'],
            commentText: payload.commentText,
            commentCreatedAt,
            isMyComment: true,
            userName: user.userName,
            avatar:user.avatar
          });
          socket
            .to(payload.room)
            .emit("chat", {
              commentId:tempfind['_id'],
              commentText: payload.commentText,
              commentCreatedAt,
              isMyComment: false,
              userName: user.userName,
              avatar:user.avatar
            });
        } catch (error) {
          console.log("Error", error);
        }
      });
      socket.on("delete_chat",async(payload)=>{
        let post = await Post.findById(payload.postId);
        let check = post.comments.id(payload.commentId);
        if(check['commentUserRef']!=socket['userInfo']){
          return  Error("Forbidden");
        }
         await Post.findByIdAndUpdate(payload.postId,
          {$pull:{comments:{'_id':payload.commentId}}});
          io.in(payload.postId).emit("chat_deleted",{commentId:payload.commentId});      
      })
      socket.on("leave", (payload) => {
        socket.leave(payload.postId);
      });
      socket.on("disconnect", () => {});
  
    }catch(error){
      console.log(error);
    }
    // socket.on("Authentication error",()=>{
    //   socket.emit();
    // })
  });
}
module.exports = initializeio;
