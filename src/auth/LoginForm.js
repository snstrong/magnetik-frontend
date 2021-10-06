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

function LoginForm({ login }) {
  const history = useHistory();

  const INITIAL_STATE = {
    username: "",
    password: "",
  };

  let [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...formData,
      [name]: value,
    }));
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await login(formData);
    res.success ? history.push("/companies") : console.error(res.errors);
  }

  return (
    <div className="LoginForm container">
      <h2>Login</h2>
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
