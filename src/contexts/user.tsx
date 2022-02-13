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
});

function UserProvider({ children }: Props) {
  const [user, setUser] = useState({
    uid: "",
    name: "",
    email: "",
    photoURL: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged((res) => {
      console.log(res.uid);
      {
        res
          ? getDoc(doc(db, "users", res.uid)).then((doc) => {
              setUser({
                uid: doc.data()?.uid,
                name: doc.data()?.name,
                email: doc.data()?.email,
                photoURL: doc.data()?.photoURL,
              });
            })
          : setUser({
              uid: "",
              name: "",
              email: "",
              photoURL: "",
            });
      }
    });
  }, [auth.currentUser]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export { UserProvider, UserContext };
