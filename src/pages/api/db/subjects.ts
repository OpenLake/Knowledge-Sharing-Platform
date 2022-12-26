import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { adminAuth } from '../../../utils/firebaseAdminInit';
import { responseData } from '../../../types/responseData';
import { prisma } from '../../../utils/prismaClientInit'

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers } = req

    switch (method) {
        case 'GET':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)
                if (user) {
                    try {
                        const subjects = await prisma.subject.findMany()
                        res.status(200).json({
                            message: 'Subjects Fetched',
                            result: subjects
                        })
                    }
                    catch (err: any) {
                        res.status(405).json({
                            err
                        })
                    }
                }
                else {
                    res.status(401).json({
                        message: 'Unauthorized Access'
                    })
                }
            }
            break
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]

                try {
                    prisma.subject.findMany()
                    res.status(200).json({
                        message: 'Subject Created'
                    })
                }
                catch (err: any) {
                    res.status(405).json({
                        err
                    })
                }
            }
            break
        default:
            res.status(405).json({
                message: "Method Not Allowed"
            })
    }
}