import { useContext } from "react";
import { UserContext } from "../contexts/user";
import { SignIn, SignOut } from "../components/GoogleButtons";
import { MdCloudUpload, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
//@ts-ignore
import Headroom from "react-headroom";

function Header() {
  const user = useContext(UserContext);
  //add sticky to the header when the user scrolls up uing react hooks
  return (
    <Headroom>
      <nav
        className={`w-full grid grid-cols-5 h-20 items-center rounded-b-xl shadow-2xl bg-gradient `}
      >
        <Link
          to="/"
          className="col-span-3  pl-5 text-gradient text-xl sm:text-4xl"
        >
          Lake Creek Games
        </Link>

        <div className="flex justify-end col-span-2">
          {user?.uid ? (
            //if the user is logged in
            <div className="flex items-center gap-1 sm:gap-5">
              <Link to="/search" className="p-1">
                <p className="hidden">search</p>
                <MdSearch
                  className="text-6xl text-blue-400 hover:text-blue-700 h-8 w-8 sm:w-16 sm:h-16"
                  size={60}
                />
              </Link>
              <Link to="/upload" className="p-1">
                <p className="hidden">upload</p>
                <MdCloudUpload
                  className="text-6xl text-blue-400 hover:text-blue-700 h-8 w-8 sm:w-16 sm:h-16"
                  size={60}
                />
              </Link>

              <div className="flex items-center mr-2 hover:bg-yellow-200 p-1 rounded-2xl ">
                <div className="dropdown dropdown-hover dropdown-end">
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-8 w-8  sm:w-16 sm:h-16 rounded-full"
                  />
                  <ul
                    tabIndex={0}
                    className="flex flex-col gap-y-3 dropdown-content w-52  p-3 rounded-2xl shadow-2xl  bg-gradient  "
                  >

                    {(user?.role === "admin" || user?.uid === import.meta.env.VITE_ADMIN_UID) && (


                      <div className="flex justify-center">
                        <Link
                          to="/admin"
                          className="text-white font-bold text-md sm:text-2xl "
                        >
                          Admin
                        </Link>
                      </div>
                    )}


                    <div className="flex justify-center text-md sm:text-2xl">
                      <SignOut />
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            //non logged in user
            <div className="flex items-center mr-5 gap-5">
              <Link to="/search" className="p-1">
                <MdSearch
                  className="text-6xl text-blue-500 hover:text-blue-700  h-8 w-8 sm:w-16 sm:h-16"
                  size={60}
                />
              </Link>
              <div className="text-md sm:text-2xl">
                <SignIn />
              </div>
            </div>
          )}
        </div>
      </nav>
    </Headroom>
  );
}

export default Header;
