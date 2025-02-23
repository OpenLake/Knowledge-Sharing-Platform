import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';

interface Props {
  id: number;
  name: string;
  email: string;
  bio: string;
}

export const updateProfile = async ({ id, name, email, bio }: Props) => {
  try {
    const res = await api.put(`/api/db/profile?id=${id}`, { name, email, bio });
    toast.success(res.data.message);
    return res.data; 
  } catch (err: any) {
    toast.error(`Error: ${err.message}`);
    throw err; 
  }
};

