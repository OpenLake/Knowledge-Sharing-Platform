import { firestore } from '../../../utils/firebaseInit';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export const getUserCourses = async (email: string) => {
  try {
    const q = query(collection(firestore, 'userCourses'), where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (err: any) {
    console.error("Failed to fetch user courses:", err);
    return [];
  }
};

