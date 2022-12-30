import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { prisma } from '../../../../utils/prismaClientInit';


export default async function pyqHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers, body, query } = req

    switch (method) {
        case 'GET':
            try {
                const pyqs = await prisma.pyq.findMany({
                    include: {
                        subject: {
                            select: {
                                name: true
                            }
                        },
                        created_by: {
                            select: {
                                name: true
                            }
                        }
                    }
                })
                res.status(200).json({
                    message: "PYQs Fetched",
                    result: pyqs
                })
            }
            catch (err: any) {
                console.log(err)
                res.status(405).json({
                    err
                })
            }
            break

        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { title, subjectCode, studyingClass, branch, fromYear, toYear, url, isAnonymous } = body
                    try {
                        await prisma.pyq.create({
                            data: {
                                title,
                                url,
                                subject_code: subjectCode,
                                from_year: fromYear,
                                to_year: toYear,
                                branch,
                                class: studyingClass,
                                anonymous: isAnonymous,
                                created_by_id: user.user_id
                            }
                        })
                        res.status(201).json({
                            message: "PYQ Created"
                        })
                    }
                    catch (err: any) {
                        console.log(err)
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
            else {
                res.status(401).json({
                    message: 'Unauthorized Access'
                })
            }
            break

        case 'PUT':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    try {
                        const { id } = query

                        const { title, subjectCode, studyingClass, branch, fromYear, toYear, url, isAnonymous } = body
                        const pyqs = await prisma.pyq.findUnique({
                            where: {
                                id: parseInt(id as string)
                            }
                        })

                        if (pyqs) {
                            if (user.user_id === pyqs.created_by_id) {
                                await prisma.pyq.update({
                                    where: {
                                        id: parseInt(id as string)
                                    },
                                    data: {
                                        title,
                                        url,
                                        subject_code: subjectCode,
                                        from_year: fromYear,
                                        to_year: toYear,
                                        branch,
                                        class: studyingClass,
                                        anonymous: isAnonymous,
                                        created_by_id: user.user_id
                                    }
                                })

                                res.status(200).json({
                                    message: "PYQ Updated"
                                })
                            }
                            else {
                                res.status(405).json({
                                    message: 'Unauthorized Access'
                                })
                            }
                        }
                        else {
                            res.status(404).json({
                                message: "No PYQ Found"
                            })
                        }
                    }
                    catch (err: any) {
                        console.log(err)
                        res.status(405).json({
                            err
                        })
                    }
                }
            }
            else {
                res.status(401).json({
                    message: 'Unauthorized Access'
                })
            }
            break
        case 'DELETE':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    try {
                        const { id } = query

                        const pyqs = await prisma.pyq.findUnique({
                            where: {
                                id: parseInt(id as string)
                            }
                        })

                        if (pyqs) {
                            if (user.user_id === pyqs.created_by_id) {
                                await prisma.pyq.delete({
                                    where: {
                                        id: parseInt(id as string)
                                    }
                                })

                                res.status(200).json({
                                    message: "PYQ Deleted Successfully"
                                })
                            }
                            else {
                                res.status(405).json({
                                    message: 'Unauthorized Access'
                                })
                            }
                        }
                        else {
                            res.status(404).json({
                                message: "No PYQ Found"
                            })
                        }
                    }
                    catch (err: any) {
                        console.log(err)
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
            else {
                res.status(401).json({
                    message: 'Unauthorized Access'
                })
            }
            break
        default:
            res.status(405).json({
                message: "Method Not Allowed"
            })
    }
}