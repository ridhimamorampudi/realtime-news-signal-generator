// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDyh6erXDxIZ_OaiFzxRFz9qceIyqLjJw",
  authDomain: "alpha-signal-detector.firebaseapp.com",
  projectId: "alpha-signal-detector",
  storageBucket: "alpha-signal-detector.firebasestorage.app",
  messagingSenderId: "185981563995",
  appId: "1:185981563995:web:43441955c12e6cb319fb7e",
  measurementId: "G-0R8S5YCN6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
