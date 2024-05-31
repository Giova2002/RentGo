import { getFirestore } from '@react-native-firebase/firestore';
import { initializeApp } from 'react-native-firebase/app'
import { getAuth } from "@react-native-firebase/auth"
import { getFirestore } from '@react-native-firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDLC-pS5Vo8WDeWHnJXnrIe4608MrVyak4",
    authDomain: "rentgo-c7fab.firebaseapp.com",
    projectId: "rentgo-c7fab",
    storageBucket: "rentgo-c7fab.appspot.com",
    messagingSenderId: "625456398357",
    appId: "1:625456398357:web:10302507e32033badcce1c",
    measurementId: "G-ML4RSSK39M"
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)