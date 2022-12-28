import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const getNotes = async () => {
    try {
        const { data } = await api.get('/api/db/notes')
        return data.result
    }
    catch (err: any) {
        toast.error(err.message)
    }
}