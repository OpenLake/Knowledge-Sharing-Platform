import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    id: number
    setCount: React.Dispatch<React.SetStateAction<number>>;
    setIsUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const removePyqUpvote = (e: React.MouseEvent<HTMLButtonElement>, { id, setCount, setIsUpvoted }: Props) => {
    toast.promise(api.delete('/api/db/pyqs/upvote?id=' + id), {
        loading: 'Loading...',
        success: (res) => {
            setCount((prevCount: any) => {
                return prevCount - 1;
            });
            setIsUpvoted(false);
            return `${res.data.message}`;
        },
        error: (err) => `Error: ${err.message}`,
    });
};

