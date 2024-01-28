import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { firestore } from '../../../../utils/firebaseInit';
import { collection, query as query1, getDocs, addDoc, setDoc, deleteDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const pyqsCollection = 'pyqs';

export default async function pyqHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body, query } = req;

    switch (method) {
        case 'GET':
            try {
                const pyqsQuery = query1(collection(firestore, pyqsCollection));
                const pyqsSnapshot = await getDocs(pyqsQuery);
                const pyqs = pyqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                res.status(200).json({
                    message: 'PYQs Fetched',
                    result: pyqs,
                });
            } catch (err: any) {
                console.error(err);
                res.status(405).json({
                    err,
                });
            }
            break;

        case 'POST':
        if (headers && headers.authorization) {
            const accessToken = headers.authorization.split(' ')[1];
            const user = await adminAuth.verifyIdToken(accessToken!);

        if (user) {

            const {
                title,
                subjectCode,
                semester,
                instructorName,
                subjectName,
                uploadedBy,
                branch,
                url,
                isAnonymous,
            } = body;

            try {
                const pyqRef = await addDoc(collection(firestore, pyqsCollection), {
                    title,
                    subject_code:subjectCode,
                    semester,
                    branch,
                    instructorName,
                    subjectName,
                    uploadedBy,
                    url,
                    anonymous: isAnonymous,
                    created_by_id: user.user_id,
                    timestamp: serverTimestamp(),
                }); 

                res.status(201).json({
                    message: 'PYQ Created',
                    id: pyqRef.id,
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

            
        case 'PUT':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const { id } = query;
                        const pyqRef = doc(firestore, pyqsCollection, id as string);
                        const pyqSnapshot = await getDoc(pyqRef);
                        const pyqData = pyqSnapshot.data();

                        if (pyqData) {
                            if (user.user_id === pyqData.created_by_id) {
                                await setDoc(pyqRef, {
                                    title: body.title,
                                    subject_code: body.subjectCode,
                                    semester: body.semester,
                                    branch: body.branch,
                                    instructorName:body.instructorName,
                                    url: body.url,
                                    subjectName:body.subjectName,
                                    uploadedBy:body.uploadedBy,
                                    anonymous: body.isAnonymous,
                                    created_by_id: user.user_id,
                                    timestamp: serverTimestamp(),
                                });

                                res.status(200).json({
                                    message: 'PYQ Updated',
                                });
                            } else {
                                res.status(405).json({
                                    message: 'Unauthorized Access',
                                });
                            }
                        } else {
                            res.status(404).json({
                                message: 'No PYQ Found',
                            });
                        }
                    } catch (err: any) {
                        console.error(err);
                        res.status(405).json({
                            err,
                        });
                    }
                }
            } else {
                res.status(401).json({
                    message: 'Unauthorized Access',
                });
            }
            break;

        case 'DELETE':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const { id } = query;
                        const pyqRef = doc(firestore, pyqsCollection, id as string);
                        const pyqSnapshot = await getDoc(pyqRef);
                        const pyqData = pyqSnapshot.data();

                        if (pyqData) {
                            if (user.user_id === pyqData.created_by_id) {
                                await deleteDoc(pyqRef);

                                res.status(200).json({
                                    message: 'PYQ Deleted Successfully',
                                });
                            } else {
                                res.status(405).json({
                                    message: 'Unauthorized Access',
                                });
                            }
                        } else {
                            res.status(404).json({
                                message: 'No PYQ Found',
                            });
                        }
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

        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            });
    }
}
