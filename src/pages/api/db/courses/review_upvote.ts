import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit'
import { prisma } from '../../../../utils/prismaClientInit'

export default async function courseReviewUpvoteHandler(
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
                        const { course_review_id } = body

                        await prisma.course_review_upvote.create({
                            data: {
                                course_review_id,
                                user_id,
                            },
                        })

                        res.status(200).json({
                            message: 'Upvoted',
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

                        await prisma.course_review_upvote.deleteMany({
                            where: {
                                course_review_id: parseInt(id as string),
                                user_id,
                            },
                        })

                        res.status(200).json({
                            message: 'Removed Upvote',
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
    }
}
