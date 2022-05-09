import React, { useContext, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Registration from "./Components/Registration";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Login from "./Components/Login";
import AllPosts from "./Components/AllPosts";
import { UserContext, ContextData } from "./Components/SubComponents/UserContext";
import Comments from "./Components/Comments";
import OtpVerify from "./Components/OtpVerify";
import ForgotPass from "./Components/ForgotPass";
import Forgot from "./Components/Forgot";
import Home from "./Components/Home";

function App() {
  return (
    <>
      <UserContext.Provider value={ContextData()}>
        <BrowserRouter>
          <Navbar />
          <div className="App ">
            <Switch>
              <ReversePrivateRoute exact path="/users/register">
                <Registration />
              </ReversePrivateRoute>
              <ReversePrivateRoute exact path="/users/login">
                <Login />
              </ReversePrivateRoute>
              <PrivateRoute exact path="/all_posts">
                <AllPosts />
              </PrivateRoute>
              <PrivateRoute exact path="/post/:postId">
                <Comments />
              </PrivateRoute>
              <Route exact path="/verify/:uuid" component={OtpVerify} />
              <Route exact path="/forgot/:uuid" component={ForgotPass} />
              <ReversePrivateRoute exact path="/forgot">
                <Forgot />
              </ReversePrivateRoute>
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

function ReversePrivateRoute({ children, ...rest }) {
  let contextAccess = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      contextAccess.signIn();
      history.push("/all_posts");
    }
  }, [contextAccess]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        contextAccess.user ? <Redirect to="/all_posts" /> : children
      }
    />
  );
}
function PrivateRoute({ children, ...rest }) {
  let contextAccess = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      contextAccess.signIn();
      history.push("/all_posts");
    }
  }, [contextAccess]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        contextAccess.user ? children : <Redirect to="/users/login" />
      }
    />
  );
}
export default App;
