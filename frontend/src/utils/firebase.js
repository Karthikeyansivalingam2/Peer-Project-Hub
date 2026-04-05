// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmCVsOoeUf0Vjnez8v4tt42uS2bZeRZng",
  authDomain: "peer-project-hub-2.firebaseapp.com",
  projectId: "peer-project-hub-2",
  storageBucket: "peer-project-hub-2.firebasestorage.app",
  messagingSenderId: "791958979542",
  appId: "1:791958979542:web:964efb78571c69a7c15a77",
  measurementId: "G-FM6RP81JE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);