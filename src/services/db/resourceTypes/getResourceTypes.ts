import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const getResourceTypes = async () => {
    try {
        const { data } = await api.get('/api/db/resourceTypes')
        const { result } = data
        return result
    } catch (err: any) {
        toast.error(err.message)
    }
}