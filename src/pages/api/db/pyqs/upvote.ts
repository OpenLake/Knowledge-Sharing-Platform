import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { firestore } from '../../../../utils/firebaseInit';
import { collection, doc, query, getDocs, addDoc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const pyqUpvotesCollection = 'pyq_upvotes';

export default async function pyqUpvoteHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body, query } = req;

    switch (method) {
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const { user_id } = user;
                        const { pyq_id } = body;

                        const upvoteRef = collection(firestore, pyqUpvotesCollection);
                        const newUpvoteDocRef = await addDoc(upvoteRef, {
                            pyq_id,
                            user_id,
                        });

                        res.status(200).json({
                            message: 'Upvoted',
                            upvoteId: newUpvoteDocRef.id,
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

        case 'DELETE':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const { user_id } = user;
                        const { id } = query;
                        const upvoteRef = doc(firestore, pyqUpvotesCollection, id as string);
                        await deleteDoc(upvoteRef);

                        res.status(200).json({
                            message: 'Upvote Removed',
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

        default:
            res.status(405).json({
                message: 'Method Not Allowed',
            });
    }
}
