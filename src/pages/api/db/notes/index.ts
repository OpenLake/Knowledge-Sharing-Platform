import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { prisma } from '../../../../utils/prismaClientInit';


export default async function noteHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method, headers, body } = req

    switch (method) {
        case 'GET':
            break

        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1]
                const user = await adminAuth.verifyIdToken(accessToken!)

                if (user) {
                    const { title, subjectCode, studyingClass, branch, batch, url } = body
                    try {
                        console.log('first')
                        const result = await prisma.note.create({
                            data: {
                                title,
                                subject: subjectCode,
                                batch,
                                branch,
                                class: studyingClass,
                                url,
                                created_by_id: user.user_id
                            }
                        })
                        console.log(result)
                        res.status(201).json({
                            message: "Notes Created"
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
            break
        default:
            res.status(405).json({
                message: "Method Not Allowed"
            })
    }
}