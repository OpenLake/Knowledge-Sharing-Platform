import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { collection, addDoc, where, getDocs, deleteDoc } from 'firebase/firestore';
import {query as query1} from 'firebase/firestore'

export default async function courseReviewUpvoteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body, query } = req;
  const courseReviewUpvotesRef = collection(firestore, 'courseReviewUpvotes');

  switch (method) {
    case 'POST':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);

        if (user) {
          try {
            const { user_id } = user;
            const { course_review_id } = body;

            const existingUpvoteQuery = query1(
              courseReviewUpvotesRef,
              where('course_review_id', '==', course_review_id),
              where('user_id', '==', user_id)
            );

            const existingUpvoteSnapshot = await getDocs(existingUpvoteQuery);

            if (existingUpvoteSnapshot.empty) {
              await addDoc(courseReviewUpvotesRef, {
                course_review_id,
                user_id,
              });

              res.status(200).json({
                message: 'Upvoted',
              });
            } else {
              res.status(409).json({
                message: 'User has already upvoted for this course review',
              });
            }
          } catch (err: any) {
            console.error(err);
            res.status(500).json({
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
            const existingUpvoteQuery = query1(
              courseReviewUpvotesRef,
              where('course_review_id', '==', parseInt(id as string)),
              where('user_id', '==', user_id)
            );

            const existingUpvoteSnapshot = await getDocs(existingUpvoteQuery);

            if (!existingUpvoteSnapshot.empty) {
              const docRef = existingUpvoteSnapshot.docs[0].ref;
              await deleteDoc(docRef);

              res.status(200).json({
                message: 'Removed Upvote',
              });
            } else {
              res.status(404).json({
                message: 'Upvote not found',
              });
            }
          } catch (err: any) {
            console.error(err);
            res.status(500).json({
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
