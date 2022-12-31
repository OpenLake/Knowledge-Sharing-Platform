import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const getPyqs = async () => {
    try {
        const { data } = await api.get('/api/db/pyqs')
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}
