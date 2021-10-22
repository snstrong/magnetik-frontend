import { Layer, Text, Rect } from "react-konva";

function WordTile({ word, id, x, y }) {
  //   return (
  //     <div
  //       className="WordTile p-1 d-inline"
  //       style={{ border: "1pt solid black" }}
  //       id={id}
  //     >
  //       {word}
  //     </div>
  //   );

  return (
    <Layer draggable id={id}>
      <Rect
        x={x}
        y={y}
        width={word.length * 12}
        height={35}
        stroke="#555"
        fill="white"
      />
      <Text
        x={x}
        y={y}
        text={word}
        align="center"
        padding={5}
        fontSize={14}
        width={word.length * 10}
      />
    </Layer>
  );
}

export default WordTile;
