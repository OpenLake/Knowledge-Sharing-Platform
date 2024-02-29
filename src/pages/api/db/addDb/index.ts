import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const branchesCollection = 'branches';
const instructorsCollection = 'instructors';
const resourceTypeCollection = 'resourceTypes';
const semestersCollection = 'semesters';
const subjectsCollection = 'subjects';

export default async function DbHandler(
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
          const {
            subjectCode,
            resourceType,
            semester,
            subjectName,
            branch,
            instructorName
          } = body;
          try {
            if(subjectCode!='' && subjectName!=''){
                const newSubjectRef = await addDoc(collection(firestore, subjectsCollection), {
                    code: subjectCode,
                    name: subjectName
                });

                res.status(201).json({
                    message: 'Database Modified',
                    result: {
                      id: newSubjectRef.id,
                      ...body,
                      created_by_id: user.user_id,
                    },
                  });
            }
            if(resourceType!=''){
                const newResourceTypeRef = await addDoc(collection(firestore, resourceTypeCollection), {
                    resourceType:resourceType
                });

                res.status(201).json({
                    message: 'Database Modified',
                    result: {
                      id: newResourceTypeRef.id,
                      ...body,
                      created_by_id: user.user_id,
                    },
                  });
            }
            if(semester!=''){
                const newSemesterRef = await addDoc(collection(firestore, semestersCollection), {
                    semester:semester
                });

                res.status(201).json({
                    message: 'Database Modified',
                    result: {
                      id: newSemesterRef.id,
                      ...body,
                      created_by_id: user.user_id,
                    },
                  });
            }
            if(branch!=''){
                const newBranchRef = await addDoc(collection(firestore, branchesCollection), {
                    branch:branch
                });

                res.status(201).json({
                    message: 'Database Modified',
                    result: {
                      id: newBranchRef.id,
                      ...body,
                      created_by_id: user.user_id,
                    },
                  });
            }
            if(instructorName!=''){
                const newInstructorNameRef = await addDoc(collection(firestore, instructorsCollection), {
                    instructorName:instructorName
                });

                res.status(201).json({
                    message: 'Database Modified',
                    result: {
                      id: newInstructorNameRef.id,
                      ...body,
                      created_by_id: user.user_id,
                    },
                  });
            }
            
          } catch (err: any) {
            console.log(err);
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
