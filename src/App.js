import React, { useState, useEffect } from "react";
import Routes from "./routes-nav/Routes";
import { BrowserRouter } from "react-router-dom";
import jwt from "jsonwebtoken";
import MagnetikApi from "./api/MagnetikApi";
import Navigation from "./routes-nav/Navigation";
import UserContext from "./auth/UserContext";

import "./App.css";

/** Magnetik Application
 * State:
 * - currentUser
 * - token
 * - isLoaded
 * Methods:
 * - login
 * - logout
 * - signUp
 */

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(
    function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);
      // TODO: async function getCurrentUser(), userContext
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            MagnetikApi.token = token;
            let currUser = await MagnetikApi.getCurrentUser(username);
            setCurrentUser(currUser);
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser(null);
          }
        }
        setIsLoaded(true);
      }
      setIsLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  async function signUp(signUpData) {
    try {
      let userToken = await MagnetikApi.register(signUpData);
      setToken(userToken);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let userToken = await MagnetikApi.login(loginData);
      setToken(userToken);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
    console.log("logged out");
  }

  if (!isLoaded) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Navigation logout={logout} />
          <Routes login={login} register={signUp} />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
