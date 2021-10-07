import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";
import UserContext from "../auth/UserContext";

/** Site-wide routes */

function Routes({ login, register }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`
  );

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <h1>Magnetik</h1>
        </Route>
        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>
        <Route exact path="/signup">
          <RegisterForm register={register} />
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
