import { firestore } from "../utils/firebase";
import {
  collection,
  orderBy,
  limit,
  query,
  startAfter,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import PreviewGame from "../components/PreviewGame";

function Home() {
  //games are a snapshot
  const [games, setGames] = useState<Game[]>([]);
  const [gameRef, setGameRef] = useState<QuerySnapshot>([] as any);

  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const pageSize = 4;

  async function getNextPage() {
    const q = query(
      collection(firestore, "games"),
      orderBy("id", "desc"),
      limit(pageSize),
      startAfter(lastDoc)
    );
    const documentSnapshot = onSnapshot(q, (snapshot) => {
      //combine the old snapshot with the new one
      const stuff = snapshot.docs.map((doc) => doc.data());
      setGames([...games, ...stuff] as Game[]);
      setGameRef(snapshot);
      setPage(page + 1);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    });
    return documentSnapshot;
  }

  useEffect(() => {
    const q = query(
      collection(firestore, "games"),
      orderBy("id", "desc"),
      limit(pageSize)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGameRef(snapshot);
      setGames(snapshot.docs.map((doc) => doc.data()) as any);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className="min-h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 mx-5 my-10">
        {games.map((doc) => (
          <PreviewGame key={doc?.id} game={doc as Game} />
        ))}
      </div>

      {page * pageSize < gameRef.docs?.length && (
        <div className="flex justify-center">
          <div className="group flex justify-center">
            <button
              className="h-20 w-40 bg-blue-500 group-hover:bg-blue-700 text-white font-bold p-3 z-10 rounded-lg"
              onClick={getNextPage}
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
