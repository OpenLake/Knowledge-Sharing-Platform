import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    title: string
    code: string
    instructorName:string
    isAnonymous: boolean
    refetch: Function
}

export const addCourse = ({
    title,
    code,
    instructorName,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/courses', {
            title,
            code,
            instructorName,
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
