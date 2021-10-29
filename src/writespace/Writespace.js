import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import MagnetikApi from "../api/MagnetikApi";
import { Stage, Group, Layer, Text, Rect } from "react-konva";
// import { Portal } from "react-konva-utils";
import useLocalStorage from "../hooks/useLocalStorage";
import UserContext from "../auth/UserContext";
import NewWritespaceForm from "./NewWritespaceForm";
import Alert from "../common/Alert";
import "./Writespace.css";

/** TODO:
 *
 * - Saving to db for logged-in user
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
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { username, writespaceId } = useParams();
  const [wordTiles, setWordTiles] = useLocalStorage("wordTiles");
  const [alerts, setAlerts] = useState([]);
  const history = useHistory();

  // State for existing writespace
  const [writespace, setWritespace] = useState(null);

  const INITIAL_KONVA_STYLES = {
    stageBgFill: "#d4dddd",
    tileBgFill: "white",
    tileStroke: "#555",
    tileFontSize: 16,
    tileHeight: 30,
    stageWidth: 1000,
    stageHeight: 1000,
  };
  const [konvaStyles, setKonvaStyles] = useState({ ...INITIAL_KONVA_STYLES });
  const [reset, setReset] = useState();
  const [displayForm, setDisplayForm] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  function calcTileSize(wordLength) {
    return wordLength <= 2
      ? wordLength * konvaStyles.tileFontSize
      : Math.round(wordLength * konvaStyles.tileFontSize * 0.75);
  }

  function tileCoord(dimension) {
    let min = 30;
    let max = dimension - 30;
    return Math.floor(Math.random() * (max - min) + min);
  }

  function makeTileObj({ id, wordId, word, x, y }) {
    return {
      word: word,
      id: id || wordId,
      x: parseInt(x) || tileCoord(konvaStyles.stageWidth),
      y: parseInt(y) || tileCoord(konvaStyles.stageHeight),
      width: calcTileSize(word.length),
      isDragging: false,
    };
  }

  const handleDragStart = (e) => {
    const id = e.target.id();
    // console.debug("Dragging ", JSON.parse(wordTiles)[id].word);
    const tiles = {
      ...JSON.parse(wordTiles),
      [id]: {
        ...JSON.parse(wordTiles)[id],
        isDragging: true,
      },
    };
    setWordTiles(JSON.stringify({ ...tiles }));
  };

  async function handleDragEnd(e) {
    const id = e.target.id();
    const newX = e.target.x();
    const newY = e.target.y();
    // console.debug("Dropping ", JSON.parse(wordTiles)[id].word);
    // console.debug(
    //   "Old x,y=",
    //   JSON.parse(wordTiles)[id].x,
    //   JSON.parse(wordTiles)[id].y
    // );
    // console.debug("New x,y=", newX, newY);
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
  }

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

  async function getNewWordList() {
    try {
      let wordList = await MagnetikApi.getWordList();
      return wordList;
    } catch (err) {
      console.error("Writespace fetchWordList", err);
    }
  }

  async function getExistingWritespace() {
    let requestData = {
      username: currentUser.username,
      writespaceId: writespaceId,
    };
    try {
      let res = await MagnetikApi.getWritespace(requestData);
      return res;
    } catch (errors) {
      console.error(`Error getting writespace:`, errors);
    }
  }

  useEffect(
    function authorize() {
      try {
        if (username && currentUser.username !== username) {
          throw new Error("Unauthorized.");
        }
        setAuthorized(true);
      } catch (errors) {
        console.error(errors);
        history.push("/");
      }
      return () => {
        setWritespace(null);
        setWordTiles(null);
      };
    },
    [currentUser, username]
  );

  useEffect(
    function loadWritespaceData() {
      // console.debug("Writespace useEffect loadWordList wordTiles=", wordTiles);

      if (writespaceId) {
        async function getWritespace() {
          let res = await getExistingWritespace();
          setWritespace({ ...res.writespace });
          let tiles = {};
          for (let entry of res.writespaceData) {
            tiles[entry.wordId] = makeTileObj(entry);
          }
          // console.debug(tiles);
          setWordTiles(JSON.stringify({ ...tiles }));
        }
        getWritespace();
      } else {
        if (!wordTiles || reset === true || (currentUser && !writespaceId)) {
          getNewWordList().then((res) => {
            let tiles = {};
            for (let wordObj of res) {
              let tile = makeTileObj(wordObj);
              tiles[wordObj["id"]] = tile;
            }
            setWordTiles(JSON.stringify({ ...tiles }));
          });
        }
        setReset(false);
      }
    },
    [reset, writespaceId, currentUser]
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
        width: konvaStyles.stageWidth,
        height: konvaStyles.stageHeight,
      };

      let created = await MagnetikApi.createWritespace(writespaceData);
      let populated = await MagnetikApi.populateWritespace({
        writespaceId: created.writespace.writespaceId,
        username: created.writespace.username,
        wordTiles: { ...JSON.parse(wordTiles) },
      });
      setDisplayForm(false);
      setCurrentUser({
        ...currentUser,
        writespaces: [...currentUser.writespaces, { ...created.writespace }],
      });

      return { ...populated };
    } catch (errors) {
      console.error(errors);
      return { errors };
    }
  }

  async function saveExistingWritespace() {
    try {
      let writespaceData = {
        writespaceId: writespaceId,
        username: currentUser.username,
        wordTiles: { ...JSON.parse(wordTiles) },
      };

      let updated = await MagnetikApi.updateWritespace({ writespaceData });
      setAlerts([
        {
          type: "success",
          messages: ["Save successful."],
          updated: updated,
        },
      ]);
      return updated;
    } catch (errors) {
      console.error(errors);
    }
  }

  useEffect(() => {
    if (alerts.length) {
      setTimeout(() => {
        setAlerts([]);
      }, 4000);
    }
    if (displayForm) {
      setTimeout(() => {
        setDisplayForm(false);
      }, 10000);
    }
  }, [alerts, displayForm]);

  if (!wordTiles || !authorized) return <h1>Loading...</h1>;
  if (authorized) {
    return (
      <div className="Writespace">
        {writespace
          ? writespace.title && (
              <h1 className="pt-3 mb-0">{writespace.title}</h1>
            )
          : null}
        <div
          className="WritespaceToolbar container-fluid"
          style={{ backgroundColor: "#8da5a5" }}
        >
          <div className="row justify-content-center pb-4 pt-4">
            {writespaceId && (
              <button
                className="btn btn-primary col-6 col-sm-4 col-md-3 col-lg-2"
                onClick={async () => {
                  await saveExistingWritespace();
                }}
              >
                Save
              </button>
            )}
            {currentUser && (
              <button
                className={`btn ${
                  writespaceId ? "btn-secondary" : "btn-primary"
                } col-6 col-sm-4 col-md-3 col-lg-2`}
                onClick={() => {
                  displayForm ? setDisplayForm(false) : setDisplayForm(true);
                }}
              >
                Save As
              </button>
            )}
            {!writespaceId && (
              <button
                type="reset"
                className="btn btn-secondary col-6 col-sm-4 col-md-3 col-lg-2"
                onClick={() => setReset(true)}
              >
                Get New Words
              </button>
            )}
            <button
              type="reset"
              className="btn btn-light col-6 col-sm-4 col-md-3 col-lg-2"
              onClick={scramble}
            >
              Rearrange
            </button>
          </div>
          {displayForm && (
            <NewWritespaceForm
              createNewWritespace={createNewWritespace}
              hide={displayForm}
            />
          )}
          {alerts.length
            ? alerts.map((alert) => {
                return (
                  <Alert
                    type={alert.type}
                    messages={alert.messages}
                    key={Math.floor(Math.random() * 10)}
                  />
                );
              })
            : null}
        </div>
        <div className="Stage-container">
          <div className="Stage-wrapper">
            <Stage
              width={konvaStyles.stageWidth}
              height={konvaStyles.stageHeight}
            >
              <Layer>
                <Rect
                  fill={konvaStyles.stageBgFill || "#b6bbc2"}
                  width={konvaStyles.stageWidth}
                  height={konvaStyles.stageHeight}
                />
                {wordTiles && renderWordTiles(JSON.parse(wordTiles))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    );
  }
}

export default Writespace;
