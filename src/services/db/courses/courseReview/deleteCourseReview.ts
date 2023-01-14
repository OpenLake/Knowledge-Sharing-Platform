import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    id: number
    refetch: Function
}

export const deleteCourseReview = ({ id, refetch }: Props) => {
    toast.promise(api.delete('/api/db/courses/review?id=' + id), {
        loading: 'Loading...',
        success: (res) => {
            refetch()
            return `${res.data.message}`
        },
        error: (err) => `Error: ${err.message}`,
    })
}
