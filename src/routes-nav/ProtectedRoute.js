import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** ProtectedRoute Component
 * Checks for current user before allowing access to routes that require authorization.
 * Redirects to login form if no user found.
 */

function ProtectedRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);

  // console.debug(
  //   "ProtectedRoute",
  //   "exact=",
  //   exact,
  //   "path=",
  //   path,
  //   "currentUser=",
  //   currentUser
  // );

  if (!currentUser) return <Redirect to="/login" />;

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
}

export default ProtectedRoute;
