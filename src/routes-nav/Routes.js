import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import Writespace from "../writespace/Writespace";
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
          <ProfileForm />
        </Route>
        <Route exact path="/writespace">
          <Writespace />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;
