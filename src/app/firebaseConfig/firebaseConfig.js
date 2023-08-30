
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDKOZrQqLS11Eleh74a6VW9TyfjgIslpMQ",
  authDomain: "twitter-a4edb.firebaseapp.com",
  projectId: "twitter-a4edb",
  storageBucket: "twitter-a4edb.appspot.com",
  messagingSenderId: "677332709527",
  appId: "1:677332709527:web:1a90d1bd41362ea39739d2",
  measurementId: "G-XMSRDJ6LQJ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {auth,provider,db,storage}
