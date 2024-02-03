import { firestore } from '../../../../utils/firebaseInit';
import { getAuth } from 'firebase/auth';
import {
  DocumentData,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  collection,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { query as firestoreQuery } from 'firebase/firestore';
import { adminAuth } from '../../../../utils/firebaseAdminInit';


export default async function coursesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body, query } = req;

  const coursesCollection = collection(firestore, 'courses');
  const auth = getAuth();

  switch (method) {
    case 'GET':
      try {
        if (query.code) {
          let q = query.code
          const courseDoc = await getDocs(firestoreQuery(collection(firestore, "courses"), where("code", "==", query.code)));

          if (courseDoc.docs[0].exists()) {
            const course = courseDoc.docs[0].data() as DocumentData;
            res.status(200).json({
              message: 'Course Fetched',
              result: course,
            });
          } else {
            res.status(404).json({
              message: 'Course not found',
            });
          }
        } else {
          const coursesSnapshot = await getDocs(coursesCollection);
          const courses = coursesSnapshot.docs.map((doc) => doc.data()) as DocumentData[];
          res.status(200).json({
            message: 'Courses Fetched',
            result: courses,
          });
        }
      } catch (err: any) {
        res.status(404).json({
          message: err,
        });
      }
      break;

    case 'POST':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!)
        try {
          if (user) {
            const { title, code, isAnonymous, instructorName } = body;
            const existingCourseSnapshot = await getDocs(
                firestoreQuery(coursesCollection, where('code', '==', code),where('instructorName', '==', instructorName))
            );
  
            if (!existingCourseSnapshot.empty) {
              res.status(405).json({
                message: 'Course Code already exists',
              });
              return;
            }
            await addDoc(coursesCollection, {
              title,
              code,
              isAnonymous,
              instructorName
            });

            res.status(201).json({
              message: 'New Course Created',
            });
          } else {
            res.status(401).json({
              message: 'Unauthorized Access1',
            });
          }
        } catch (err: any) {
          res.status(401).json({
            message: err,
          });
        }
      } else {
        res.status(401).json({
          message: 'Unauthorized Access3',
        });
      }
      break;

    case 'PUT':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!)
        try {
          if (user) {
            const { id } = query;
            const { title, code, instructorName, isAnonymous } = body;

            await updateDoc(doc(coursesCollection, id as string), {
              title,
              code,
              instructorName,
              anonymous: isAnonymous,
            });

            res.status(201).json({
              message: 'Course Updated',
            });
          } else {
            res.status(401).json({
              message: 'Unauthorized Access',
            });
          }
        } catch (err: any) {
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
        const user = await adminAuth.verifyIdToken(accessToken!)
        try {
          if (user) {
            const { id } = query;
            await deleteDoc(doc(coursesCollection, id as string));
            res.status(200).json({
              message: 'Course Deleted Successfully',
            });
          } else {
            res.status(401).json({
              message: 'Unauthorized Access',
            });
          }
        } catch (err: any) {
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
