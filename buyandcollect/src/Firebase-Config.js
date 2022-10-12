import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8_Dv7UiaG5JAZNoQUSFQuEDRWmuBUVXg",
  authDomain: "buyandcollect-7f30d.firebaseapp.com",
  projectId: "buyandcollect-7f30d",
  storageBucket: "buyandcollect-7f30d.appspot.com",
  messagingSenderId: "42358059896",
  appId: "1:42358059896:web:adee51de199033633d8e8d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };
