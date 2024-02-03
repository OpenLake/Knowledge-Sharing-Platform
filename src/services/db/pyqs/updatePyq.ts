import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: number
    title: string
    subjectCode: string
    semester: string
    subjectName:string
    instructorName: string
    branch: string
    uploadedBy: string
    url: string
    isAnonymous: boolean
    refetch: Function
}

export const updatePyq = ({
    id,
    title,
    subjectCode,
    branch,
    instructorName,
    subjectName,
    uploadedBy,
    isAnonymous,
    refetch,
    semester,
    url,
}: Props) => {
    toast.promise(
        api.put('/api/db/pyqs?id=' + id, {
            title,
            subjectCode,
            semester,
            instructorName,
            uploadedBy,
            subjectName,
            branch,
            url,
            isAnonymous,
        }),
        {
            loading: 'Updating...',
            success: (res) => {
                refetch()
                return `${res.data.message}`
            },
            error: (err) => `Error: ${err.message}`,
        }
    )
}