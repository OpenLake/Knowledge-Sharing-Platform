import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addNotes = (
    title: string,
    subjectCode: string,
    semester: string,
    instructorId: number,
    branch: string,
    url: string,
    isAnonymous: boolean,
    refetchNotes: Function
) => {
    toast.promise(
        api.post('/api/db/notes', {
            title,
            subjectCode,
            semester,
            instructorId,
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
