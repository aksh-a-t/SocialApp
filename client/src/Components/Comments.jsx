import {
  Avatar,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import Acomment from "./Acomment";
import SkeletonComp from "./SubComponents/SkeletonComp";
import { UserContext } from "./SubComponents/UserContext";
import ErrorAlert from "./SubComponents/ErrorAlert";

let socket;
const Comments = () => {
  const loading = React.useRef(true);
  const [commentText, setCommentText] = useState("");
  const [chat, setChat] = useState([]);
  const [errAlert, setErrAlert] = useState({ display: false, msg: "" });
  const { state } = useLocation();
  const params = useParams();
  const contextAccess = useContext(UserContext);
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 3000));

  useEffect(() => {
    try {
      socket = io("https://enigmatic-cliffs-52797.herokuapp.com", {
        auth: { token: JSON.parse(sessionStorage.getItem("token")) },
      });
      socket.emit("join", { room: params["postId"] });
    } catch (error) {
      console.log(error);
    }
    return () => {
      socket.emit("leave", { room: params["postId"] });
    };
  }, []);

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat((prev) => [payload, ...prev]);
    });
    socket.on("dbcomments", (payload) => {
      loading.current = false;
      setChat([...payload.data]);
    });
    socket.on("chat_deleted", (payload) => {
      setChat((prev) => {
        let val = prev.filter((data) => data.commentId !== payload.commentId);
        return val;
      });
    });
    socket.on("connect_error", async (error) => {
      if (error.message === "Authentication error") {
        setErrAlert({
          display: true,
          msg: "Sorry for inconvenience,Please login again.",
        });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("avatar");
        await sleep();
        setErrAlert({ display: false, msg: "" });
        contextAccess.signOut();
      } else if (error.message === "Forbidden") {
        console.log(error.message);
      } else console.log(error);
    });
  }, []);

  useEffect(() => {
    if (errAlert.display === true) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [errAlert]);

  const handleChange = (event) => {
    setCommentText(event.target.value);
  };

  const deleteChat = useCallback(
    (commentId) => {
      socket.emit("delete_chat", { commentId, postId: params["postId"] });
    },
    [chat]
  );

  const sendChat = () => {
    if (commentText.length > 1) {
      errAlert &&
        setErrAlert((pre) => {
          return { ...pre, display: false, msg: "" };
        });
      socket.emit("chat", { commentText, room: params["postId"] });
      setCommentText("");
    } else {
      setErrAlert({ display: true, msg: "Please fill the Field" });
    }
  };
  const History = useHistory();

  return (
    <div className="constantMargin">
      <ErrorAlert errAlert={errAlert} setErrAlert={setErrAlert}/>

      <Button
        variant="contained"
        style={{ background: "black", marginTop: "20px", marginBottom: "10px" }}
        onClick={() => History.push("/all_posts")}
      >
        Back
      </Button>
      <Paper
        sx={{ p: 2, margin: "10px 0px", flexGrow: 1, overflowWrap: "anywhere" }}
      >
        <Grid container columnSpacing={2} direction="column">
          <Grid container item spacing={{ xs: 2 }}>
            <Grid
              xs={12}
              sm={2}
              item
              container
              direction="column"
              alignItems="center"
            >
              <Grid item>
                <Avatar
                  sx={{ width: 60, height: 60 }}
                  src={state["data"].avatar}
                />
              </Grid>
              <Grid item>
                <Typography
                  className="line-height"
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                >
                  {state["data"].userName}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              style={{ marginLeft: "20px" }}
              container
              sm
              direction="column"
              item
            >
              <Grid item>
                <Typography variant="subtitle1" component="div">
                  {state["data"].postText}
                </Typography>
              </Grid>
              <Grid item>{state["data"].postCreatedAt}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <FormControl
              fullWidth
              sx={{ m: 1, marginLeft: "0px", backgroundColor: "lightgray" }}
            >
              <OutlinedInput
                id="outlined-adornment-post"
                style={{ padding: "0px", paddingLeft: "10px" }}
                value={commentText}
                onChange={handleChange}
                placeholder="What's on your mind"
                multiline
                rows={3}
                startAdornment={
                  <InputAdornment position="start">
                    <Avatar
                      alt="avatar"
                      src={JSON.parse(sessionStorage.getItem("avatar"))}
                      sx={{ width: 56, height: 56 }}
                    />
                  </InputAdornment>
                }
              />
            </FormControl>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Button onClick={sendChat} variant="contained" color="success">
                Comment
              </Button>
              {/* {
              spinner.current &&
            (<CircularProgress size={30} color="success"/>)
            } */}
            </div>
          </Grid>
        </Grid>
      </Paper>
      <div style={{ marginTop: "30px" }} className="post-comment-container">
        {!loading.current ? (
          chat &&
          chat.map((val, index) => {
            return <Acomment key={index} value={val} deleteChat={deleteChat} />;
          })
        ) : (
          <SkeletonComp />
        )}
      </div>
    </div>
  );
};

export default Comments;
