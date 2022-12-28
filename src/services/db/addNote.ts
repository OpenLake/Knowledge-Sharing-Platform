import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const addNote = (
    title: string,
    subjectCode: string,
    batch: string,
    studyingClass: string,
    branch: string,
    url: string
) => {
    toast.promise(
        api.post('/api/db/notes', {
            title,
            subjectCode,
            batch,
            studyingClass: studyingClass,
            branch,
            url
        }),
        {
            loading: 'Adding...',
            success: (res) => `${res.data.message}`,
            error: (err) => `Error: ${err.message}`
        }
    )
}