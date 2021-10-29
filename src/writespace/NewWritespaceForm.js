import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";

/** Form for creating new writespace. */

const NewWritespaceForm = ({ createNewWritespace }) => {
  const [formData, setFormData] = useState({ title: "" });
  const [formErrors, setFormErrors] = useState([]);
  const history = useHistory();

  /** Handle form data changing */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);
    if (!formData.title.length) {
      setFormErrors(["Title cannot be blank."]);
      return false;
    }
    let res = await createNewWritespace(formData);
    if (res.success) {
      console.log(
        "Redirecting... ",
        `/${res.username}/writespaces/${res.writespaceId}`
      );
      history.push(`/${res.username}/writespaces/${res.writespaceId}`);
    } else if (res.errors) {
      console.error("Create writespace failed", res.errors);
      setFormErrors([...res.errors]);
    } else {
      console.log(res);
    }
  }

  return (
    <div className="NewWritespaceForm row justify-content-center">
      {formErrors.length ? <Alert type="danger" messages={formErrors} /> : null}

      <form
        className="form-inline col-12 col-md-8 col-lg-6"
        onSubmit={handleSubmit}
      >
        <label className="mb-2 mt-3" htmlFor="title">
          Give your new writespace a title...
        </label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2"
          id="title"
          name="title"
          placeholder="Untitled"
          value={formData.title}
          onChange={handleChange}
        ></input>
        <button className="btn btn-primary mb-2">Submit</button>
      </form>
    </div>
  );
};

export default NewWritespaceForm;
