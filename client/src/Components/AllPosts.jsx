import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Avatar,
  Button,
} from "@mui/material";
import React, { useEffect, useState, useContext, useCallback } from "react";
import "./css.css";
import Apost from "./Apost";
import axios from "axios";
import { UserContext } from "./SubComponents/UserContext";
import SkeletonComp from "./SubComponents/SkeletonComp";
import ErrorAlert from "./SubComponents/ErrorAlert";

const AllPosts = () => {
  const loading = React.useRef(true);
  const [responseAllPosts, setResponseAllPosts] = useState([]);
  const [postMessage, setPostMessage] = useState("");
  const [errAlert, setErrAlert] = useState({ display: false, msg: "" });
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 3000));
  const contextAccess = useContext(UserContext);

  useEffect(() => {
    requestData();
  }, []);
  useEffect(() => {
    if (errAlert.display === true) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [errAlert]);


  const handle401 = useCallback(async () => {
    setErrAlert({
      display: true,
      msg: "Sorry for inconvenience,Please login again.",
    });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("avatar");
    await sleep();
    setErrAlert({ display: false, msg: "" });
    contextAccess.signOut();
  }, [responseAllPosts]);

  const requestData = useCallback(() => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    loading.current = true;
    setResponseAllPosts([]);
    axios
      .get("https://enigmatic-cliffs-52797.herokuapp.com/api/posts/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        loading.current = false;
        setResponseAllPosts(res.data.data);
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          handle401();
        } else {
          console.log(error);
        }
      });
  }, [responseAllPosts]);

  const handleChange = (e) => {
    setPostMessage(e.target.value);
  };
  const handlePost = () => {
    if (postMessage) {
      errAlert && setErrAlert({ display: false, msg: "" });
      let token = JSON.parse(sessionStorage.getItem("token"));
      axios
        .post(
          "https://enigmatic-cliffs-52797.herokuapp.com/api/posts/post",
          { postText: postMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          setPostMessage("");
        })
        .then(() => requestData())
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            handle401();
          } else {
            console.log(error);
          }
        });
    } else {
      setErrAlert({ display: true, msg: "Please write a post" });
    }
  };
  return (
    <div className="constantMargin">
      <ErrorAlert errAlert={errAlert} setErrAlert={setErrAlert} />

      <h1 style={{ marginBottom: "0px" }}>
        Welcome to a thriving tech community!
      </h1>
      <div>
        Discuss the latest technology and trends. Be civil and supportive!
      </div>
      <div className="inputbtwgap" style={{ marginBottom: "40px" }}>
        <FormControl
          fullWidth
          sx={{ m: 1, marginLeft: "0px", backgroundColor: "lightgray" }}
        >
          <OutlinedInput
            id="outlined-adornment-post"
            style={{ padding: "0px", paddingLeft: "10px" }}
            value={postMessage}
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
        <Button onClick={handlePost} variant="contained" color="success">
          Post
        </Button>
      </div>
      <div className="post-comment-container">
        {!loading.current ? (
          responseAllPosts &&
          responseAllPosts.map((val, index) => {
            return (
              <Apost
                key={index}
                value={val}
                callBack={requestData}
                handle401={handle401}
              />
            );
          })
        ) : (
          <SkeletonComp />
        )}
      </div>
    </div>
  );
};

export default AllPosts;
