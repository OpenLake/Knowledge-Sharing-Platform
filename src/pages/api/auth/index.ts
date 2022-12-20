import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin'
import { deleteApp } from 'firebase-admin/app';
const { privateKey } = JSON.parse(process.env.PRIVATE_KEY!)

const FIREBASE_ADMIN_CONFIG = {
    credential: credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey
    })
}

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers } = req

    switch (method) {
        case 'GET':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]

                const firebaseAdminApp = initializeApp(FIREBASE_ADMIN_CONFIG)
                const adminAuth = getAuth(firebaseAdminApp)

                const user = await adminAuth.verifyIdToken(accessToken!)
                console.log(user)
                await deleteApp(firebaseAdminApp)

            }
            res.status(200).json({
                message: 'User fetched',
                // result: user
            })
            break
        default:
            res.status(405).json({
                message: "Method Not Allowed"
            })
    }
}