import {
    AppOptions,
    cert,
    getApp,
    getApps,
    initializeApp,
    ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const { privateKey } = JSON.parse(process.env.PRIVATE_KEY!)

const credentials: ServiceAccount = {
    projectId: process.env.PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.CLIENT_EMAIL,
};

const options: AppOptions = {
    credential: cert(credentials),
    databaseURL: process.env.databaseURL,
};

function createFirebaseAdminApp(config: AppOptions) {
    if (getApps().length === 0) {
        return initializeApp(config);
    } else {
        return getApp();
    }
}

const firebaseAdmin = createFirebaseAdminApp(options);
export const adminAuth = getAuth(firebaseAdmin);