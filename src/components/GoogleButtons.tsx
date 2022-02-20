import { auth, firestore } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function SignIn() {
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    //check if user exists in the database
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        createdAt: serverTimestamp(),
      });
      window.location.href = "/";
    }
  };

  return (
    <div className="flex">
      <button
        className="text-white font-bold text-md sm:text-2xl "
        onClick={googleSignIn}
      >
        Sign in
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
        className="text-white font-bold text-md sm:text-2xl "
        onClick={googleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}

export { SignIn, SignOut };
