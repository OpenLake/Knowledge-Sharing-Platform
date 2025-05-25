import { firestore } from '../../../../utils/firebaseInit';
import {
  collection,
  query as fbQuery,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
} from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

const profilesCollection = collection(firestore, 'profiles');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  const { email } = query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const q = fbQuery(profilesCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    const profileDoc = snapshot.docs[0]; 

    switch (method) {
      case 'GET':
        if (!profileDoc) {
          return res.status(404).json({ message: 'Profile not found' });
        }

        return res.status(200).json({ message: 'Profile Fetched', result: profileDoc.data(), id: profileDoc.id });

      case 'POST':
        if (profileDoc) {
          return res.status(409).json({ message: 'Profile with this email already exists' });
        }

        const created = await addDoc(profilesCollection, {
          ...body,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return res.status(201).json({ message: 'Profile created successfully', id: created.id });

      case 'PUT':
        if (!profileDoc) {
          return res.status(404).json({ message: 'Profile not found' });
        }

        const ref = doc(profilesCollection, profileDoc.id);
        await updateDoc(ref, {
          ...body,
          updatedAt: new Date().toISOString(),
        });

        return res.status(200).json({ message: 'Profile updated successfully' });

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (err) {
    console.error('Error handling profile:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err });
  }
}

