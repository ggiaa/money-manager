import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXxoIFqcQjV-XBxPWfse3bJqQ_r9EB9dY",
  authDomain: "expense-tracker-793c2.firebaseapp.com",
  projectId: "expense-tracker-793c2",
  storageBucket: "expense-tracker-793c2.appspot.com",
  messagingSenderId: "750397521592",
  appId: "1:750397521592:web:5c857bc252f7a6d639be4d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
