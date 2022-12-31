import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit'
import { prisma } from '../../../../utils/prismaClientInit'

export default async function authHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body } = req

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
                            result: subjects,
                        })
                    } catch (err: any) {
                        res.status(405).json({
                            err,
                        })
                    }
                } else {
                    res.status(401).json({
                        message: 'Unauthorized Access',
                    })
                }
            } else {
                res.status(401).json({
                    message: 'Unauthorized Access',
                })
            }
            break
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { subjectName, subjectCode } = body
                    const subject = await prisma.subject.findUnique({
                        where: {
                            code: subjectCode,
                        },
                    })

                    if (subject) {
                        console.log(subject)
                        res.status(405).json({
                            message: 'Subject Code already exists',
                        })
                    } else {
                        try {
                            await prisma.subject.create({
                                data: {
                                    name: subjectName,
                                    code: subjectCode,
                                    created_by_id: user.user_id,
                                },
                            })

                            res.status(201).json({
                                message: 'New Subject Created',
                            })
                        } catch (err: any) {
                            res.status(404).json({
                                message: err,
                            })
                        }
                    }
                } else {
                    res.status(401).json({
                        message: 'Unauthorized Access',
                    })
                }
            } else {
                res.status(401).json({
                    message: 'Unauthorized Access',
                })
            }
            break
        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            })
    }
}
