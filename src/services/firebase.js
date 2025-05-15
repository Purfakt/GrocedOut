import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where, writeBatch } from 'firebase/firestore'

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

const delay = async () => {
    if (import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_DELAY && import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_DELAY > 0) {
        console.log('Delaying for', import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_DELAY, 'ms')
        return new Promise(resolve => setTimeout(resolve, import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_DELAY))
    }
}

export const getCollection = async (collectionName) => {
    console.log('%c%s %c%s',
        'color: #8BE9FDFF', '[GET] Getting collection:',
        'color: #FF79C6FF', collectionName
    )
    await delay()
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const collectionData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('%c%s', 'color: #51FA7BFF', '[GET] Collection data:', collectionData)
    return collectionData
}

export const updateCollection = async (collectionName, data) => {
    console.log('%c%s %c%s %c%s',
        'color: #8BE9FDFF', '[UPDATE] Updating collection:',
        'color: #FF79C6FF', collectionName,
        'color: #8BE9FDFF', 'with data:', data
    )
    await delay()
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, orderBy('createdAt'))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
        console.log('%c%s %c%s',
            'color: #F1FA8CFF', '[UPDATE] No document found for update in collection:',
            'color: #FF79C6FF', collectionName,
        )
        return
    }
    const batch = writeBatch(db)
    querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
            ...data,
            updatedAt: new Date(),
        })
    })
    await batch.commit()
    console.log('%c%s %c%s',
        'color: #51FA7BFF', '[UPDATE] Collection updated with data:',
        'color: #FF79C6FF', data
    )
}

export const updateCollectionWhere = async (collectionName, whereTuple, data) => {
    console.log('%c%s %c%s %c%s',
        'color: #8BE9FDFF', '[UPDATE] Updating collection:',
        'color: #FF79C6FF', collectionName,
        'color: #8BE9FDFF', 'with data:', data
    )
    await delay()
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, orderBy('createdAt'), where(whereTuple[0], whereTuple[1], whereTuple[2]))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
        console.log('%c%s %c%s',
            'color: #F1FA8CFF', '[UPDATE] No document found for update in collection:',
            'color: #FF79C6FF', collectionName,
        )
        return
    }
    const batch = writeBatch(db)
    querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
            ...data,
            updatedAt: new Date(),
        })
    })
    await batch.commit()
    console.log('%c%s %c%s',
        'color: #51FA7BFF', '[UPDATE] Collection updated with data:',
        'color: #FF79C6FF', data
    )
}

export const createDocument = async (collectionName, data) => {
    console.log('%c%s %c%s %c%s',
        'color: #8BE9FDFF', '[CREATE] Creating document in collection:',
        'color: #FF79C6FF', collectionName,
        'color: #8BE9FDFF', 'with data:', data
    )
    await delay()
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
    console.log('%c%s %c%s',
        'color: #51FA7BFF', '[CREATE] Document created with ID:',
        'color: #FF79C6FF', docRef.id
    )
    return docRef
}

export const updateDocument = async (collectionName, documentId, data) => {
    console.log('%c%s %c%s %c%s %c%s %c%s',
        'color: #8BE9FDFF', '[UPDATE] Updating document in collection:',
        'color: #FF79C6FF', collectionName,
        'color: #8BE9FDFF', 'with id:',
        'color: #FF79C6FF', documentId,
        'color: #8BE9FDFF', 'and data:', data
    )
    await delay()
    const docRef = doc(db, collectionName, documentId)
    if (!docRef) {
        console.log('%c%s %c%s',
            'color: #F1FA8CFF', '[UPDATE] No document found for update in collection:',
            'color: #FF79C6FF', collectionName,
        )
        return
    }
    await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
    })
    console.log('%c%s %c%s',
        'color: #51FA7BFF', '[UPDATE] Document updated with ID:',
        'color: #FF79C6FF', documentId,
    )
}

export const deleteDocument = async (collectionName, documentId) => {
    console.log('%c%s %c%s %c%s %c%s',
        'color: #8BE9FDFF', '[DELETE] Deleting document in collection:',
        'color: #FF79C6FF', collectionName,
        'color: #8BE9FDFF', 'with id:',
        'color: #FF79C6FF', documentId
    )
    await delay()
    const docRef = doc(db, collectionName, documentId)
    if (!docRef) {
        console.log('%c%s %c%s',
            'color: #F1FA8CFF', '[DELETE] No document found for delete in collection:',
            'color: #FF79C6FF', collectionName,
        )
        return
    }
    await deleteDoc(docRef)
    console.log('%c%s %c%s',
        'color: #51FA7BFF', '[DELETE] Document deleted with ID:',
        'color: #FF79C6FF', documentId
    )
}