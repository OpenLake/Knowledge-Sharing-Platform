import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    id: number
    subjectCode: string
    semester: string
    resourceType: string,
    resourceNumber:number,
    description:string,
    instructorName: string
    subjectName:string
    uploadedBy:string
    branch: string
    url: string
    isAnonymous: boolean
    refetch: Function
}

export const updateNote = ({
    id,
    subjectCode,
    branch,
    instructorName,
    description,
    resourceNumber,
    subjectName,
    resourceType,
    uploadedBy,
    isAnonymous,
    refetch,
    semester,
    url,
}: Props) => {
    toast.promise(
        api.put('/api/db/notes?id=' + id, {
            subjectCode,
            semester,
            instructorName,
            resourceType,
            subjectName,
            resourceNumber,
            description,
            uploadedBy,
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
