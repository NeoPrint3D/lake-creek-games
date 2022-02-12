import { auth, db } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";

function SignIn() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });
    });
  };

  return (
    <div className="flex">
      <button
        className="bg-blue-900 hover:bg-slate-800 text-white font-bold p-4 rounded-3xl text-sm"
        onClick={googleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}

function SignOut() {
  const googleSignOut = () => {
    signOut(auth).then(() => {
      console.log("success");
    });
  };
  return (
    <div>
      <button
        className="bg-blue-900 hover:bg-slate-800 text-white font-bold p-4 rounded-3xl"
        onClick={googleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}

export { SignIn, SignOut };
