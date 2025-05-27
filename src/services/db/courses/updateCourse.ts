import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'
import { Bool } from 'aws-sdk/clients/clouddirectory'

interface Props {
    id: string
    code: string
    title: string
    department: string
    credits: number
    instructor: string
    refetch: Function
}

export const updateCourse = ({
    id,
    title,
    code,
    credits,
    refetch,
}: Props) => {
    toast.promise(
        api.put('/api/db/courses?id=' + id, {
            title,
            code,
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
