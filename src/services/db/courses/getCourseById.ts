import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: number
}

export const getCourseById = async ({ id }: Props) => {
    try {
        const { data } = await api.get('/api/db/courses?id=' + id)
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}
