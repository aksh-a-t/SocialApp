import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ErrorAlert from "./SubComponents/ErrorAlert";

const ForgotPass = () => {
  const history = useHistory();
  const params = useParams();
  const [val, setVal] = useState({
    password: "",
    confirmPass: "",
    showPass: false,
  });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState({ display: false, msg: "" });
  const [backdrop, setBackdrop] = useState(false);
  const [height, setHeight] = useState("");

  useEffect(() => {
    const check = () => {
      axios
        .get(
          `https://enigmatic-cliffs-52797.herokuapp.com/api/users/check/forgotlink/${params["uuid"]}`
        )
        .then((res) => {})
        .catch((error) => {
          history.replace("/");
        });
    };
    check();
    setHeight(`${window.innerHeight}px`);
  }, []);
  const changeHandler = (e) => {
    setVal((pre) => {
      return {
        ...pre,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleClickShowPassword = () => {
    setVal({ ...val, showPass: !val.showPass });
  };
  const changePass = () => {
    if (val.password === val.confirmPass) {
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
      if (!re.test(val.password)) {
        setErr({
          display: true,
          msg: "Password must be 8-16 char long and must contain a number,special character,lower case,upper case character",
        });
      } else {
        setBackdrop(true);
        axios
          .put(
            `https://enigmatic-cliffs-52797.herokuapp.com/api/users/change/password/${params["uuid"]}`,
            { password: val.password }
          )
          .then(() => {
            setDone(true);
            setBackdrop(false);
          })
          .catch((er) => {
            setErr({ display: true, msg: "Error" });
            setBackdrop(false);
          });
      }
    } else {
      setErr({ display: true, msg: "Password and Confirm Password Mismatch" });
    }
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: 2, height: height }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div>
        <ErrorAlert errAlert={err} setErrAlert={setErr} />
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
                  gutterBottom
                >
                  Reset Password
                </Typography>
              </CardContent>
              <CardActions>
                <FormControl
                  className="inputbtwgap inputback"
                  fullWidth={true}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={val.showPass ? "text" : "password"}
                    value={val.password}
                    name="password"
                    onChange={changeHandler}
                    autoComplete="on"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          //   onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {val.showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </CardActions>
              <CardActions>
                <FormControl
                  className="inputbtwgap inputback"
                  fullWidth={true}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-confirm">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-confirm"
                    type={val.showPass ? "text" : "password"}
                    value={val.confirmPass}
                    name="confirmPass"
                    onChange={changeHandler}
                    autoComplete="on"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {val.showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </CardActions>
              <CardActions>
                <Button style={{ margin: "auto" }} onClick={changePass}>
                  Submit
                </Button>
              </CardActions>
            </div>
          ) : (
            <CardContent>
              <Typography
                sx={{ textAlign: "center" }}
                variant="h5"
                gutterBottom
              >
                Password Change Successful
              </Typography>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPass;
