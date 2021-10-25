import "./Homepage.css";

function Homepage() {
  return (
    <div className="Homepage">
      <div className="container p-5">
        <div className="row">
          <div className="col-md-8 mx-auto my-auto p-5">
            <h1 className="Homepage-brand">Magnetik</h1>
            <h2 className="Homepage-tagline pb-3">
              Leave your word choice to chance.
            </h2>
            <a className="btn btn-primary" href="/writespace">
              Write a Poem
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
