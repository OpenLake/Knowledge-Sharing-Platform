// /pages/api/db/pyqs/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore as db } from '../../../../utils/firebaseInit';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion
} from 'firebase/firestore';

const COLLECTION_NAME = 'pyqs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const pyqsRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(pyqsRef);
        const pyqs = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        return res.status(200).json({ pyqs });
      } catch (error) {
        console.error('Error fetching PYQs:', error);
        return res.status(500).json({ error: 'Failed to fetch PYQs' });
      }

    case 'POST':
      try {
        const body = req.body;
        const requiredFields = ['title', 'fileUrl', 'fileType', 'course', 'userId', 'userName'];
        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
          return res
            .status(400)
            .json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const pyqsRef = collection(db, COLLECTION_NAME);
        const newData = {
          ...body,
          createdAt: new Date().toISOString(),
          upvotes: body.upvotes || 0,
          comments: body.comments || [],
          upvotedBy: body.upvotedBy || []
        };
        const docRef = await addDoc(pyqsRef, newData);
        return res.status(200).json({ id: docRef.id, ...newData });
      } catch (error) {
        console.error('Error adding PYQ:', error);
        return res.status(500).json({ error: 'Failed to add PYQ' });
      }

      case 'PUT':
        try {
          const { id, commentId, userId, newComment } = req.body;
          if (!id) return res.status(400).json({ error: 'PYQ ID is required' });
      
          const pyqRef = doc(db, COLLECTION_NAME, id);
          const docSnap = await getDoc(pyqRef);
          if (!docSnap.exists()) return res.status(404).json({ error: 'PYQ not found' });
      
          const existingData = docSnap.data();
      
          if (newComment) {
            await updateDoc(pyqRef, {
              comments: arrayUnion(newComment),
            });
            return res.status(200).json({ success: true, id, newComment });
          } else if (commentId) {
            const commentToDelete = existingData.comments.find((c: any) => c.id === commentId);
            if (!commentToDelete) return res.status(404).json({ error: 'Comment not found' });
      
            if (commentToDelete.userId !== userId) {
              return res.status(403).json({ error: 'Unauthorized: Cannot delete this comment' });
            }
      
            await updateDoc(pyqRef, {
              comments: existingData.comments.filter((c: any) => c.id !== commentId),
            });
      
            return res.status(200).json({ success: true, id, commentId });
          }
      
          return res.status(400).json({ error: 'Invalid request' });
        } catch (error) {
          console.error('Error updating PYQ:', error);
          return res.status(500).json({ error: 'Failed to update PYQ' });
        }
           
    case 'DELETE':
      try {
        const { id, userId } = req.body;
        if (!id) return res.status(400).json({ error: 'PYQ ID is required' });
        if (!userId) return res.status(401).json({ error: 'User must be authenticated' });

        const pyqRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(pyqRef);
        if (!docSnap.exists()) return res.status(404).json({ error: 'PYQ not found' });

        const existingData = docSnap.data();
        if (existingData.userId !== userId) {
          return res.status(403).json({ error: 'Unauthorized' });
        }

        await deleteDoc(pyqRef);
        return res.status(200).json({ success: true, id });
      } catch (error) {
        console.error('Error deleting PYQ:', error);
        return res.status(500).json({ error: 'Failed to delete PYQ' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
