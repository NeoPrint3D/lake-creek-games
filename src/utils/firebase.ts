import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOM,
  projectId: import.meta.env.VITE_PRJ_ID,
  storageBucket: import.meta.env.VITE_STG_BKT,
  messagingSenderId: import.meta.env.VITE_MSG_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MESG_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//type the auth and firestore functions
const auth = getAuth();
const db = getFirestore(app);
const performance = getPerformance(app);

export { analytics, auth, db, performance };
