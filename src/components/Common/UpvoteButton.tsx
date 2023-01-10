import { FC, useEffect, useState } from 'react'
import { useAuth } from '../../contexts/auth'
import { toast } from 'react-hot-toast'

export const UpvoteButton: FC<{
    upvotesCount: number
    users: Array<{ user_id: string }>
    id: number
    upvoteHandler: Function
    removeUpvoteHandler: Function
}> = ({ users, id, upvotesCount, upvoteHandler, removeUpvoteHandler }) => {
    //? states
    const [count, setCount] = useState<number>(0)
    const [isUpvoted, setIsUpvoted] = useState<boolean>(true)

    //? context
    const { user: currentUser }: any = useAuth()

    //? effects
    useEffect(() => {
        setCount(upvotesCount)
    }, [upvotesCount])

    useEffect(() => {
        users.find((user: any) => currentUser?.user_id === user.user_id)
            ? setIsUpvoted(true)
            : setIsUpvoted(false)
    }, [users, currentUser])

    return (
        <div className="flex space-x-1 items-center justify-center">
            {isUpvoted ? (
                <button
                    onClick={() => {
                        removeUpvoteHandler({
                            id,
                            setCount,
                            setIsUpvoted,
                        })
                    }}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 4 3 15h6v5h6v-5h6z"
                            className="icon_svg-stroke icon_svg-fill"
                            strokeWidth="1.5"
                            stroke="#0b759d"
                            fill={'#0b759d'}
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </button>
            ) : (
                <button
                    onClick={() => {
                        if (currentUser) {
                            upvoteHandler({
                                id,
                                setCount,
                                setIsUpvoted,
                            })
                        } else
                            toast('Please login to upvote', {
                                icon: 'ℹ️',
                            })
                    }}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 4 3 15h6v5h6v-5h6z"
                            className="icon_svg-stroke icon_svg-fill"
                            strokeWidth="1.5"
                            stroke="#0b759d"
                            fill={'none'}
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </button>
            )}
            <span className="font-semibold">{count}</span>
        </div>
    )
}
