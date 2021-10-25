import { useState, useEffect } from "react";
import MagnetikApi from "../api/MagnetikApi";
import { Stage, Group, Layer, Text, Rect } from "react-konva";
// import { Portal } from "react-konva-utils";
import useLocalStorage from "../hooks/useLocalStorage";

/** TODO:
 * - Saving to db for logged-in user
 * - Export as image
 * - Separate layers for poem and unused word tiles with Portal
 * - Improve initial spacing between tiles
 * - Improve Stage sizing (evt listener for window size change, add mins)
 * - Options to fetch more words, shuffle positions, clear and get a new word list
 * - Allow user to update styles
 */

function Writespace() {
  const [wordTiles, setWordTiles] = useLocalStorage("wordTiles");
  const [konvaStyles, setKonvaStyles] = useState({
    stageBgFill: "#d4dddd",
    tileBgFill: "white",
    tileStroke: "#555",
    tileFontSize: 16,
    tileHeight: 30,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
  });

  function calcTileSize(wordLength) {
    return wordLength <= 2
      ? wordLength * konvaStyles.tileFontSize
      : Math.round(wordLength * konvaStyles.tileFontSize * 0.75);
  }

  function tileCoord(dimension) {
    let min = 10;
    let max = dimension - 10;
    return Math.floor(Math.random() * (max - min) + min);
  }

  function makeTileObj({ id, word }) {
    return {
      word: word,
      id: id,
      x: tileCoord(konvaStyles.stageWidth),
      y: tileCoord(konvaStyles.stageHeight),
      width: calcTileSize(word.length),
      isDragging: false,
    };
  }

  const handleDragStart = (e) => {
    const id = e.target.id();
    console.debug("New x, y:", e.target.x(), e.target.y());
    const tiles = {
      ...JSON.parse(wordTiles),
      [id]: {
        ...JSON.parse(wordTiles)[id],
        isDragging: true,
      },
    };

    setWordTiles(JSON.stringify({ ...tiles }));
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const newX = e.target.x();
    const newY = e.target.y();
    console.debug("New x, y:", e.target.x(), e.target.y());
    const tiles = {
      ...JSON.parse(wordTiles),
      [id]: {
        ...JSON.parse(wordTiles)[id],
        x: newX,
        y: newY,
        isDragging: false,
      },
    };

    setWordTiles(JSON.stringify({ ...tiles }));
  };

  function renderWordTiles(tiles) {
    let tileArr = [];
    for (let id in tiles) {
      tileArr.push(
        <Group
          draggable
          id={`${id}`}
          key={`${id}`}
          x={tiles[id]["x"]}
          y={tiles[id]["y"]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          scaleX={tiles[id]["isDragging"] ? 1.05 : 1}
          scaleY={tiles[id]["isDragging"] ? 1.05 : 1}
        >
          <Rect
            width={tiles[id]["width"]}
            height={konvaStyles.tileHeight}
            fill="white"
            stroke="#555"
          />
          <Text
            text={tiles[id]["word"]}
            width={tiles[id]["width"]}
            align="center"
            fontSize={konvaStyles.tileFontSize}
            fontFamily="monospace"
            offsetY={-8}
          />
        </Group>
      );
    }
    return tileArr;
  }

  async function fetchWordList() {
    try {
      let wordList = await MagnetikApi.getWordList();
      return wordList;
    } catch (err) {
      console.error("Writespace fetchWordList", err);
    }
  }

  useEffect(function loadWordList() {
    console.debug("Writespace useEffect loadWordList");
    if (!wordTiles) {
      fetchWordList().then((res) => {
        let tiles = {};
        for (let wordObj of res) {
          let tile = makeTileObj(wordObj);
          tiles[wordObj["id"]] = tile;
        }
        setWordTiles(JSON.stringify({ ...tiles }));
      });
    }
  }, []);

  if (!wordTiles) return <h1>Loading...</h1>;

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect
          fill={konvaStyles.stageBgFill || "#b6bbc2"}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        {wordTiles && renderWordTiles(JSON.parse(wordTiles))}
      </Layer>
    </Stage>
  );
}

export default Writespace;
