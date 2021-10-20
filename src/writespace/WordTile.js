function WordTile({ word, id }) {
  return (
    <div
      className="WordTile p1"
      style={{ border: "1pt solid black", width: "7rem" }}
      id={id}
    >
      {word}
    </div>
  );
}

export default WordTile;
