import * as _firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCPFqE-AyOWUpsCOpxnl4XWkCdPrdtB5ok",
    authDomain: "krmap-907ed.firebaseapp.com",
    projectId: "krmap-907ed",
    storageBucket: "krmap-907ed.appspot.com",
    messagingSenderId: "932328420041",
    appId: "1:932328420041:web:f86be294c91d4ed2515318",
    measurementId: "G-2XVLSJLC61"
};

const firebase = _firebase.default;


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
// storage
const fireStorage = firebase.storage();
// firestore
const firestore = firebase.firestore();
const operatorsRef = firestore.collection('operators');
const newsRef = firestore.collection('news');
const usersRef = firestore.collection('users');
const applicationsRef = firestore.collection('applications');
const operatorMessagesRef = firestore.collection('operator_messages');

const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

auth.languageCode = 'ru';

export {
    auth,
    firestore,
    fireStorage,
    firebase,
    operatorsRef,
    newsRef,
    usersRef,
    applicationsRef,
    operatorMessagesRef,
    facebookAuthProvider,
    googleAuthProvider
}