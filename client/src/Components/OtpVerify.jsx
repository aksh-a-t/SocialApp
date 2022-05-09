import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const OtpVerify = () => {
  const [output, setOutput] = useState(0);
  const [val, setVal] = useState("");
  const history = useHistory();
  const params = useParams();
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 1500));

  useEffect(() => {
    const check = () => {
      axios
        .get(`https://enigmatic-cliffs-52797.herokuapp.com/api/users/check/otplink/${params["uuid"]}`)
        .then((res) => {
          // res.status===200&&history.replace();
        })
        .catch((error) => {
          history.replace("/");
        });
    };
    check();
  }, []);
  const otpSubmit = () => {
    if (val.length === 6) {
      setOutput(0);
      axios
        .post(`https://enigmatic-cliffs-52797.herokuapp.com/api/users/check/otp/${params["uuid"]}`, {
          otp: val,
        })
        .then(async (res) => {
          setOutput(1);
          await sleep();
          history.push("/users/login");
        })
        .catch((error) => {
          setOutput(2);
        });
    } else {
      setOutput(2);
    }
  };
  return (
    <div>
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "150px",
        }}
      >
        <CardContent>
          <Typography
            sx={{ textAlign: "center" }}
            variant="h5"
            color="text.secondary"
            gutterBottom
          >
            OTP Verification
          </Typography>
          <Typography variant="h6" component="div">
            We've sent a verification code to your <br /> email -{" "}
            {sessionStorage.getItem("email")}
          </Typography>
        </CardContent>
        <CardActions>
          <TextField
            value={val}
            onChange={(e) => setVal(e.target.value)}
            id="outlined-basic"
            label="Enter 6 Digit Verification Code"
            variant="outlined"
          />
        </CardActions>
        <CardActions>
          <Button onClick={otpSubmit}>Verify</Button>
        </CardActions>
        <CardContent>
          {output === 1 && <div style={{ color: "green" }}>Verified</div>}
          {output === 2 && <div style={{ color: "red" }}>Wrong OTP</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerify;
