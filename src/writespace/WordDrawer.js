import WordTile from "./WordTile";

function WordDrawer({ wordList }) {
  let tiles = [];
  for (let w of wordList) {
    tiles.push(<WordTile word={w.word} id={w.id} />);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignContent: "space-evenly",
      }}
      className="WordDrawer"
    >
      {tiles}
    </div>
  );
}

export default WordDrawer;
