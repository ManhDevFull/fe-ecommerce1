
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// const firebaseConfig = {
//   apiKey: "AIzaSyCifYc1vGth7VAUTq-gLAwfjp68KyDUrDw",
//   authDomain: "vertex-e65a4.firebaseapp.com",
//   projectId: "vertex-e65a4",
//   storageBucket: "vertex-e65a4.firebasestorage.app",
//   messagingSenderId: "579431002621",
//   appId: "1:579431002621:web:1e6858b32977bec2746994",
//   measurementId: "G-34XEVG0CB8"
// };
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth()
// export const storage = getStorage(app)
// const analytics = getAnalytics ( app );
// export const googleProvider = new GoogleAuthProvider();
// export const facebookProvider = new FacebookAuthProvider();
// auth.languageCode = 'vi';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
auth.languageCode = "vi";
