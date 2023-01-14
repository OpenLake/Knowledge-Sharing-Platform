import { toast } from 'react-hot-toast'
import { api } from '../../../../utils/api'

interface Props {
    courseId: number
    comment: string
    rating: number
    isAnonymous: boolean
    refetch: Function
}

export const addCourseReview = ({
    courseId,
    comment,
    isAnonymous,
    rating,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/courses/review', {
            course_id: courseId,
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
