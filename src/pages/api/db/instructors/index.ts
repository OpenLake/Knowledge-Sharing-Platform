import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit'
import { prisma } from '../../../../utils/prismaClientInit'

export default async function instructorsHandler(
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
                        const instructors = await prisma.instructor.findMany()
                        res.status(200).json({
                            message: 'Instructors Fetched',
                            result: instructors,
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
                    const { instructorName } = body
                    try {
                        const instructor = await prisma.instructor.create({
                            data: {
                                name: instructorName,
                                created_by_id: user.user_id,
                            },
                        })

                        res.status(201).json({
                            message: 'New Instructor Created',
                            result: instructor,
                        })
                    } catch (err: any) {
                        res.status(404).json({
                            message: err,
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
        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            })
    }
}
