import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    code: string
    refetch: Function
}

export const deleteCourseReview = ({ code, refetch }: Props) => {
    toast.promise(api.delete('/api/db/courses/review?code=' + code), {
        loading: 'Loading...',
        success: (res) => {
            refetch()
            return `${res.data.message}`
        },
        error: (err) => `Error: ${err.message}`,
    })
}
