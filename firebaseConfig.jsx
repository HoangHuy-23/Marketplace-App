// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnUdzm03o3QenvA64UdL-bYwx99CB9_NY",
  authDomain: "community-marketplace-73654.firebaseapp.com",
  projectId: "community-marketplace-73654",
  storageBucket: "community-marketplace-73654.appspot.com",
  messagingSenderId: "859158941584",
  appId: "1:859158941584:web:7abd2cbe83eb358e5aed15",
  measurementId: "G-4D5Q19ET7H",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
