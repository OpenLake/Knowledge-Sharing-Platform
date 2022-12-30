import { toast } from "react-hot-toast"
import { api } from "../../../utils/api"

export const deletePyq = (id: number, refetchPYQs: Function) => {
    api.delete('/api/db/pyqs?id=' + id)
        .then((res) => {
            refetchPYQs()
            toast.success(res.data.message)
        })
        .catch((err) => toast.error(err.message))
}