import { useState, useContext, useEffect } from "react";
import { SignIn, SignOut } from "./components/GoogleButtons";
import { db, auth } from "./utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";

function App() {
  const [user, setUser] = useState({
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [games, setGames] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((res) => {
      {
        res
          ? getDoc(doc(db, "users", res.uid)).then((doc) => {
              setUser({
                uid: doc.data()?.uid,
                displayName: doc.data()?.displayName,
                email: doc.data()?.email,
                photoURL: doc.data()?.photoURL,
              });
            })
          : setUser({
              uid: "",
              displayName: "",
              email: "",
              photoURL: "",
            });
      }
    });
  }, [auth.currentUser]);

  useEffect(() => {
    getDocs(collection(db, "games")).then((res) => {
      setGames(res.docs.map((doc) => doc.data()));
      console.log(games);
    });
  }, [auth.currentUser]);

  return (
    <div className="bg-gradient-to-tr from-blue-500 to-purple-900 h-screen  overflow-y-auto ">
      <header className="grid grid-cols-3 h-24 items-center bg-gradient-to-b from-yellow-400 to-yellow-200 rounded-b-xl">
        <div className="ml-3">{!user.uid ? <SignIn /> : <SignOut />}</div>
        <h1 className="text-4xl font-bold text-center">Lake Creek Games</h1>

        <div className=" flex justify-end mr-3">
          <img className="rounded-full h-16" src={user.photoURL} alt="" />
        </div>
      </header>
      <main>
        {games.map((game) => (
          <div className="bg-white shadow-lg rounded-lg p-4 m-4">
            <h2 className="text-2xl font-bold">{game.name}</h2>
            <img src={game.img} alt="" />
            <p>{game.description}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
