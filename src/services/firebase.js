import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

if (import.meta.env.DEV) {
    const emulatorConfig = {
        authUrl: import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL ?? 'http://localhost:9099',
        firestoreHost: import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST ?? 'localhost',
        firestorePort: import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT ?? '8080',
    }
    console.log('Connecting to Firebase Emulators')
    connectAuthEmulator(auth, emulatorConfig.authUrl, { disableWarnings: true })
    connectFirestoreEmulator(
        db,
        emulatorConfig.firestoreHost,
        emulatorConfig.firestorePort
    )
}

export const getCollection = async (collectionName) => {
    console.log('Getting collection:', collectionName)
    const querySnapshot = await getDocs(collection(db, collectionName))
    const collectionData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Collection data:', collectionData)
    return collectionData
}

export const getDocument = async (collectionName, documentId) => {
    console.log('Getting document from collection:', collectionName, 'with id:', documentId)
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
        return { id: docSnap.id, ...docSnap.data() }
    } else {
        return null
    }
}

export const createDocument = async (collectionName, data) => {
    console.log('Creating document in collection:', collectionName, 'with data:', data)
    const docRef = await addDoc(collection(db, collectionName), data)
    return docRef.id
}

export const updateDocument = async (collectionName, documentId, data) => {
    console.log('Updating document in collection:', collectionName, 'with id:', documentId, 'and data:', data)
    const docRef = doc(db, collectionName, documentId)
    return updateDoc(docRef, data)
}

export const deleteDocument = async (collectionName, documentId) => {
    console.log('Deleting document in collection:', collectionName, 'with id:', documentId)
    const docRef = doc(db, collectionName, documentId)
    return deleteDoc(docRef)
}