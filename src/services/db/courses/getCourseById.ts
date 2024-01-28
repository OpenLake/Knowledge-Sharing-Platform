import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    code: string
}

export const getCourseById = async ({ code }: Props) => {
    try {
        const { data } = await api.get('/api/db/courses?code=' + code)
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}