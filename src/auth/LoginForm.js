/** Form component for user login. 
 * 
 * Required form inputs:
 * {
	"username": "this_is_user",
	"password": "password"
 }
*/

import { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";

function LoginForm({ login }) {
  const history = useHistory();

  const INITIAL_STATE = {
    username: "",
    password: "",
  };

  let [formData, setFormData] = useState(INITIAL_STATE);
  let [formErrors, setFormErrors] = useState([]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...formData,
      [name]: value,
    }));
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);
    let res = await login(formData);
    if (res.success === true) {
      setFormData(INITIAL_STATE);
      history.push(`/${formData.username}/writespaces`);
    } else {
      console.error("Login failed", res.errors);
      setFormErrors(res.errors);
    }
  }

  return (
    <div className="LoginForm container">
      <h2>Login</h2>
      {formErrors.length ? <Alert type="danger" messages={formErrors} /> : null}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            autoComplete="username"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
