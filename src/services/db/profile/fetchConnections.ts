import { firestore } from '../../../utils/firebaseInit';
import { ProfileData } from '../../../types/profileColumnData';
import {
  collection,
  doc,
  getDocs,
  CollectionReference,
} from 'firebase/firestore';

export interface Connection {
  name: string;
  profileImage: string;
  email: string;
}

export const fetchConnections = async (userEmail: string): Promise<Connection[]> => {
  try {
    const userConnectionsRef = collection(
      doc(collection(firestore, 'connections'), userEmail),
      'userConnections'
    );

    const snapshot = await getDocs(userConnectionsRef);

    const connections: Connection[] = snapshot.docs.map((doc) => {
      const profile = doc.data();
      return {
        name: profile.name || 'Unnamed',
        email: profile.email,
        profileImage: profile.profileImage || '/profile.jpeg',
      };
    });

    return connections;
  } catch (error) {
    console.error('Failed to fetch connections:', error);
    return [];
  }
};

