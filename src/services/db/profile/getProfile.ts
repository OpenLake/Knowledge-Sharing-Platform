import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';

export const getProfile = async (email: string) => {
  try {
    if (!email) throw new Error("Email is required");

    const { data } = await api.get(`/api/db/profile?email=${encodeURIComponent(email)}`);
    
    if (!data?.result) {
      console.warn(`No profile found for ${email}`);
      return null;
    }
    
    return data.result as ProfileData;
  } catch (err) {
    console.error(`Profile fetch failed for ${email}:`, err);
    throw err; 
  }
};

