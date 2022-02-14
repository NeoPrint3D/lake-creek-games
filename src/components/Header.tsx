import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../contexts/user";

import { SignIn, SignOut } from "../components/GoogleButtons";
import { MdCloudUpload } from "react-icons/md";
import { Link } from "react-router-dom";

function Header() {
  const user = useContext(UserContext);

 
     
  
  return (
    <header className="grid grid-cols-3 h-24 items-center bg-gradient-to-b from-yellow-500 to-yellow-400 rounded-b-xl">
      <div className="ml-3">{!user?.uid ? <SignIn /> : <SignOut />}</div>
      <Link to="/" className="text-4xl font-bold text-center text-white">
        Lake Creek Games
      </Link>

      <div className=" flex justify-end mr-3">
        {user?.uid && (
          <div className="flex items-center gap-10">
            <Link to="/upload">
              <MdCloudUpload className="text-6xl text-blue-500 hover:text-blue-900" />{" "}
            </Link>

            <Link
              to={
                user?.role === "admin" ||
                user?.uid === import.meta.env.VITE_ADMIN_UID
                  ? "/admin"
                  : "/"
              }
            >
              <img className="rounded-full h-16" src={user?.photoURL} alt="" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
