import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: string
    code: string
    title: string
    department: string
    credits: number
    instructor: string
    refetch: Function
}

export const addCourse = ({
    title,
    code,
    instructor,
    credits,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/courses', {
            title,
            code,
            instructor,
            credits,
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
