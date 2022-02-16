import { auth, db } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore/lite";

function SignIn() {
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    //add the data to the user and have a subcollection of private with roles
    setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "user",
    });
  };

  return (
    <div className="flex">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-3xl text-sm"
        onClick={googleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}

function SignOut() {
  const googleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut(auth).then(() => {
        console.log("success");
        window.location.href = "/";
      });
    } else {
      console.log("cancelled");
    }
  };
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-3xl"
        onClick={googleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}

export { SignIn, SignOut };
