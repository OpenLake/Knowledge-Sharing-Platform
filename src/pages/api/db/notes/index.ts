import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../utils/firebaseInit';
import { adminAuth } from '../../../../utils/firebaseAdminInit';
import { filterBadWords } from './badWordFilter';
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import axios from 'axios';

const notesCollection = 'notes';

export default async function noteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers, body, query } = req;

  switch (method) {
    case 'GET':
      try {
        const notesSnapshot = await getDocs(collection(firestore, notesCollection));
        const notes = notesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched Notes:', notes);
        res.status(200).json({
          message: 'Notes Fetched',
          result: notes,
        });
      } catch (err: any) {
        console.log(err);
        res.status(405).json({
          error: err.message || 'An error occurred',
        });
      }
      break;

    case 'POST':
      if (headers && headers.authorization) {
        const accessToken = headers.authorization.split(' ')[1];
        const user = await adminAuth.verifyIdToken(accessToken!);

        if (user) {
          const {
            title,
            subjectCode,
            semester,
            subjectName,
            branch,
            uploadedBy,
            instructorName,
            url,
            isAnonymous,
          } = body;

          try {
            const response = await axios.get(url);
            const content = response.data;

            const profanityCheckResponse = await filterBadWords(content);

            if ('is-bad' in profanityCheckResponse && profanityCheckResponse['is-bad']) {
              throw new Error('Profanity detected in the content');
            }

            const newNoteRef = await addDoc(collection(firestore, notesCollection), {
              title,
              subject_code: subjectCode,
              branch,
              semester,
              subjectName,
              instructorName,
              uploadedBy,
              url,
              anonymous: isAnonymous,
              created_by_id: user.user_id,
              content,
            });

            res.status(201).json({
              message: 'Notes Created',
              result: {
                id: newNoteRef.id,
                ...body,
                created_by_id: user.user_id,
              },
            });
          } catch (err: any) {
            console.log(err);
            res.status(405).json({
              error: err.message || 'An error occurred',
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
            const { id } = query;
            const {
              title,
              subjectCode,
              semester,
              subjectName,
              branch,
              instructorName,
              uploadedBy,
              url,
              isAnonymous,
              content,
            } = body;

            await filterBadWords(content);

            const noteRef = doc(firestore, notesCollection, id as string);
            const noteDoc = await getDoc(noteRef);

            if (noteDoc.exists()) {
              const noteData = noteDoc.data();

              if (user.user_id === noteData.created_by_id) {
                await updateDoc(noteRef, {
                  title,
                  subject_code: subjectCode,
                  branch,
                  semester,
                  subjectName,
                  instructorName,
                  uploadedBy,
                  url,
                  anonymous: isAnonymous,
                  created_by_id: user.user_id,
                  content,
                });

                res.status(200).json({
                  message: 'Notes Updated',
                });
              } else {
                res.status(405).json({
                  message: 'Unauthorized Access',
                });
              }
            } else {
              res.status(404).json({
                message: 'No Notes Found',
              });
            }
          } catch (err: any) {
            console.log(err);
            res.status(405).json({
              error: err.message || 'An error occurred',
            });
          }
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
            const { id } = query;
            const noteRef = doc(firestore, notesCollection, id as string);
            const noteDoc = await getDoc(noteRef);

            if (noteDoc.exists()) {
              const noteData = noteDoc.data();
              if (user.user_id === noteData.created_by_id) {
                await deleteDoc(noteRef);

                res.status(200).json({
                  message: 'Notes Deleted Successfully',
                });
              } else {
                res.status(405).json({
                  message: 'Unauthorized Access',
                });
              }
            } else {
              res.status(404).json({
                message: 'No Notes Found',
              });
            }
          } catch (err: any) {
            console.log(err);
            res.status(405).json({
              error: err.message || 'An error occurred',
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
