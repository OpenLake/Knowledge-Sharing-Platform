import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: number;
    title: string;
    code: string;
    isAnonymous: boolean;
    refetch: Function;
}

export const updateCourse = ({
    id,
    title,
    code,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.put('/api/db/courses?id=' + id, {
            title,
            code,
            anonymous:isAnonymous,
        }),
        {
            loading: 'Updating...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
