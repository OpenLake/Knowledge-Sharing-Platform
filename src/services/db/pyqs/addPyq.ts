import { toast } from "react-hot-toast"
import { api } from "../../../utils/api"

export const addPyq = (
    title: string,
    subjectCode: string,
    fromYear: string,
    toYear: string,
    studyingClass: string,
    branch: string,
    url: string,
    isAnonymous: boolean,
    refetchPYQs: Function
) => {
    toast.promise(
        api.post('/api/db/pyqs', {
            title,
            subjectCode,
            fromYear,
            toYear,
            studyingClass,
            branch,
            url,
            isAnonymous
        }),
        {
            loading: 'Adding...',
            success: (res) => {
                refetchPYQs()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`
        }
    )
}