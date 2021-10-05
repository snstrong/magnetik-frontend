import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

/** Site-wide routes */

function Routes() {
  console.debug("Routes");

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <h1>Magnetik</h1>
        </Route>
        <Route exact path="/login">
          <h1>Login</h1>
        </Route>
        <Route exact path="/signup">
          <h1>Sign Up</h1>
        </Route>
        <Route exact path="/profile">
          <h1>Profile</h1>
        </Route>
        <Route exact path="/writespace">
          <h1>Writespace</h1>
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;
