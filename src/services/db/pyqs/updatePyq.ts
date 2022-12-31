import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const updatePyq = (
    id: number,
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
        api.put('/api/db/pyqs?id=' + id, {
            title,
            subjectCode,
            fromYear,
            toYear,
            studyingClass,
            branch,
            url,
            isAnonymous,
        }),
        {
            loading: 'Updating...',
            success: (res) => {
                refetchPYQs()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
