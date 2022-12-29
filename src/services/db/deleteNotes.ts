import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const deleteNotes = (id: number) => {
    api.delete('/api/db/notes?id=' + id)
        .then((res) => toast.success(res.data.message))
        .catch((err) => toast.error(err.message))
}