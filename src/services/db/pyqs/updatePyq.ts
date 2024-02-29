import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: number
    subjectCode: string
    semester: string
    subjectName:string
    instructorName: string
    resourceNumber:number
    description:string
    branch: string
    uploadedBy: string
    url: string
    isAnonymous: boolean
    refetch: Function
}

export const updatePyq = ({
    id,
    subjectCode,
    branch,
    instructorName,
    subjectName,
    description,
    resourceNumber,
    uploadedBy,
    isAnonymous,
    refetch,
    semester,
    url,
}: Props) => {
    toast.promise(
        api.put('/api/db/pyqs?id=' + id, {
            subjectCode,
            semester,
            instructorName,
            resourceNumber,
            description,
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