import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { firestore } from '../../../../utils/firebaseInit';
import { collection, doc, query, getDocs, addDoc, where} from 'firebase/firestore';

const subjectsCollection = 'subjects';

export default async function subjectsHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body } = req;

    switch (method) {
        case 'GET':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const subjectsRef = collection(firestore, subjectsCollection);
                        const subjectsSnapshot = await getDocs(subjectsRef);
                        const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                        res.status(200).json({
                            message: 'Subjects Fetched',
                            result: subjects,
                        });
                    } catch (err: any) {
                        console.error(err);
                        res.status(405).json({
                            err,
                        });
                    }
                } else {
                    res.status(401).json({
                        message: 'Unauthorized Access',
                    });
                }
            } else {
                res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            break;

        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    const { subjectName, subjectCode } = body;

                    try {
                        const subjectRef = collection(firestore, subjectsCollection);
                        const subjectQuery = query(subjectRef, where('code', '==', subjectCode));
                        const existingSubjects = await getDocs(subjectQuery);

                        if (!existingSubjects.empty) {
                            res.status(405).json({
                                message: 'Subject Code already exists',
                            });
                        } else {
                            const newSubjectDocRef = await addDoc(subjectRef, {
                                name: subjectName,
                                code: subjectCode,
                                created_by_id: user.user_id,
                            });

                            res.status(201).json({
                                message: 'New Subject Created',
                                subjectId: newSubjectDocRef.id,
                            });
                        }
                    } catch (err: any) {
                        console.error(err);
                        res.status(404).json({
                            message: err,
                        });
                    }
                } else {
                    res.status(401).json({
                        message: 'Unauthorized Access',
                    });
                }
            } else {
                res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            break;

        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            });
    }
}
