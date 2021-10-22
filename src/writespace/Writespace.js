import { useState, useEffect } from "react";
import MagnetikApi from "../api/MagnetikApi";
import { Stage, Group, Layer, Text, Rect } from "react-konva";
import { Portal } from "react-konva-utils";

/** TODO:
 * - Update state when x,y of word tile changes
 * - Handlers for drag events (see https://codesandbox.io/s/github/konvajs/site/tree/master/react-demos/basic_demo?from-embed=&file=/src/index.js)
 * - Saving to LocalStorage and/or db
 * - Export as image
 * - Separate layers for poem and unused word tiles with Portal
 * - Improve initial spacing between tiles
 * - Improve sizing for word tiles
 * - Make size of Stage dynamic
 */

function Writespace() {
  const [wordList, setWordList] = useState(null);
  const [wordTiles, setWordTiles] = useState(null);

  useEffect(function loadWordList() {
    console.debug("Writespace useEffect loadWordList");
    async function fetchWordList() {
      try {
        let wl = await MagnetikApi.getWordList();
        setWordList(wl);
        let tiles = {};
        for (let wordObj of wl) {
          let { id, word } = wordObj;
          tiles[id] = {
            word: word,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          };
        }
        setWordTiles({ ...tiles });
      } catch (err) {
        console.error("Writespace useEffect fetchWordList", err);
      }
    }
    fetchWordList();
  }, []);

  if (!wordList || !wordTiles) return <h1>Loading...</h1>;

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect
          fill="#b6bbc2"
          width={window.innerWidth}
          height={window.innerHeight}
        />
        {/* TODO: Refactor this as function iterating over objects in wordTiles */}
        {wordList.map((wordObj) => {
          return (
            <Group
              draggable
              id={`${wordObj.id}`}
              key={`${wordObj.id}`}
              x={Math.random() * (window.innerWidth - 20)}
              y={Math.random() * (window.innerHeight - 20)}
            >
              <Rect
                width={
                  wordObj.word.length <= 2
                    ? wordObj.word.length * 15
                    : wordObj.word.length * 12
                }
                height={30}
                stroke="#555"
                fill="white"
              />
              <Text
                text={wordObj.word}
                width={
                  wordObj.word.length <= 2
                    ? wordObj.word.length * 16
                    : wordObj.word.length * 12
                }
                align="center"
                fontSize={16}
                fontFamily="monospace"
                offsetY={-8}
              />
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}

export default Writespace;
