import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const addPyq = (
    title: string,
    subjectCode: string,
    semester: string,
    instructorId: number,
    branch: string,
    url: string,
    isAnonymous: boolean,
    refetchPYQs: Function
) => {
    toast.promise(
        api.post('/api/db/pyqs', {
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
                refetchPYQs()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
