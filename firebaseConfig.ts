import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlxzpuf3Z212dtO-3mqo46eaQT8L4ef_A",
  authDomain: "idealistnew.firebaseapp.com",
  projectId: "idealistnew",
  storageBucket: "idealistnew.firebasestorage.app",
  messagingSenderId: "583244811181",
  appId: "1:583244811181:web:b16c2a7e126499439eef24",
  measurementId: "G-EL7N90VF94"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

