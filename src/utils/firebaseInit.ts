import { FirebaseOptions, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { FIREBASE_CONFIG } from '../config'

function createFirebaseApp(config: FirebaseOptions) {
    try {
        return getApp()
    } catch {
        return initializeApp(config)
    }
}

const firebaseApp = createFirebaseApp(FIREBASE_CONFIG)
export const firebaseAuth = getAuth(firebaseApp)
