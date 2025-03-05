import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQ90I5tXuz5SWDKhSR2IAjFbM2VOT4aVI",
  authDomain: "business-point-a196c.firebaseapp.com",
  databaseURL: "https://business-point-a196c-default-rtdb.firebaseio.com",
  projectId: "business-point-a196c",
  storageBucket: "business-point-a196c.appspot.com",
  messagingSenderId: "736584703640",
  appId: "1:736584703640:web:782f8c5afb3036c0b33aed",
  measurementId: "G-P86Y5XPR91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);