import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    code: string
    comment: string
    rating: number
    isAnonymous: boolean
    refetch: Function
}

export const addCourseReview = ({
    code,
    comment,
    isAnonymous,
    rating,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/courses/review', {
            code,
            comment,
            isAnonymous,
            rating,
        }),
        {
            loading: 'Loading...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
