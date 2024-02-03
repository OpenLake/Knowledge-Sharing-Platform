import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    code: string
    comment: string
    rating: number
    isAnonymous: boolean
    refetch: Function
}

export const updateCourseReview = ({
    code,
    comment,
    rating,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.put('/api/db/courses/review?code=' + code, {
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
