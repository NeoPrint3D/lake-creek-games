import { useState, useEffect, createContext } from "react";
import { auth, firestore } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Props {
  children: JSX.Element;
}

const UserContext = createContext<User>({
  uid: "",
  name: "",
  photoURL: "",
  email: "",
  role: "",
  createdAt: "",
  likedGames: [],
});

function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>({
    name: "",
    photoURL: "",
    email: "",
    uid: "",
    role: "",
    createdAt: "",
    likedGames: [],
  });

  useEffect(() => {
    auth.onAuthStateChanged((res) => {
      {
        res &&
          getDoc(doc(firestore, "users", res.uid)).then((doc) => {
            setUser({
              uid: doc.data()?.uid,
              name: doc.data()?.name,
              email: doc.data()?.email,
              photoURL: doc.data()?.photoURL,
              role: doc.data()?.role,
              createdAt: doc.data()?.createdAt,
              likedGames: doc.data()?.likedGames,
            });
          });
      }
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export { UserProvider, UserContext };
