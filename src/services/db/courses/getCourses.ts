import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const getCourses = async () => {
    try {
        const { data } = await api.get('/api/db/courses')
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}
