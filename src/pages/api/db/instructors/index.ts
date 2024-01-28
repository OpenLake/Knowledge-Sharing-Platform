import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { getDocs, collection, addDoc, getDoc } from 'firebase/firestore';

export default async function instructorsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body } = req;
  const instructorsCollection = 'instructors';

  switch (method) {
    case 'GET':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);
        if (user) {
          try {
            const instructorsSnapshot = await getDocs(
              collection(firestore, instructorsCollection)
            );
            const instructors = instructorsSnapshot.docs.map((doc) => {
              const { instructorName} = doc.data();
              return {
                instructorName
              };
            });

            res.status(200).json({
              message: 'Instructors Fetched',
              result: instructors,
            });
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

    case 'POST':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);

        if (user) {
          const { instructorName } = body;
          try {
            const newInstructorRef = await addDoc(
              collection(firestore, instructorsCollection),
              {
                instructorName,
                created_by_id: user.user_id,
              }
            );

            res.status(201).json({
              message: 'New Instructor Created',
              result: newInstructorRef,
            });
          } catch (err: any) {
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
