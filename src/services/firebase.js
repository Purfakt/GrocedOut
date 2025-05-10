import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.DEV) {
    const emulatorConfig = {
        authUrl: import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL ?? "http://localhost:9099",
        firestoreHost: import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST ?? "localhost",
        firestorePort: import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT ?? "8080",
    };
    console.log("Connecting to Firebase Emulators");
    connectAuthEmulator(auth, emulatorConfig.authUrl);
    connectFirestoreEmulator(
        db,
        emulatorConfig.firestoreHost,
        emulatorConfig.firestorePort
    );
}

export const getCollection = async (collectionName) => getDocs(collection(db, collectionName))
    .then(querySnapshot => querySnapshot.docs)