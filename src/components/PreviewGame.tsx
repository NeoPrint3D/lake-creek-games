import { Link } from "react-router-dom";
import { firestore } from "../utils/firebase";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/user";
import {
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import Img from "react-cool-img";
import placeholder from "../assets/placeholder.png";
import {
  FaHeart,
  FaCircle,
  FaEye,
  FaDownload,
} from "react-icons/fa";



function PreviewGame({ game }: { game: Game }) {
  const user = useContext<User>(UserContext);
  const [liked, setLiked] = useState(false);



  useEffect(() => {
    user.likedGames.includes(game.id) && setLiked(true);
  }, [user.likedGames, game.id]);

  const handleLike = async () => {
    if (liked) {
      updateDoc(doc(firestore, `games`, game.id), {
        likedBy: arrayRemove(user.uid),
        likes: increment(-1),
      });
      updateDoc(doc(firestore, `users`, user.uid), {
        likedGames: arrayRemove(game.id),
      });
    } else {
      updateDoc(doc(firestore, `games`, game.id), {
        likedBy: arrayUnion(user.uid),
        likes: increment(1),
      });
      updateDoc(doc(firestore, `users`, user.uid), {
        likedGames: arrayUnion(game.id),
      });
    }
    setLiked(!liked);
  };

  return (
    <div className="grid grid-cols-5 bg-gradient text-white rounded-xl min-h-[10rem] sm:min-h-[15em] indicator p-5 w-11/12 justify-self-center z-0">
      <div
        className=" indicator-item indicator-start tooltip tooltip-right tooltip-white "
        data-tip={game.indexed ? "indexed" : "not indexed"}
      >
        <FaCircle
          size={25}
          className={`  ${game.indexed ? "text-green-400/80" : "text-red-500/80"
            }`}
        ></FaCircle>
      </div>

      <div className="grid grid-rows-5 items-center p-3 col-span-3">
        <div className="flex flex-col items-center row-span-2">
          <div className="flex justify-center items-center mb-3">
            <Link to={`/games/${game.id}`} className="text-2xl sm:text-5xl font-bold font-refuni">
              {`${game.title}`.replace(/\w\S*/g, (txt) => {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              })}
            </Link>
          </div>
          <div className="flex justify-center items-center gap-3">
            <h5 className=" sm:text-xl font-refuni font-bold">
              By: {game.authorName}
            </h5>
            <img
              src={game.authorPhoto}
              className="rounded-full h-6 w-6 sm:h-10 sm:w-10 "
              alt=""
            />
          </div>
        </div>

        <div></div>
        <div className=" flex justify-evenly items-center row-span-2 h-full ">
          <button
            className="group"
            onClick={() => handleLike()}
            disabled={!user?.uid}
          >
            <h5 className="text-3xl font-extrabold">{game.likes}</h5>
            <FaHeart
              size={30}
              className={`transition-all group-disabled:text-slate-400/90 text-white h-8 w-8 sm:w-10 sm:h-12 active:scale-90 ${liked
                ? "text-red-400 group-disabled:scale-100 hover:scale-95"
                : "text-white group-disabled:scale-100 hover:scale-105"
                }`}
            />
          </button>

          <div className="flex  flex-col items-center">
            <h5 className="text-3xl font-extrabold">{game.views}</h5>
            <FaEye size={30} className="h-14 w-12" />
          </div>

          <div className="flex  flex-col items-center">
            <h5 className="text-3xl font-extrabold">{game.views}</h5>
            <FaDownload size={30} className="h-14 w-10" />
          </div>
        </div>
      </div>

      <Link
        className="flex items-center justify-end col-span-2"
        to={`/game/${game.id}`}
      >
        <Img
          height={300}
          width={300}
          alt={game.title}
          src={game.thumbnail}
          placeholder={placeholder}
          className=" transition-transform max-w-24 w-auto h-auto rounded-r-xls hover:scale-95 fade-in"
        />
      </Link>
    </div>
  );
}

export default PreviewGame;
