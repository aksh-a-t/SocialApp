import React from "react";
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
} from "@mui/material";

const Acomment = (props) => {
  const [dialoge, setDialoge] = React.useState(false);

  const dialogeOpen = () => {
    setDialoge(true);
  };

  const agreeDialoge = () => {
    props.deleteChat(props.value.commentId);
    dialogeClose();
  };

  const dialogeClose = () => {
    setDialoge(false);
  };

  return (
    <>
      <div>
        <Dialog
          open={dialoge}
          onClose={dialogeClose}
        >
          <DialogTitle >{"Alert"}</DialogTitle>
          <DialogContent>
            <DialogContentText >
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
          margin: "0px 0px 10px 0px",
          flexGrow: 1,
          overflowWrap: "anywhere",
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
                {props.value.commentText}
              </Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              item
            >
              <Grid item>{props.value.commentCreatedAt}</Grid>
              <Grid item>
                {props.value.isMyComment ? (
                  <Button onClick={dialogeOpen} color="error">
                    Delete
                  </Button>
                ) : (
                  <Button color="error" style={{ visibility: "hidden" }}>
                    Delete
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default React.memo(Acomment);
