import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwsG1zm7SkUUdvc7I8_BPAgpLP6NO-Ihk",
  authDomain: "task-manager-add7a.firebaseapp.com",
  projectId: "task-manager-add7a",
  storageBucket: "task-manager-add7a.appspot.com",
  messagingSenderId: "469620876083",
  appId: "1:469620876083:web:7464f25165894864129036",
  measurementId: "G-GT9WDXHF7T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
// src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCwsG1zm7SkUUdvc7I8_BPAgpLP6NO-Ihk",
  authDomain: "task-manager-add7a.firebaseapp.com",
  projectId: "task-manager-add7a",
  storageBucket: "task-manager-add7a.firebasestorage.app",
  messagingSenderId: "469620876803",
  appId: "1:469620876803:web:7464f25165894864129036",
  measurementId: "G-GT9WDXHF7T"
};

export default firebaseConfig;
