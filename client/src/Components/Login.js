import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./SubComponents/UserContext";
import { Zoom } from "react-awesome-reveal";
import ErrorAlert from "./SubComponents/ErrorAlert";
const Login = () => {
  useEffect(() => {
    if (sessionStorage.getItem("email") && sessionStorage.getItem("password")) {
      setVal({
        ...values,
        email: sessionStorage.getItem("email"),
        password: sessionStorage.getItem("password"),
      });
      setErr({ email: 2, password: 2 });
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
    }
    setHeight(`${window.innerHeight}px`);
  }, []);
  const [values, setVal] = useState({
    showPassword: false,
    password: "",
    email: "",
  });
  const [err, setErr] = useState({
    email: 0,
    password: 0,
  });
  const [errAlert, setErrAlert] = useState({
    display: false,
    msg: "",
  });
  const [backdrop, setBackdrop] = useState(false);
  const [height, setHeight] = useState("");

  const History = useHistory();

  const contextAccess = useContext(UserContext);

  const handleClickShowPassword = () => {
    setVal({ ...values, showPassword: !values.showPassword });
  };
  const handleChange = (event) => {
    let { value, name } = event.target;

    setVal({ ...values, [name]: value });

    if (err[name] !== 0) {
      validationCheck(name, value);
    }
  };
  const validationCheck = (name, value) => {
    if (name === "email") {
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
  const LoginHandler = async () => {
    if (err.email !== 2 || err.password !== 2) {
      setErrAlert({ display: true, msg: "Please Fill in the Fields" });
    } else {
      setErrAlert({ display: false, msg: "" });
      setBackdrop(true);
      axios
        .post(
          "https://enigmatic-cliffs-52797.herokuapp.com/api/users/login",
          {
            email: values.email,
            password: values.password,
          }
        )
        .then((res) => {
          sessionStorage.setItem("token", JSON.stringify(res.data.token));
          errAlert.display && setErrAlert({ display: false, msg: "" });
          contextAccess.signIn();
          sessionStorage.setItem("avatar", JSON.stringify(res.data.avatar));
          History.replace("/all_posts");
        })
        .catch((error) => {
          setBackdrop(false);
          error.response &&
            setErrAlert({
              display: true,
              msg: error.response.data.errors.msg,
            });
          console.log(error);
        });
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
        <div className="constantMargin">
          <ErrorAlert errAlert={errAlert} setErrAlert={setErrAlert} />

          <h1
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0",
              color: "darkgreen",
            }}
          >
            <div>
              <i className="fa fa-sign-in-alt"></i>
            </div>
            Login
          </h1>
          <div>Login to this awesome application!</div>
          <form className="form">
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
                type={values.showPassword ? "text" : "password"}
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
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {err.password === 1 && (
              <small style={{ color: "#ff3547" }}>
                Password must be 8-16 char long and must contain a
                number,special character,lower case,upper case character{" "}
              </small>
            )}
            {err.password === 2 && (
              <small style={{ color: "#00c851" }}>Looks Good</small>
            )}
          </form>
          <Button
            className="inputbtwgap"
            variant="contained"
            style={{ backgroundColor: "darkgreen", color: "white" }}
            onClick={LoginHandler}
          >
            Login
          </Button>
          <div
            className="form"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            <div>
              Don't have an account ?
              <Link
                style={{ textDecoration: "none", color: "darkgreen" }}
                to="/users/register"
              >
                Register
              </Link>
            </div>
            <div>
              <Link
                style={{ textDecoration: "none", color: "darkgreen" }}
                to="/forgot"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </Zoom>
    </div>
  );
};

export default Login;
