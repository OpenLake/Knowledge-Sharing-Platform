import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit'
import { prisma } from '../../../../utils/prismaClientInit'
import { Prisma } from '@prisma/client'

export default async function coursesHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body, query } = req

    switch (method) {
        case 'GET':
            try {
                if (query.id) {
                    const course = await prisma.course.findUnique({
                        where: {
                            id: parseInt(query.id as string),
                        },
                        select: {
                            id: true,
                            title: true,
                            code: true,
                            anonymous: true,
                            instructor_id: true,
                            created_by_id: true,
                            _count: {
                                select: {
                                    reviews: true,
                                },
                            },
                            reviews: {
                                select: {
                                    comment: true,
                                    user: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    anonymous: true,
                                    user_id: true,
                                    rating: true,
                                    id: true,
                                },
                            },
                            created_by: {
                                select: {
                                    name: true,
                                },
                            },
                            instructor: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    })

                    res.status(200).json({
                        message: 'Course Fetched',
                        result: course,
                    })
                } else {
                    const courses = await prisma.course.findMany({
                        include: {
                            created_by: {
                                select: {
                                    name: true,
                                },
                            },
                            instructor: {
                                select: {
                                    name: true,
                                },
                            },
                            _count: {
                                select: {
                                    reviews: true,
                                },
                            },
                        },
                    })
                    res.status(200).json({
                        message: 'Courses Fetched',
                        result: courses,
                    })
                }
            } catch (err: any) {
                res.status(404).json({
                    message: err,
                })
            }
            break
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { title, code, instructorId, isAnonymous } = body
                    const course = await prisma.course.findUnique({
                        where: {
                            code: code,
                        },
                    })

                    if (course) {
                        res.status(405).json({
                            message: 'Course Code already exists',
                        })
                    } else {
                        try {
                            await prisma.course.create({
                                data: {
                                    title: title,
                                    code: code,
                                    instructor_id: instructorId,
                                    anonymous: isAnonymous,
                                    created_by_id: user.user_id,
                                },
                            })

                            res.status(201).json({
                                message: 'New Course Created',
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
        case 'PUT':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { id } = query
                    const { title, code, instructorId, isAnonymous } = body

                    try {
                        await prisma.course.update({
                            where: {
                                id: parseInt(id as string),
                            },
                            data: {
                                title: title,
                                code: code,
                                instructor_id: instructorId,
                                anonymous: isAnonymous,
                            },
                        })

                        res.status(201).json({
                            message: 'Course Updated',
                        })
                    } catch (err: any) {
                        if (
                            err instanceof Prisma.PrismaClientKnownRequestError
                        ) {
                            if (err.code === 'P2002') {
                                res.status(404).json({
                                    message: 'Course Code already exists',
                                })
                            } else {
                                res.status(404).json({
                                    message: err,
                                })
                            }
                        } else {
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

        case 'DELETE':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { id } = query
                    try {
                        await prisma.course.delete({
                            where: {
                                id: parseInt(id as string),
                            },
                        })
                        res.status(200).json({
                            message: 'Course Deleted Successfully',
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
