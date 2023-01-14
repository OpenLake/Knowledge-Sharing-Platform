import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    id: number
    comment: string
    rating: number
    isAnonymous: boolean
    refetch: Function
}

export const updateCourseReview = ({
    id,
    comment,
    rating,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.put('/api/db/courses/review?id=' + id, {
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
