import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDyzYjvjXhs1MPIR5HTkKsLCwWoCJMcoOA",
  authDomain: "broly-f1eca.firebaseapp.com",
  databaseURL: "https://broly-f1eca-default-rtdb.firebaseio.com",
  projectId: "broly-f1eca",
  storageBucket: "broly-f1eca.firebasestorage.app",
  messagingSenderId: "1051892697342",
  appId: "1:1051892697342:web:a7f87bf6a73d0d912e3daf",
  measurementId: "G-QB23G3JJZP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
