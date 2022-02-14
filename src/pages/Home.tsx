import { db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore/lite";
import { useState, useEffect } from "react";

function Home() {
  const [games, setGames] = useState<Game[]>([]);
  
  useEffect(() => {
    ""
  }, []);

  return <main></main>;
}

export default Home;
