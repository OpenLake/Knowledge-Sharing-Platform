import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addNotes = (
    title: string,
    subjectCode: string,
    batch: string,
    studyingClass: string,
    branch: string,
    url: string,
    isAnonymous: boolean,
    refetchNotes: Function
) => {
    toast.promise(
        api.post('/api/db/notes', {
            title,
            subjectCode,
            batch,
            studyingClass,
            branch,
            url,
            isAnonymous,
        }),
        {
            loading: 'Adding...',
            success: (res) => {
                refetchNotes()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
