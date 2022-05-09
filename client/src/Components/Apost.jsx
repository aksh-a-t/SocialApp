import React, { memo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const Apost = (props) => {
  const [alignment, setAlignment] = React.useState(null);
  const [reaction, setReaction] = React.useState({ likes: 0, dislikes: 0 });
  const [dialoge, setDialoge] = React.useState(false);

  React.useEffect(() => {
    setReaction({
      likes: props.value.likesNo,
      dislikes: props.value.dislikesNo,
    });
    if (props.value.isLiked) {
      setAlignment("like");
    } else if (props.value.isDisliked) {
      setAlignment("dislike");
    } else {
      setAlignment(null);
    }
  }, []);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      props.handle401();
    } else console.log(error);
  };
  const reactToPost = () => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    return {
      likePost: () =>
        axios.put(
          `https://enigmatic-cliffs-52797.herokuapp.com/api/posts/like/${props.value.postId}`,
          {},
          { headers: { authorization: `Bearer ${token}` } }
        ),
      dislikePost: () =>
        axios.put(
          `https://enigmatic-cliffs-52797.herokuapp.com/api/posts/dislike/${props.value.postId}`,
          {},
          { headers: { authorization: `Bearer ${token}` } }
        ),
    };
  };

  const handleAlignment = (event, newAlignment) => {
    if (alignment === null && newAlignment === "like") {
      setReaction({ ...reaction, likes: reaction.likes + 1 });
      reactToPost()
        .likePost()
        .catch((error) => handleError(error));
    } else if (alignment === "like" && newAlignment === null) {
      setReaction({ ...reaction, likes: reaction.likes - 1 });
      reactToPost()
        .likePost()
        .catch((error) => handleError(error));
    } else if (alignment === "like" && newAlignment === "dislike") {
      setReaction({
        dislikes: reaction.dislikes + 1,
        likes: reaction.likes - 1,
      });
      reactToPost()
        .dislikePost()
        .catch((error) => handleError(error));
    } else if (alignment === "dislike" && newAlignment === "like") {
      setReaction({
        dislikes: reaction.dislikes - 1,
        likes: reaction.likes + 1,
      });
      reactToPost()
        .dislikePost()
        .catch((error) => handleError(error));
    } else if (alignment === null && newAlignment === "dislike") {
      setReaction({ ...reaction, dislikes: reaction.dislikes + 1 });
      reactToPost()
        .dislikePost()
        .catch((error) => handleError(error));
    } else if (alignment === "dislike" && newAlignment === null) {
      setReaction({ ...reaction, dislikes: reaction.dislikes - 1 });
      reactToPost()
        .dislikePost()
        .catch((error) => handleError(error));
    }
    setAlignment(newAlignment);
  };

  const dialogeOpen = () => {
    setDialoge(true);
  };
  const agreeDialoge = () => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    axios
      .delete(
        `https://enigmatic-cliffs-52797.herokuapp.com/api/posts/post/delete/${props.value.postId}`,
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(() => props.callBack())
      .catch((error) => handleError(error));
    dialogeClose();
  };
  const dialogeClose = () => {
    setDialoge(false);
  };
  return (
    <>
      <div>
        <Dialog open={dialoge} onClose={dialogeClose}>
          <DialogTitle>{"Alert"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete post.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={dialogeClose}>Disagree</Button>
            <Button onClick={agreeDialoge} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Paper
        sx={{
          p: 2,
          margin: "10px 0px",
          flexGrow: 1,
          overflowWrap: "anywhere",
          background: "wheat",
        }}
      >
        <Grid container spacing={{ xs: 2 }}>
          <Grid
            xs={12}
            sm={2}
            item
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Avatar sx={{ width: 60, height: 60 }} src={props.value.avatar} />
            </Grid>
            <Grid item>
              <Typography
                className="line-height"
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                {props.value.userName}
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
                {props.value.postText}
              </Typography>
            </Grid>
            <Grid item>{props.value.postCreatedAt}</Grid>
            <Grid
              item
              container
              justifyContent={{ sm: "space-between", xs: "space-around" }}
            >
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton
                  color="primary"
                  sx={{ border: "0px" }}
                  value="like"
                  aria-label="left aligned"
                  id="likeBtn"
                >
                  <i className="fas fa-thumbs-up fa-2x"></i>
                  <span>{reaction.likes}</span>
                </ToggleButton>
                <ToggleButton
                  color="secondary"
                  sx={{ border: "0px" }}
                  value="dislike"
                  aria-label="centered"
                  id="dislikeBtn"
                >
                  <i className="fas fa-thumbs-down fa-2x"></i>
                  <span>{reaction.dislikes}</span>
                </ToggleButton>
              </ToggleButtonGroup>
              <Link
                className="navLink"
                to={{
                  pathname: `/post/${props.value.postId}`,
                  state: { data: props.value },
                }}
              >
                <Button style={{ height: "100%" }}>
                  Comments
                  <span>({props.value.commentsNo})</span>
                </Button>
              </Link>
              {props.value.isMyPost ? (
                <Button onClick={dialogeOpen} color="error">
                  Delete
                </Button>
              ) : (
                <Button style={{ visibility: "hidden" }}>Delete</Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default memo(Apost);
