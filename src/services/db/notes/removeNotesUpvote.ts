import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    id: number
    setCount: Dispatch<SetStateAction<number>>
    setIsUpvoted: Dispatch<SetStateAction<boolean>>
}

export const removeNotesUpvote = ({ id, setCount, setIsUpvoted }: Props) => {
    toast.promise(api.delete('/api/db/notes/upvote?id=' + id), {
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
