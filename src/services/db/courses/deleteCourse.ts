import { toast } from 'react-hot-toast'
import { api } from '../../../utils/api'

export const deleteCourse = (id: string, refetchCourses: Function) => {
    api.delete('/api/db/courses?id=' + id)
        .then((res) => {
            refetchCourses()
            toast.success(res.data.message)
        })
        .catch((err) => toast.error(err.message))
}
