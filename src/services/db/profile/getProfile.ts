import { ProfileData } from '../../../types/profileColumnData';
import { api } from '../../../utils/api';

export const getProfile = async (email: string): Promise<ProfileData> => {
  try {
    if (!email) throw new Error("Email is required");

    const { data } = await api.get(`/api/db/profile?email=${encodeURIComponent(email)}`);

    if (!data?.result) {
      console.warn(`No profile data found for ${email}`);
      return null as any;
    }

    return data.result as ProfileData;

  } catch (err: any) {
    if (err.response?.status === 404) {
      console.log("No profile found, creating one...");

      const defaultProfile: ProfileData = {
        name: '',
        email,
        branch: '',
        college: '',
        bio: '',
        profileImage: '',
      };

      try {
        await api.post(`/api/db/profile?email=${encodeURIComponent(email)}`, defaultProfile);
        return defaultProfile;
      } catch (postErr) {
        console.error("Profile creation failed:", postErr);
        throw postErr;
      }
    }

    console.error(`Profile fetch failed for ${email}:`, err);
    throw err;
  }
};

