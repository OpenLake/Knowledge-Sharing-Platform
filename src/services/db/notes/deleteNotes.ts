import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const deleteNotes = (id: number, refetchNotes: Function) => {
    api.delete('/api/db/notes?id=' + id)
        .then((res) => {
            refetchNotes()
            toast.success(res.data.message)
        })
        .catch((err) => toast.error(err.message))
}
