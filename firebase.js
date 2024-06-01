// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import "firebase/firestore";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLC-pS5Vo8WDeWHnJXnrIe4608MrVyak4",
  authDomain: "rentgo-c7fab.firebaseapp.com",
  projectId: "rentgo-c7fab",
  storageBucket: "rentgo-c7fab.appspot.com",
  messagingSenderId: "625456398357",
  appId: "1:625456398357:web:10302507e32033badcce1c",
  measurementId: "G-ML4RSSK39M"
};
if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
  }
  
// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase
//firebase.initializeApp(firebaseConfig);
const auth = getAuth();
export {auth };
export const db = getFirestore(appFirebase);
export const store = getStorage(appFirebase);
export const googleProvider = new GoogleAuthProvider();
export { firebase }