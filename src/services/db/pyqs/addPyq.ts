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

export const addPyq = ({
    title,
    subjectCode,
    semester,
    subjectName,
    instructorName,
    branch,
    uploadedBy,
    url,
    isAnonymous,
    refetch,
}: Props) => {
    toast.promise(
        api.post('/api/db/pyqs', {
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