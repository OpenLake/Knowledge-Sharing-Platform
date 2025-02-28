import { firestore as db } from '../../../../utils/firebaseInit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, increment } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

const COLLECTION_NAME = 'colleges';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const collegesRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(collegesRef);
        const colleges = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.status(200).json({ colleges });
      } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ error: 'Failed to fetch colleges' });
      }
      break;

    case 'POST':
      try {
        const body = req.body;
        const collegesRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(collegesRef, {
          ...body,
          likes: 0,  // Initialize likes count
          createdAt: new Date().toISOString()
        });
        res.status(200).json({ id: docRef.id, ...body });
      } catch (error) {
        console.error('Error adding college:', error);
        res.status(500).json({ error: 'Failed to add college' });
      }
      break;

    case 'PUT':
      try {
        const { id, action } = req.body;
        const collegeRef = doc(db, COLLECTION_NAME, id);

        if (action === 'like') {
          await updateDoc(collegeRef, { likes: increment(1) });
        } else {
          await updateDoc(collegeRef, req.body);
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error updating college:', error);
        res.status(500).json({ error: 'Failed to update college' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const collegeRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(collegeRef);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting college:', error);
        res.status(500).json({ error: 'Failed to delete college' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
