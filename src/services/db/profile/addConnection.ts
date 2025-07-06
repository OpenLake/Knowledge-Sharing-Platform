// src/services/db/profile/addConnection.ts

import { firestore } from '../../../utils/firebaseInit'
import { doc, setDoc } from 'firebase/firestore'
import { ProfileData } from '../../../types/profileColumnData'

export const addConnection = async (
  currentUser: ProfileData,
  targetUser: ProfileData
): Promise<boolean> => {
  try {
    const currentEmail = currentUser?.email?.toLowerCase().trim()
    const targetEmail = targetUser?.email?.toLowerCase().trim()

    if (!currentEmail || !targetEmail || currentEmail === targetEmail) {
      console.warn("Invalid or same email, skipping connection.")
      return false
    }

    const currentUserDocRef = doc(
      firestore,
      'connections',
      currentEmail,
      'userConnections',
      targetEmail
    )

    const targetUserDocRef = doc(
      firestore,
      'connections',
      targetEmail,
      'userConnections',
      currentEmail
    )

    await Promise.all([
      setDoc(currentUserDocRef, {
        name: targetUser.name || 'Unnamed',
        email: targetEmail,
        profileImage: targetUser.profileImage || '/profile.jpeg',
      }),
      setDoc(targetUserDocRef, {
        name: currentUser.name || 'Unnamed',
        email: currentEmail,
        profileImage: currentUser.profileImage || '/profile.jpeg',
      }),
    ])

    return true
  } catch (err) {
    console.error('❌ Failed to connect users:', err)
    return false
  }
}

