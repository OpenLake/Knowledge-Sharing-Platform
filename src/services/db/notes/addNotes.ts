import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    subjectCode: string
    semester: string
    resourceType: string,
    description:string,
    resourceNumber:number,
    subjectName: string
    instructorName: string
    branch: string
    url: string
    uploadedBy: string
    isAnonymous: boolean
    refetch: Function
}

export const addNotes = ({
    subjectCode,
    branch,
    subjectName,
    instructorName,
    resourceType,
    resourceNumber,
    description,
    isAnonymous,
    uploadedBy,
    refetch,
    semester,
    url,
}: Props) => {
    toast.promise(
        api.post('/api/db/notes', {
            subjectCode,
            semester,
            subjectName,
            resourceType,
            instructorName,
            description,
            resourceNumber,
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
