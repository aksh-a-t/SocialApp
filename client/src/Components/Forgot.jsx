import {
  Card,
  CardContent,
  Typography,
  CardActions,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ErrorAlert from "./SubComponents/ErrorAlert";

const Forgot = () => {
  const [val, setVal] = useState("");
  const [alert, setAlert] = useState({ display: false, msg: "" });
  const [done, setDone] = useState(false);
  const [height, setHeight] = useState("");
  const [drop, setDrop] = useState(false);

  useEffect(() => {
    setHeight(`${window.innerHeight}px`);
  }, []);

  const emailSubmit = () => {
    setDrop(true);
    axios
      .post("https://enigmatic-cliffs-52797.herokuapp.com/api/users/get/forgotlink", { email: val })
      .then((res) => {
        setDrop(false);
        setDone(true);
      })
      .catch((e) => {
        setDrop(false);
        setAlert({ display: true, msg: "Email not Found" });
      });
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: 2, height: height }}
        open={drop}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ErrorAlert errAlert={alert} setErrAlert={setAlert} />

      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "70px",
        }}
      >
        {!done ? (
          <div>
            <CardContent>
              <Typography
                sx={{ textAlign: "center" }}
                variant="h5"
                color="text.secondary"
                gutterBottom
              >
                Forgot Password
              </Typography>
              <Typography variant="h6" component="div">
                Enter your registered email to send you a link
              </Typography>
            </CardContent>
            <CardActions>
              <TextField
                type="email"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                id="outlined-basic"
                label="Enter Email"
                variant="outlined"
                style={{ width: "100%" }}
              />
            </CardActions>
            <CardActions>
              <Button style={{ margin: "auto" }} onClick={emailSubmit}>
                Submit
              </Button>
            </CardActions>
          </div>
        ) : (
          <CardContent>
            <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
              Email Sent
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Forgot;
