import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { getDocs, collection, addDoc, getDoc } from 'firebase/firestore';

export default async function resourceTypeshandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body } = req;
  const resourceTypesCollection = 'resourceTypes';

  switch (method) {
    case 'GET':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);
        if (user) {
          try {
            const resourceTypesSnapshot = await getDocs(
              collection(firestore, resourceTypesCollection)
            );
            const resourceTypes = resourceTypesSnapshot.docs.map((doc) => {
              const { resourceType } = doc.data();
              return {
                resourceType
              };
            });

            res.status(200).json({
              message: 'Resource Types Fetched',
              result: resourceTypes,
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
          const { resourceType } = body;
          try {
            const newResourceTypeRef = await addDoc(
              collection(firestore, resourceTypesCollection),
              {
                resourceType,
                created_by_id: user.user_id,
              }
            );

            res.status(201).json({
              message: 'New Resource Type Created',
              result: newResourceTypeRef,
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
