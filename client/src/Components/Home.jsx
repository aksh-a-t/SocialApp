import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { NavLink, Link } from "react-router-dom";

const Home = () => {
  const [height, setHeight] = useState("");
  useEffect(() => {
    setHeight(`${window.innerHeight}px`);
  }, []);
  return (
    <div style={{ height: height }} id="homepage-cont">
      <div className="homepage-back-overlay constantMargin">
        <div id="main-Heading">The Social Media App</div>
        <div id="subHeading">
          A fun place for developers and friends to share ideas on
          technology.Plenty of cool discussions!
        </div>
        <div style={{ marginTop: "5px" }}>
          <NavLink
            style={{ color: "white", textDecoration: "none" }}
            to="/users/register"
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "darkgreen", color: "white" }}
            >
              Register
            </Button>
          </NavLink>
          <Link
            style={{
              color: "white",
              textDecoration: "none",
              marginLeft: "10px  ",
            }}
            to="/users/login"
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "darkgreen", color: "white" }}
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
