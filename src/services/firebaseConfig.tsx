// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCu_d4yFonKPSPCIDGGQZQEdRl4SkBcddw",
  authDomain: "ecolesson-6ea96.firebaseapp.com",
  projectId: "ecolesson-6ea96",
  storageBucket: "ecolesson-6ea96.firebasestorage.app",
  messagingSenderId: "481545635543",
  appId: "1:481545635543:web:ba41a1fe71452b3bbe1292"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);