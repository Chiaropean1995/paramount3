
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD-Ce3fz1j-z7N6eyynKVZF8hUYd9qH_TU",
    authDomain: "paramount-valley.firebaseapp.com",
    projectId: "paramount-valley",
    storageBucket: "paramount-valley.appspot.com",
    messagingSenderId: "473791045845",
    appId: "1:473791045845:web:ecbcaaab5594581d12425c",
    measurementId: "G-XNXQ3JYP9W"
};


const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
export const auth = getAuth(app)