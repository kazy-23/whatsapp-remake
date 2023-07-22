import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMJ2a38ESsrARiw6Wf17tbezv22YyRzfY",
  authDomain: "whatsapp-remake-c9494.firebaseapp.com",
  projectId: "whatsapp-remake-c9494",
  storageBucket: "whatsapp-remake-c9494.appspot.com",
  messagingSenderId: "300272996385",
  appId: "1:300272996385:web:c1e1eba43d662e8b3b5360"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();