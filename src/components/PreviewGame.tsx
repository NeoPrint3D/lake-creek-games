import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { UserContext } from "../contexts/user";

function PreviewGame({ game }: { game: Game }) {
  return (
    <div className="grid grid-cols-2 bg-yellow-300 text-white rounded-2xl">
      <div className="flex flex-col items-center p-3">
        <h1 className="text-5xl">
          {`${game.title}`.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          })}
        </h1>
        <p>{game.authorName}</p>
      </div>

      <Link className="flex justify-end" to={`/game/${game.id}`}>
        <img
          className=" transition-transform max-w-24 w-3/4 rounded-r-2xl hover:scale-95"
          src={game.thumbnail}
          alt=""
        />
      </Link>
    </div>
  );
}

export default PreviewGame;
