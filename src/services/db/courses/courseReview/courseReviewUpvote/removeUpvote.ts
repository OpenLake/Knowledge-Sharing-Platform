import { Dispatch, SetStateAction } from 'react'
import { api } from '../../../../../utils/api'
import { toast } from 'react-hot-toast'

interface Props {
    id: number
    setCount: Dispatch<SetStateAction<number>>
    setIsUpvoted: Dispatch<SetStateAction<boolean>>
}

export const removeCourseReviewUpvote = ({
    id,
    setCount,
    setIsUpvoted,
}: Props) => {
    toast.promise(api.delete('/api/db/courses/review_upvote?id=' + id), {
        loading: 'Loading...',
        success: (res) => {
            setCount((prevCount: any) => {
                return prevCount - 1
            })
            setIsUpvoted(false)
            return `${res.data.message}`
        },
        error: (err) => `Error: ${err.message}`,
    })
}
