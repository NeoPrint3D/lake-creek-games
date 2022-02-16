import { db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore/lite";
import { useState, useEffect } from "react";

function Home() {
  const [games, setGames] = useState<Game[]>([]);
  
  useEffect(() => {
    getDocs(collection(db, "games")).then((res) => {
      setGames(res.docs.map((doc) => doc.data()) as Game[]);
      console.log(games);
    });

  }, []);

  return <main></main>;
}

export default Home;
