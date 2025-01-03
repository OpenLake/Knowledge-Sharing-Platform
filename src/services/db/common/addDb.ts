import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

interface Props {
    subjectCode: string
    semester: string
    resourceType: string,
    subjectName: string
    instructorName: string
    branch: string
    refetch: Function
}

export const addDb = ({
    subjectCode,
    branch,
    subjectName,
    instructorName,
    resourceType,
    refetch,
    semester,
}: Props) => {
    toast.promise(
        api.post('/api/db/addDb', {
            subjectCode,
            semester,
            subjectName,
            resourceType,
            instructorName,
            branch
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
