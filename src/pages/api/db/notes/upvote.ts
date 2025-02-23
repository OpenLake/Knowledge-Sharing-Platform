import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { collection, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default async function noteUpvoteHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, headers, body, query } = req;

    const notesCollection = 'notes';
    const upvotesCollection = 'note_upvotes';

    switch (method) {
        case 'POST':
            if (headers && headers.authorization) {
                const accessToken = headers.authorization.split(' ')[1];
                const user = await adminAuth.verifyIdToken(accessToken!);

                if (user) {
                    try {
                        const { user_id } = user;
                        const { note_id } = body;
                        const noteRef = doc(firestore, notesCollection, note_id);
                        const upvotesCollectionRef = collection(noteRef, upvotesCollection);
                        const upvoteRef = doc(upvotesCollectionRef, user_id);
                        const existingUpvote = await getDoc(upvoteRef);

                        if (!existingUpvote.exists()) {
                            await setDoc(upvoteRef, {
                                timestamp: serverTimestamp(),
                            });

                            res.status(200).json({
                                message: 'Upvoted',
                            });
                        } else {
                            res.status(400).json({
                                message: 'Already Upvoted',
                            });
                        }
                    } catch (err: any) {
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
                        const noteRef = doc(firestore, notesCollection, id as string);
                        const upvotesCollectionRef = collection(noteRef, upvotesCollection);
                        const upvoteRef = doc(upvotesCollectionRef, user_id);

                        const existingUpvote = await getDoc(upvoteRef);

                        if (existingUpvote.exists()) {
                            await deleteDoc(upvoteRef);

                            res.status(200).json({
                                message: 'Upvote Removed',
                            });
                        } else {
                            res.status(400).json({
                                message: 'Upvote Not Found',
                            });
                        }
                    } catch (err: any) {
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
