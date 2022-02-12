import { useContext } from "react";
import { UserContext } from "../contexts/user";

import { SignIn, SignOut } from "../components/GoogleButtons";

function Header() {
  const user = useContext(UserContext);
  console.log(user);
  return (
    <header className="grid grid-cols-3 h-24 items-center bg-gradient-to-b from-yellow-400 to-yellow-200 rounded-b-xl">
      <div className="ml-3">{!user?.uid ? <SignIn /> : <SignOut />}</div>
      <h1 className="text-4xl font-bold text-center">Lake Creek Games</h1>

      <div className=" flex justify-end mr-3">
        <img className="rounded-full h-16" src={user?.photoURL} alt="" />
      </div>
    </header>
  );
}

export default Header;
