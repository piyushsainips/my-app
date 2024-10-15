import {initializeApp} from "firebase/app"
import { getStorage } from "firebase/storage";
// import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyAaslzALRB7xIsRyJSURlRFllma8U_aCPM",
    authDomain: "knowledgehub-6856c.firebaseapp.com",
    projectId: "knowledgehub-6856c",
    storageBucket: "knowledgehub-6856c.appspot.com",
    messagingSenderId: "944062736529",
    appId: "1:944062736529:web:130bc13b3c14b608dc3730",
    databaseURL: "https://knowledgehub-6856c-default-rtdb.firebaseio.com"
  };


  export const app = initializeApp(firebaseConfig);
  // export const auth = getAuth(app);
  export const database = getDatabase(app);
  export const storage = getStorage(app);