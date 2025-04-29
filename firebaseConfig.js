// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG-ru7dsv7ReHC0w7_vYbm4LeyBHxQP1Q",
  authDomain: "owl-judge-mobile-app.firebaseapp.com",
  projectId: "owl-judge-mobile-app",
  storageBucket: "owl-judge-mobile-app.firebasestorage.app",
  messagingSenderId: "699563677265",
  appId: "1:699563677265:web:2257f5e6f2692114680a70",
  measurementId: "G-7JYGRTJG7L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
