import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    title: string
    code: string
    isAnonymous: boolean
    refetch: Function
}

export const addCourse = ({ title, code, isAnonymous, refetch }: Props) => {
    toast.promise(
        api.post('/api/db/courses', {
            title,
            code,
            isAnonymous,
        }),
        {
            loading: 'Adding...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
