import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { getDocs, collection, addDoc, getDoc } from 'firebase/firestore';

export default async function branchesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body } = req;
  const branchesCollection = 'branches';

  switch (method) {
    case 'GET':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);
        if (user) {
          try {
            const branchesSnapshot = await getDocs(
              collection(firestore, branchesCollection)
            );
            const branches = branchesSnapshot.docs.map((doc) => {
              const { branchName} = doc.data();
              return {
                branchName
              };
            });

            res.status(200).json({
              message: 'Branches Fetched',
              result: branches,
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
          const { branchName } = body;
          try {
            const newBranchesRef = await addDoc(
              collection(firestore, branchesCollection),
              {
                branchName,
                created_by_id: user.user_id,
              }
            );

            res.status(201).json({
              message: 'New Branch Created',
              result: newBranchesRef,
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
