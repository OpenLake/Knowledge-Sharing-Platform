import { firestore as db } from '../../../../utils/firebaseInit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc , increment } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

const COLLECTION_NAME = 'profReviews';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const reviewsRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(reviewsRef);
        const reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.status(200).json({ reviews });
      } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
      }
      break;

    case 'POST':
      try {
        const body = req.body;
        const reviewsRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(reviewsRef, {
          ...body,
          date: new Date().toISOString(),
          upvotes: 0,
          comments: []
        });
        res.status(200).json({ id: docRef.id, ...body });
      } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review' });
      }
      break;

      case 'PUT':
        try {
          const body = await req.body;
          const { id, userId, ...updateData } = body;
          if (!id) {
            res.status(400).json({ error: 'Review ID is required' });
          }
      
          if (!userId) {
            res.status(401).json({ error: 'User must be authenticated' });
          }
          const reviewRef = doc(db, COLLECTION_NAME, id);
          await updateDoc(reviewRef, updateData);
          res.json({ success: true, id, ...updateData });
        } catch (error) {
          console.error('Error updating review:', error);
          res.status(500).json({ error: 'Failed to update review' });
        }
        break;
      

    case 'DELETE':
      try {
        const { id } = req.body;
        const reviewRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(reviewRef);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
