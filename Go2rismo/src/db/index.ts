import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkwtFh5Q6ecolZVxJ9oiZF7nBDG-Dj2Uo",
  authDomain: "go2rismo-81bba.firebaseapp.com",
  databaseURL: "https://go2rismo-81bba-default-rtdb.firebaseio.com",
  projectId: "go2rismo-81bba",
  storageBucket: "go2rismo-81bba.appspot.com",
  messagingSenderId: "874814691142",
  appId: "1:874814691142:web:966dfdd1663dda04bcb747",
  measurementId: "G-W9Z26ZKX0V"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

