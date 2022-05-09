import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "./SubComponents/UserContext";

export default function Navbar() {
  const contextAccess = useContext(UserContext);

  const logoutHandler = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("avatar");
    contextAccess.signOut();
  };

  return (
    <div>
      <AppBar style={{ background: "black" }} position="fixed">
        <Toolbar>
          <Link className="navLink" to="/">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <i className="fa fa-code"></i>
            </IconButton>
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link className="navLink" to="/">
              Social Media
            </Link>
          </Typography>
          {contextAccess.user ? (
            <div style={{ paddingRight: "10vw" }}>
              <Button onClick={logoutHandler} color="inherit">
                Logout
              </Button>
            </div>
          ) : (
            <div className="hiddenNav" style={{ paddingRight: "10vw" }}>
              <Button color="inherit">
                <Link className="navLink" to="/users/register">
                  Register
                </Link>
              </Button>
              <Button color="inherit">
                <Link className="navLink" to="/users/login">
                  Login
                </Link>
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
