import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    title: string
    subjectCode: string
    semester: string
    subjectName: string
    instructorName: string
    branch: string
    url: string
    uploadedBy: string
    isAnonymous: boolean
    refetch: Function
}

export const addNotes = ({
    title,
    subjectCode,
    branch,
    subjectName,
    instructorName,
    isAnonymous,
    uploadedBy,
    refetch,
    semester,
    url,
}: Props) => {
    toast.promise(
        api.post('/api/db/notes', {
            title,
            subjectCode,
            semester,
            subjectName,
            instructorName,
            uploadedBy,
            branch,
            url,
            isAnonymous,
        }),
        {
            loading: 'Adding...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}
