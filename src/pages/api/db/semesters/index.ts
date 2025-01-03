import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { getDocs, collection, addDoc, getDoc } from 'firebase/firestore';

export default async function semestersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body } = req;
  const semestersCollection = 'semesters';

  switch (method) {
    case 'GET':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);
        if (user) {
          try {
            const semestersSnapshot = await getDocs(
              collection(firestore, semestersCollection)
            );
            const semesters = semestersSnapshot.docs.map((doc) => {
              const { semesterName} = doc.data();
              return {
                semesterName
              };
            });

            res.status(200).json({
              message: 'Semesters Fetched',
              result: semesters,
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
          const { semesterName } = body;
          try {
            const newSemestersRef = await addDoc(
              collection(firestore, semestersCollection),
              {
                semesterName,
                created_by_id: user.user_id,
              }
            );

            res.status(201).json({
              message: 'New Semester Created',
              result: newSemestersRef,
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
