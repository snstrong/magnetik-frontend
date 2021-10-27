import { useState, useEffect, useContext } from "react";
import MagnetikApi from "../api/MagnetikApi";
import { Stage, Group, Layer, Text, Rect } from "react-konva";
// import { Portal } from "react-konva-utils";
import useLocalStorage from "../hooks/useLocalStorage";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";
import NewWritespaceForm from "./NewWritespaceForm";

/** TODO:
 *
 * - Saving to db for logged-in user
 * - Allow user to name writespace, provide default "Untitled [1,2...]"
 * - Export as image
 * - Separate layers for poem and unused word tiles with Portal
 * - Improve initial spacing between tiles
 * - Improve Stage sizing (evt listener for window size change, add mins)
 * - Resize font, tiles for small screens
 * - Option to fetch more words
 * - Allow user to update styles
 * - Allow word grouping/multi select
 */

function Writespace() {
  const { currentUser } = useContext(UserContext);
  // get writespace id somehow and use to set/retrieve tile data
  const [wordTiles, setWordTiles] = useLocalStorage("wordTiles");
  const [konvaStyles, setKonvaStyles] = useState({
    stageBgFill: "#d4dddd",
    tileBgFill: "white",
    tileStroke: "#555",
    tileFontSize: 16,
    tileHeight: 30,
    stageWidth: Math.max([window.innerWidth, 1000]),
    stageHeight: Math.max([window.innerHeight, 1000]),
  });
  const [reset, setReset] = useState(false);
  const [alert, setAlert] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);

  function calcTileSize(wordLength) {
    return wordLength <= 2
      ? wordLength * konvaStyles.tileFontSize
      : Math.round(wordLength * konvaStyles.tileFontSize * 0.75);
  }

  function tileCoord(dimension) {
    let min = 20;
    let max = dimension - 20;
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

  useEffect(
    function loadWordList() {
      // console.debug("Writespace useEffect loadWordList wordTiles=", wordTiles);
      if (!wordTiles || reset === true) {
        fetchWordList().then((res) => {
          let tiles = {};
          for (let wordObj of res) {
            let tile = makeTileObj(wordObj);
            tiles[wordObj["id"]] = tile;
          }
          setWordTiles(JSON.stringify({ ...tiles }));
        });
      }
      setReset(false);
    },
    [reset]
  );

  function scramble() {
    const tiles = { ...JSON.parse(wordTiles) };

    for (let id in tiles) {
      tiles[id] = {
        ...JSON.parse(wordTiles)[id],
        x: tileCoord(konvaStyles.stageWidth),
        y: tileCoord(konvaStyles.stageHeight),
      };
    }
    setWordTiles(JSON.stringify({ ...tiles }));
  }

  async function createNewWritespace(formData) {
    if (!currentUser) return;
    try {
      let writespaceData = {
        title: formData.title,
        username: currentUser.username,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      let res = await MagnetikApi.createWritespace(writespaceData);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  if (!wordTiles) return <h1>Loading...</h1>;

  return (
    <div className="Writespace">
      <div
        className="WritespaceToolbar p-3 container-fluid"
        style={{ backgroundColor: "#8da5a5" }}
      >
        <div className="row">
          {currentUser && (
            <button
              className="btn btn-primary col-2 col-md-4 col-sm-6"
              onClick={() => {
                // setAlert(true);
                setDisplayForm(true);
                // setTimeout(() => {
                //   setAlert(false);
                //   setDisplayForm(false);
                // }, 2000);
              }}
            >
              Save
            </button>
          )}
          <button
            type="reset"
            className="btn btn-secondary col-2 col-md-4 col-sm-6"
            onClick={() => setReset(true)}
          >
            Reset
          </button>
          <button
            type="reset"
            className="btn btn-light col-2 col-md-4 col-sm-6"
            onClick={scramble}
          >
            Scramble
          </button>
        </div>
        {displayForm && (
          <NewWritespaceForm
            createNewWritespace={createNewWritespace}
            hide={displayForm}
          />
        )}
        {alert && (
          <Alert
            messages={["Currently unavailable. Please try again later."]}
          ></Alert>
        )}
      </div>
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
    </div>
  );
}

export default Writespace;
