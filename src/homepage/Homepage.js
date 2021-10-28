import "./Homepage.css";
import React, { useContext } from "react";
import UserContext from "../auth/UserContext";

function Homepage() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  return (
    <div className="Homepage">
      <div className="container p-5">
        <div className="row">
          <div className="col-md-8 mx-auto my-auto p-5">
            <h1 className="Homepage-brand">Magnetik</h1>
            <h2 className="Homepage-tagline pb-3">
              {currentUser
                ? `Welcome back, ${currentUser.username}`
                : "Leave your word choice to chance."}
            </h2>
            <a className="btn btn-primary" href="/writespace">
              Write a Poem
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
