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
import { BiLoaderCircle } from "react-icons/bi"

function Home() {
  //games are a snapshot
  const [games, setGames] = useState<Game[]>([]);
  const [gameRef, setGameRef] = useState<QuerySnapshot>([] as any);

  const [page, setPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const pageSize = 8;

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
    <div className="main">
      <div>


        {games.length > 0 ?
          (<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 mx-5 my-10 ">
            {games.map((doc) => (
              <PreviewGame key={doc?.id} game={doc as Game} />
            ))}
          </div>) : (
            <div className="main flex justify-center items-center">
              <BiLoaderCircle className="loader-anim" size={150} />
            </div>
          )}

        {page * pageSize - 1 < gameRef.docs?.length && (
          <div className="flex justify-center my-10">
            <div className="flex justify-center">
              <button
                className="transition-all duration-500 hover:scale-125  active:scale-90 active:bg-blue-700 h-20 w-40 bg-blue-500 hover:bg-blue-300 text-white font-bold p-3 z-10 rounded-lg"
                onClick={getNextPage}
              >
                Next Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
