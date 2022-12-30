import { toast } from "react-hot-toast"
import { api } from "../../../utils/api"

export const getSubjects = async () => {
    try {
        const { data } = await api.get('/api/db/subjects')
        const { result } = data
        return result
    }
    catch (err: any) {
        toast.error(err.message)
    }
}