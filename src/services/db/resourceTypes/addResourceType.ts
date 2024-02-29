import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addResourceType = async (resourceType: string) => {
    try {
        const { data } = await api.post('/api/db/resourceTypes', {
            resourceType,
        })
        toast.success(data.message)
        return data.result
    } catch (err: any) {
        toast.error(err.message)
    }
}