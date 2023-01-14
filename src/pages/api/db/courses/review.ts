import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit'
import { prisma } from '../../../../utils/prismaClientInit'

export default async function courseUpvoteHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body, query } = req

    switch (method) {
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    try {
                        const { user_id } = user
                        const { course_id, comment, rating, isAnonymous } = body

                        await prisma.course_review.create({
                            data: {
                                course_id,
                                comment,
                                rating,
                                user_id,
                                anonymous: isAnonymous,
                            },
                        })

                        res.status(200).json({
                            message: 'Review Added',
                        })
                    } catch (err: any) {
                        console.log(err)
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
        case 'PUT':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    try {
                        const { user_id } = user
                        const { id } = query
                        const { comment, isAnonymous, rating } = body

                        await prisma.course_review.updateMany({
                            where: {
                                id: parseInt(id as string),
                                user_id: user_id,
                            },
                            data: {
                                comment,
                                rating,
                                anonymous: isAnonymous,
                            },
                        })

                        res.status(200).json({
                            message: 'Review Updated',
                        })
                    } catch (err: any) {
                        console.log(err)
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
        case 'DELETE':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    try {
                        const { user_id } = user
                        const { id } = query

                        await prisma.course_review.deleteMany({
                            where: {
                                user_id,
                                id: parseInt(id as string),
                            },
                        })

                        res.status(200).json({
                            message: 'Review Deleted',
                        })
                    } catch (err: any) {
                        console.log(err)
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
        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            })
    }
}
