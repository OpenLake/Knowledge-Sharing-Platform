import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../../../../../utils/api'

interface Props {
    id: number
    setCount: Dispatch<SetStateAction<number>>
    setIsUpvoted: Dispatch<SetStateAction<boolean>>
}

export const upvoteCourseReview = ({ id, setCount, setIsUpvoted }: Props) => {
    toast.promise(
        api.post('/api/db/courses/review_upvote', {
            course_review_id: id,
        }),
        {
            loading: 'Loading...',
            success: (res) => {
                setCount((prevCount: any) => {
                    return prevCount + 1
                })
                setIsUpvoted(true)
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
