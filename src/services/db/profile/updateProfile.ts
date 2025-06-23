import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import { ProfileData } from '../../../types/profileColumnData';

export const updateProfile = async (profile: ProfileData) => {
  try {
    if (!profile.email) throw new Error("Email is required");

    const res = await api.put(`/api/db/profile?email=${encodeURIComponent(profile.email)}`, profile);
    toast.success(res.data.message);
    return res.data;
  } catch (err: any) {
    toast.error(`Error: ${err.message}`);
    throw err;
  }
};

