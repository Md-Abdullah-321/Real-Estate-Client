// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ffa9c.firebaseapp.com",
  projectId: "mern-estate-ffa9c",
  storageBucket: "mern-estate-ffa9c.appspot.com",
  messagingSenderId: "81829132071",
  appId: "1:81829132071:web:cae09da884a735d1155b02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);