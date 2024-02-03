import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addSubject = async (subjectName: string, subjectCode: string) => {
    try {
        const { data } = await api.post('/api/db/subjects', {
            code:subjectCode,
            name:subjectName,
        })
        toast.success(data.message)
    } catch (err: any) {
        toast.error(err.message)
    }
}
