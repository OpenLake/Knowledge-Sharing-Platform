import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    id: number
    setCount: Dispatch<SetStateAction<number>>
    setIsUpvoted: Dispatch<SetStateAction<boolean>>
}

export const upvoteCourse = ({ id, setCount, setIsUpvoted }: Props) => {
    toast.promise(
        api.post('/api/db/courses/upvote', {
            course_id: id,
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
