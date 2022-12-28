import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const addSubject = (subjectName: string, subjectCode: string) => {
    api.post('/api/db/subjects', {
        subjectCode,
        subjectName
    })
        .then((res) => {
            toast.success(res.data.message)
        })
        .catch((err) => {
            toast.error(err.message)
        })
}