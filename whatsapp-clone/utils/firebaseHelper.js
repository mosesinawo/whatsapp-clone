import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrmKG0hGHWdB5dxxtgBpyEW2qwgNMCqYo",
  authDomain: "whatsapp-34d2d.firebaseapp.com",
  databaseURL: "https://whatsapp-34d2d-default-rtdb.firebaseio.com",
  projectId: "whatsapp-34d2d",
  storageBucket: "whatsapp-34d2d.appspot.com",
  messagingSenderId: "559351323717",
  appId: "1:559351323717:web:d90dbdb9d43103a1ec972c",
  measurementId: "G-M2E6329VHX"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);


// Get Firebase Auth and Database instances
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app); // Added storage export
export default app;

 