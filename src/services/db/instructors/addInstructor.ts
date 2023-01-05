import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addInstructor = async (instructorName: string) => {
    try {
        const { data } = await api.post('/api/db/instructors', {
            instructorName,
        })
        toast.success(data.message)
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}
