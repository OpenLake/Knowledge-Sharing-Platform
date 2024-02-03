import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { firestore } from '../../../../utils/firebaseInit';

import {
  collection,
  updateDoc,
  where,
  query as query1,
  getDocs,
} from 'firebase/firestore';

export default async function courseReviewHandler(
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
            const { user_id, name } = user;
            const { code, comment, rating, isAnonymous } = body;

            const courseDocRef = await getCourseDocRef(code);
            if (courseDocRef) {
              const reviews = courseDocRef.data().reviews || {};
              const reviewData = {
                user_id,
                name,
                comment,
                rating,
                anonymous: isAnonymous,
              };
              if (!reviews[user_id]) {
                reviews[user_id] = reviewData;

                await updateDoc(courseDocRef.ref, {
                  reviews,
                });

                res.status(200).json({
                  message: 'Review Added',
                });
              } else {
                res.status(400).json({
                  message: 'User already reviewed this course',
                });
              }
            } else {
              res.status(404).json({
                message: 'Course not found',
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

      case 'PUT':
  if (headers && headers.authorization) {
    const accessToken = headers.authorization.split(' ')[1];
    const user = await adminAuth.verifyIdToken(accessToken!);

    if (user) {
      try {
        const { user_id, name } = user;
        const { code, comment, rating, isAnonymous } = body;

        const courseDocRef = await getCourseDocRef(code);
        if (courseDocRef) {
          const reviews = courseDocRef.data().reviews || {};
          const reviewData = {
            code,
            user_id,
            comment,
            rating,
            anonymous: isAnonymous,
          };

          reviews[user_id] = reviewData;

          await updateDoc(courseDocRef.ref, {
            reviews,
          });

          res.status(200).json({
            message: 'Review Updated',
          });
        } else {
          res.status(404).json({
            message: 'Course not found',
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

  
  case 'DELETE':
    if (headers && headers.authorization) {
      const accessToken = headers.authorization.split(' ')[1];
      const user = await adminAuth.verifyIdToken(accessToken!);
  
      if (user) {
        try {
          const { user_id } = user;
          const { code } = query;
  
          const courseDocRef = await getCourseDocRef(code as string);
          if (courseDocRef) {
            const reviews = courseDocRef.data().reviews || {};

            if (reviews[user_id]) {
              delete reviews[user_id];
  
              await updateDoc(courseDocRef.ref, {
                reviews,
              });
  
              res.status(200).json({
                message: 'Review Deleted',
              });
            } else {
              res.status(400).json({
                message: 'User has not reviewed this course',
              });
            }
          } else {
            res.status(404).json({
              message: 'Course not found',
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
  async function getCourseDocRef(code: string) {
    if (!code) {
      return null;
    }
  
    const courseQuery = query1(
      collection(firestore, 'courses'),
      where('code', '==', code)
    );
    const courseSnapshot = await getDocs(courseQuery);
  
    if (!courseSnapshot.empty) {
      const courseDoc = courseSnapshot.docs[0];
      return courseDoc;
    } else {
      return null;
    }
  }
  
