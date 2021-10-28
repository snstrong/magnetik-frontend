import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import Writespace from "../writespace/Writespace";
import ProtectedRoute from "./ProtectedRoute";

/** Site-wide routes */

function Routes({ login, register }) {
  // console.debug(
  //   "Routes",
  //   `login=${typeof login}`,
  //   `register=${typeof register}`
  // );

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <RegisterForm register={register} />
        </Route>

        <ProtectedRoute exact path="/profile">
          <ProfileForm />
        </ProtectedRoute>

        <Route exact path="/writespace">
          <Writespace />
        </Route>

        <ProtectedRoute exact path="/:username/writespaces">
          <h1>Writespaces</h1>
        </ProtectedRoute>

        <ProtectedRoute exact path="/:username/writespaces/:writespaceId">
          <Writespace />
        </ProtectedRoute>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;
