import React, { useState, useEffect } from "react";
import Routes from "./routes-nav/Routes";
import { BrowserRouter } from "react-router-dom";
import jwt from "jsonwebtoken";

import Navigation from "./routes-nav/Navigation";

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
      console.debug("App useEffect loadUserInfo");
      // TODO: async function getCurrentUser(), userContext
      setIsLoaded(true);
    },
    [token]
  );

  async function signUp(signUpData) {
    try {
      // TODO: api helper method for signup, signup form
      let userToken = undefined;
      setToken(userToken);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { succes: false, errors };
    }
  }

  async function login(loginData) {
    try {
      // TODO: api helper method for login, login form
      let userToken = undefined;
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
        <Navigation logout={logout} />
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
