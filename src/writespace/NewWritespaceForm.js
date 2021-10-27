import React, { useState } from "react";
import { useHistory } from "react-router-dom";

/** Form for creating new writespace. */

const NewWritespaceForm = ({ createNewWritespace, hide }) => {
  const [formData, setFormData] = useState({ title: "" });
  const history = useHistory();

  /** Handle form data changing */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    // setFormErrors([]);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await createNewWritespace(formData);
    if (res.success === true) {
      history.push(`/writespaces/${res.username}/${res.writespaceId}`);
    } else {
      console.error("Create writespace failed", res.errors);
    }
  }

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <label className="mb-2" htmlFor="title">
        Title
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
      <button className="btn btn-primary mb-2">Save</button>
    </form>
  );
};

export default NewWritespaceForm;
