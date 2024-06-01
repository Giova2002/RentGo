import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'



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

export { firebase }