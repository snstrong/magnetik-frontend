import { useState, useContext, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./WritespaceList.css";

function WritespaceList() {
  const { currentUser } = useContext(UserContext);
  const { username } = useParams();
  const history = useHistory();
  const [authorized, setAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(
    function authorize() {
      try {
        if (username && currentUser.username !== username) {
          throw new Error("Unauthorized.");
        }
        setAuthorized(true);
        setIsLoaded(true);
      } catch (errors) {
        console.error(errors);
        history.push("/");
      }
      return () => {
        setAuthorized(false);
        setIsLoaded(false);
      };
    },
    [currentUser, username]
  );

  if (!authorized || !isLoaded) return <h1>Loading...</h1>;

  if (authorized && isLoaded) {
    return (
      <div className="WritespaceList container-fluid">
        <div className="WritespaceList-wrapper rounded">
          <h1>{currentUser.username}'s writespaces</h1>
          <div className="pt-2 pb-4">
            <Link className="btn btn-primary" to={"../writespace"}>
              Create New
            </Link>
          </div>
          <ul className="WritespaceList-ul py-3 rounded">
            {currentUser.writespaces &&
              currentUser.writespaces.map((writespace) => (
                <li className="align-left pb-2" key={writespace.writespaceId}>
                  <Link
                    to={`/${username}/writespaces/${writespace.writespaceId}`}
                  >
                    {writespace.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default WritespaceList;
