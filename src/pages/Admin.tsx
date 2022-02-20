import { useState, useContext, useEffect } from "react";
import { auth, firestore, storage } from "../utils/firebase";
import {
  getDocs,
  collection,
  serverTimestamp,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { UserContext } from "../contexts/user";
import {
  ref,
  getBytes,
  deleteObject,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";

import sendEmail from "../utils/sendEmail";
import { encrypt } from "../utils/encryption";
import { createIndex } from "../utils/indexer";

function Admin() {
  const currentUser = useContext(UserContext);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [progress, setProgress] = useState(0);

  const [selected, setSelected] = useState("games");

  function denyGame(game: Game) {
    //delete the game and send a notification to the user
    if (window.confirm("Are you sure you want to deny this game?")) {
      deleteDoc(doc(firestore, "pendingGames", game.id));
      deleteObject(ref(storage, `pendingGames/${game.id}`));
      sendEmail(
        game.authorEmail,
        "Your game request has been denied",
        `Your game request for ${game.title} has been denied if you have any questions please email lakecreekgames@gmail.com.`
      );
    }
  }

  async function deleteFolder(path: string) {
    const list = await listAll(ref(storage, path));
    for (const item of list.items) {
      await deleteObject(item);
    }
  }

  async function approveGame(game: Game) {
    //replace all spaces with dash and make lowercase
    async function getGameurl() {
      const newTitle = game.title.replace(/\s+/g, "-").toLowerCase();

      const newGame = await getBytes(
        ref(storage, `pendingGames/${game.id}/${newTitle}.zip`)
      );
      await uploadBytes(
        ref(storage, `approvedGames/${game.id}/${newTitle}.zip`),
        newGame
      );
      const newGameUrl = await getDownloadURL(
        ref(storage, `approvedGames/${game.id}/${newTitle}.zip`)
      );
      return newGameUrl;
    }

    //see if the game has a thumbnail

    async function getThumbnailUrl() {
      const newThumbnail = await getBytes(
        ref(storage, `pendingGames/${game.id}/thumbnail.png`)
      );
      await uploadBytes(
        ref(storage, `approvedGames/${game.id}/thumbnail.png`),
        newThumbnail
      );
      const newThumbnailUrl = await getDownloadURL(
        ref(storage, `approvedGames/${game.id}/thumbnail.png`)
      );
      return newThumbnailUrl;
    }

    const object: Game = {
      author: game.author,
      authorName: game.authorName,
      authorPhoto: game.authorPhoto,
      authorEmail: game.authorEmail,
      title: game.title,
      description: game.description,
      thumbnail: await getThumbnailUrl(),
      gameFileUrl: await getGameurl(),
      createdAt: game.createdAt,
      id: game.id,
      likedBy: [],
      downloads: 0,
      likes: 0,
      dislikes: 0,
      views: 0,
      indexed: false,
    };

    await setDoc(doc(firestore, "games", game.id), object);

    await createIndex(game.id);

    await deleteFolder(`pendingGames/${game.id}`);
    await deleteDoc(doc(firestore, "pendingGames", game.id));

    sendEmail(
      game.authorEmail,
      "Your game request has been approved",
      `Your game request for ${game.title} has been approved if you have any questions please email lakecreekgames@gmail.com.`
    );
    //remove the game from the dom
    setGames(games.filter((g) => g.id !== game.id));
  }

  useEffect(() => {
    if (selected === "games" && games.length === 0) {
      getDocs(collection(firestore, "pendingGames")).then((res) => {
        setGames(res.docs.map((doc) => doc.data()) as Game[]);
        console.log(games);
      });
    } else if (selected === "users" && users.length === 0) {
      //get all users
      getDocs(collection(firestore, "users")).then((res) => {
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
              <option value={"games"}>Games</option>
              <option value={"users"}>Users</option>
            </select>
          </div>

          <div>
            {selected === "games" ? (
              <div className="flex flex-col items-center justify-center">
                {games.map((game) => (
                  <div className="flex flex-col my-5">
                    <div className="flex justify-center">
                      <h1 className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4">
                        {game.title}
                      </h1>
                      {game.id}
                    </div>
                    <div className="flex">
                      <button onClick={() => approveGame(game)}>Approve</button>
                    </div>
                    <div></div>
                    <div className="flex justify-center">
                      <h1 className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4">
                        {game.description}
                      </h1>
                    </div>
                    <div className="flex justify-center">
                      <img className="w-3/4" src={game.thumbnail} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {users.map((user) => (
                  <div className="flex flex-col my-5 bg-yellow-500 w-3/4 p-5 rounded-2xl">
                    <div className="flex justify-center">
                      <h1 className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4">
                        {user.name}
                      </h1>
                    </div>
                    <div className="flex justify-center">
                      <h1 className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4">
                        {user.email}
                      </h1>
                    </div>
                    <div className="flex justify-center">
                      <img src={user.photoURL} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen fixed flex justify-center items-center -translate-y-10">
          <h1 className="text-xl font-bold text-center text-black bg-yellow-300 border-2 border-yellow-500 rounded-full py-2 px-4">
            You are not authorized to view this page
          </h1>
        </div>
      )}
    </div>
  );
}

export default Admin;
