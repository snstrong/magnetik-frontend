import { useState, useEffect } from "react";
import MagnetikApi from "../api/MagnetikApi";
import WordDrawer from "./WordDrawer";

function Writespace() {
  const [wordList, setWordList] = useState(null);

  useEffect(function loadWordList() {
    console.debug("Writespace useEffect loadWordList");
    async function fetchWordList() {
      try {
        let wl = await MagnetikApi.getWordList();
        setWordList(wl);
      } catch (err) {
        console.error("Writespace useEffect fetchWordList");
      }
    }
    fetchWordList();
  }, []);

  if (!wordList) return <h1>Loading...</h1>;

  return (
    <div className="container">
      <div style={{ height: "400px", backgroundColor: "aliceblue" }}></div>
      <WordDrawer wordList={wordList} />
    </div>
  );
}

export default Writespace;
