// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-eddf0.firebaseapp.com",
  projectId: "cortexai-eddf0",
  storageBucket: "cortexai-eddf0.firebasestorage.app",
  messagingSenderId: "194812327678",
  appId: "1:194812327678:web:e25c460d3558d894b8d7af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Here app is the firebase app instance
export const auth = getAuth(app);
// So auth is basically the “Firebase Auth service” that manages users, sessions, and tokens for your project.
export const provider = new GoogleAuthProvider();