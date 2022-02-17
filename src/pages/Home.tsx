import { db } from "../utils/firebase";
import {
  getDocs,
  collection,
  orderBy,
  limit,
  query,
  startAfter,
  QuerySnapshot,
} from "firebase/firestore/lite";
import { useState, useEffect } from "react";

import PreviewGame from "../components/PreviewGame";

function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameRefs, setGameRefs] = useState<QuerySnapshot>(null as any);
  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const pageSize = 2;

  async function getInititialGame() {
    const documentSnapshot = await getDocs(
      query(collection(db, "games"), orderBy("id", "desc"), limit(pageSize))
    );
    return documentSnapshot;
  }

  async function getNextPage() {
    const documentSnapshot = await getDocs(
      query(
        collection(db, "games"),
        orderBy("id", "desc"),
        limit(pageSize),
        startAfter(gameRefs.docs[gameRefs.docs.length - 1])
      )
    );
    return documentSnapshot;
  }

  useEffect(() => {
    getInititialGame().then((documentSnapshot) => {
      setGameRefs(documentSnapshot);
      setEndPage(Math.ceil(documentSnapshot.size / pageSize));
      setGames(documentSnapshot.docs.map((doc) => doc.data()) as Game[]);
      console.log(page < endPage);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 mx-5 my-10">
        {games.map((game) => (
          <PreviewGame game={game} />
        ))}
      </div>

      {page < endPage && (
        <button
          className="text-xl bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            getNextPage().then((documentSnapshot) => {
              setGameRefs(documentSnapshot);
              setEndPage(Math.ceil(documentSnapshot.size / pageSize));
              setGames([
                ...games,
                ...(documentSnapshot.docs.map((doc) => doc.data()) as Game[]),
              ]);
              setPage(page + 1);
            });
          }}
        >
          More
        </button>
      )}
    </div>
  );
}

export default Home;
