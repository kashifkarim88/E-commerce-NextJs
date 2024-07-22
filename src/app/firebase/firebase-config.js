// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8zvwPilZXUt-Amo53_LL_BheAsDctY14",
    authDomain: "estore-nextjs.firebaseapp.com",
    projectId: "estore-nextjs",
    storageBucket: "estore-nextjs.appspot.com",
    messagingSenderId: "80551073716",
    appId: "1:80551073716:web:853fef69939f89e7ed84e1",
    measurementId: "G-8VKX30EFL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);