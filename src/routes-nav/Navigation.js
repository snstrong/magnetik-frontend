import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

function Navigation({ logout }) {
  function loggedInNav() {
    return (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink className="nav-link" to="./writespace">
            Writespace
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="./profile">
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="./logout" onClick={logout}>
            Logout
          </NavLink>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">
            Log In
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className="Navigation navbar navbar-expand-lg navbar-light bg-light px-3">
      <NavLink className="navbar-brand" to="/">
        Magnetik
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarContent">
        {loggedInNav()}
      </div>
    </nav>
  );
}

export default Navigation;
