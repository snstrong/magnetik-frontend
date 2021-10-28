import { useState, useContext, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import UserContext from "../auth/UserContext";

function WritespaceList() {
  const { currentUser } = useContext(UserContext);
  const { username } = useParams();
  const history = useHistory();
  const [authorized, setAuthorized] = useState(false);
  const [writespaceList, setWritespaceList] = useState([]);

  useEffect(
    function authorize() {
      try {
        if (username && currentUser.username !== username) {
          throw new Error("Unauthorized.");
        }
        setAuthorized(true);
        setWritespaceList([{ id: 1, title: "gossamer" }]);
      } catch (errors) {
        console.error(errors);
        history.push("/");
      }
      return () => {
        setAuthorized();
      };
    },
    [currentUser, username]
  );

  if (!authorized) return <h1>Loading...</h1>;

  if (authorized) {
    return (
      <div className="container">
        <h1>{currentUser.username}'s writespaces</h1>
        <div>
          <Link className="btn btn-primary" to={"../writespace"}>
            Create New
          </Link>
        </div>
        <ul>
          {writespaceList &&
            writespaceList.map((item) => (
              <li className="align-left">
                <Link to={`${username}/writespaces/${item.id}`}>
                  {item.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
export default WritespaceList;
