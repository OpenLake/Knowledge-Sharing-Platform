import { firestore } from '../../../../utils/firebaseInit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

const profilesCollection = collection(firestore, 'profiles');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  switch (method) {
    case 'GET':
      try {
        const { id } = query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ message: 'Profile ID is required' });
        }

        const profileDoc = await getDoc(doc(profilesCollection, id));
        if (!profileDoc.exists()) {
          return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile Fetched', result: profileDoc.data() });
      } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err });
      }
      break;

    case 'PUT':
      try {
        const { id } = query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ message: 'Profile ID is required' });
        }

        const profileRef = doc(profilesCollection, id);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          await setDoc(profileRef, body);
        } else {
          await updateDoc(profileRef, body);
        }

        res.status(200).json({ message: 'Hoorayy! Profile Updated' });
      } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}

