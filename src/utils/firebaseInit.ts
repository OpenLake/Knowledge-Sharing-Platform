import { FirebaseOptions, initializeApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config';

let firebaseApp: any;

function createFirebaseApp(config: FirebaseOptions) {
  try {
    if (!firebaseApp) {
      firebaseApp = initializeApp(config);
    }
    return firebaseApp;
  } catch (error) {
    if (getApp()) {
      return getApp();
    }
    throw error;
  }
}

const firestore: Firestore = getFirestore(createFirebaseApp(FIREBASE_CONFIG));
const firebaseAuth: Auth = getAuth(createFirebaseApp(FIREBASE_CONFIG));

export { firestore, firebaseAuth, firebaseApp };
