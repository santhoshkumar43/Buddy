// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_D2MbqJK6_09ION_DV6WeFiK5CgFV72w",
  authDomain: "buddy-da135.firebaseapp.com",
  projectId: "buddy-da135",
  storageBucket: "buddy-da135.firebasestorage.app",
  messagingSenderId: "316699324851",
  appId: "1:316699324851:web:044d17111fa5537c285bc6",
  measurementId: "G-JMFM5K6FM8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
