import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const getProfile = async () => {
    try {
        const { data } = await api.get('/api/db/profile')
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}
