// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
// import * as Admin from "firebase-admin"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize the Firebase Admin SDK
// const serviceAccount = require("./ezcare-v1-firebase-adminsdk-gxidu-e8ca4c2ddb.json");


// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEF_fwpzlhuypSK_a-ZFviwbsxI_dzmew",
  authDomain: "ezcare-v2.firebaseapp.com",
  projectId: "ezcare-v2",
  storageBucket: "ezcare-v2.appspot.com",
  messagingSenderId: "322343873389",
  appId: "1:322343873389:web:83b114713661edb5530864"
};

// Initialize Firebase First
const initializeFirebase = firebase.initializeApp(firebaseConfig)

const db = initializeFirebase.database()
const storage = initializeFirebase.storage()
const auth = firebase.auth()

export { auth ,  db , storage}