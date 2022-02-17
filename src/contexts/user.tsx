import { useState, useEffect, createContext } from "react";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore/lite";

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
});

function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>({
    name: "",
    photoURL: "",
    email: "",
    uid: "",
    role: "",
    createdAt:"",
  });

  useEffect(() => {
    auth.onAuthStateChanged((res) => {
      {
        res
          ? getDoc(doc(db, "users", res.uid)).then((doc) => {
              setUser({
                uid: doc.data()?.uid,
                name: doc.data()?.name,
                email: doc.data()?.email,
                photoURL: doc.data()?.photoURL,
                role: doc.data()?.role,
                createdAt: doc.data()?.createdAt,
              });
            })
          : setUser({
              uid: "",
              name: "",
              email: "",
              photoURL: "",
              role: "",
              createdAt: "",
            });
      }
    });
  }, [auth.currentUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export { UserProvider, UserContext };
