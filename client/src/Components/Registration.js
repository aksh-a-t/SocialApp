import React, { useState, useEffect } from "react";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Collapse,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import "./css.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Zoom } from "react-awesome-reveal";
import ErrorAlert from "./SubComponents/ErrorAlert";

const Registration = () => {
  const [values, setVal] = useState({
    password: "",
    userName: "",
    email: "",
  });
  const [err, setErr] = useState({
    showPassword: false,
    userName: 0,
    email: 0,
    password: 0,
  });
  const [errAlert, setErrAlert] = useState({
    msg: "",
    display: false,
  });
  const [succAlert, setSuccAlert] = useState(false);
  const History = useHistory();
  const [backdrop, setBackdrop] = useState(false);
  const [height, setHeight] = useState("");
  useEffect(() => {
    setHeight(`${window.innerHeight}px`);
  }, []);

  const handleClickShowPassword = () => {
    setErr({ ...err, showPassword: !err.showPassword });
  };
  const handleChange = (event) => {
    let { value, name } = event.target;

    setVal({ ...values, [name]: value });

    if (err[name] !== 0) {
      validationCheck(name, value);
    }
  };
  const validationCheck = (name, value) => {
    if (name === "userName") {
      if (value.length < 2) {
        setErr({ ...err, userName: 1 });
      } else {
        setErr({ ...err, userName: 2 });
      }
    } else if (name === "email") {
      const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      if (!regex.test(value)) {
        setErr({ ...err, email: 1 });
      } else {
        setErr({ ...err, email: 2 });
      }
    } else if (name === "password") {
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
      if (!re.test(value)) {
        setErr({ ...err, password: 1 });
      } else {
        setErr({ ...err, password: 2 });
      }
    }
  };

  const RegisterHandler = async () => {
    if (err.userName === 2 && err.password === 2 && err.email === 2) {
      setBackdrop(true);
      axios
        .post("https://enigmatic-cliffs-52797.herokuapp.com/api/users/register", { ...values })
        .then(async (res) => {
          errAlert.display && setErrAlert({ display: false, msg: "" });
          sessionStorage.setItem("password", values.password);
          sessionStorage.setItem("email", values.email);
          History.push(`/verify/${res.data.link}`);
        })
        .catch((err) => {
          setBackdrop(false);
          err.response.data.errors.msg &&
            setErrAlert({ display: true, msg: err.response.data.errors.msg });
          console.log(err);
        });
    } else {
      succAlert && setSuccAlert(false);
      setErrAlert({ display: true, msg: "Please fill in the Fields." });
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

      <Zoom>
        <div className="constantMargin ">
          <ErrorAlert errAlert={errAlert} setErrAlert={setErrAlert} />
          {
            <Collapse in={succAlert}>
              <Alert
                severity="success"
                variant="filled"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setSuccAlert(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Success
              </Alert>
            </Collapse>
          }

          <h1
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0",
              color: "darkgreen",
            }}
          >
            <div>
              <i className="fa fa-user-shield"></i>
            </div>
            Register
          </h1>
          <div>Join me and my friends on this great application!</div>
          <form className="form">
            <FormControl
              className="inputback"
              fullWidth={true}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-name"
                type="text"
                value={values.userName}
                name="userName"
                onChange={handleChange}
                label="Name"
                onBlur={(event) =>
                  validationCheck(event.target.name, event.target.value)
                }
                {...(err.userName === 1 && { error: true })}
              />
            </FormControl>
            {err.userName === 1 && (
              <small style={{ color: "#ff3547" }}>Enter Valid Name</small>
            )}
            {err.userName === 2 && (
              <small style={{ color: "#00c851" }}>Looks Good</small>
            )}

            <FormControl
              className="inputback inputbtwgap"
              fullWidth={true}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email"
                type="email"
                value={values.email}
                name="email"
                onChange={handleChange}
                label="email"
                onBlur={(event) =>
                  validationCheck(event.target.name, event.target.value)
                }
                {...(err.email === 1 && { error: true })}
              />
            </FormControl>
            {err.email === 1 && (
              <small style={{ color: "#ff3547" }}>Enter Valid Email</small>
            )}
            {err.email === 2 && (
              <small style={{ color: "#00c851" }}>Looks Good</small>
            )}

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
                type={err.showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onChange={handleChange}
                {...(err.password === 1 && { error: true })}
                onBlur={(event) =>
                  validationCheck(event.target.name, event.target.value)
                }
                autoComplete="on"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      //   onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {err.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {err.password === 1 && (
              <small style={{ color: "#ff3547" }}>Password must contain </small>
            )}
            {err.password === 2 && (
              <small style={{ color: "#00c851" }}>Looks Good</small>
            )}
          </form>
          <label htmlFor="contained-button-file">
            <Button
              className="inputbtwgap"
              variant="contained"
              style={{ backgroundColor: "darkgreen", color: "white" }}
              onClick={RegisterHandler}
            >
              Register
            </Button>
          </label>
          <div>
            Already have an account?
            <Link
              style={{ textDecoration: "none", color: "darkgreen" }}
              to="/users/login"
            >
              Login
            </Link>
          </div>
        </div>
      </Zoom>
    </div>
  );
};

export default Registration;
