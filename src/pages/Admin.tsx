import { useState, useContext, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore/lite";
import { UserContext } from "../contexts/user";

function Admin() {
  const currentUser = useContext(UserContext);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selected, setSelected] = useState("games");

  useEffect(() => {
    {
      selected === "games"
        ? getDocs(collection(db, "pendingGames")).then((res) => {
            setGames(res.docs.map((doc) => doc.data()) as Game[]);
          })
        : getDocs(collection(db, "users")).then((res) => {
            setUsers(res.docs.map((doc) => doc.data()) as User[]);
          });
    }
  }, [selected]);

  return (
    <div className=" min-h-screen">
      {currentUser?.role === "admin" ||
      currentUser?.uid === import.meta.env.VITE_ADMIN_UID ? (
        <div className="flex flex-col my-5">
          <div className="flex justify-center">
            <select
              className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4"
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="game">Games</option>
              <option value="user">Users</option>
            </select>
          </div>
          <div>
            {selected === "games" ? (
              <div className="flex flex-col items-center">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-col bg-blue-500 rounded-2xl w-3/4 p-5 my-5"
                  >
                    <div className="flex justify-center">
                      <h5>{game.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {users.map((user) => (
                  <div key={user.uid} className="flex flex-col my-5">
                    <div className="flex justify-center">
                      <img
                        className="rounded-full h-16"
                        src={user.photoURL}
                        alt=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <main>
          <h1>You are not authorized to view this page</h1>
        </main>
      )}
    </div>
  );
}

export default Admin;
