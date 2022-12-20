import { useAuth } from "../contexts/auth";
import useSWR, { mutate } from 'swr'
import { api } from "../utils/api";

export default function Notes() {
    const { user, loading }: any = useAuth();
    // const { data: { data: pages } = {}, isValidating } = useSWR(loading ? false : '/pages', api.get)

    return (
        <div className="h-screen">notes</div>
    )
}