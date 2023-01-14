import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { toast } from 'react-hot-toast'
import { ModalContainer } from '../../Common/ModalContainer'

export const Modal: FC<{
    isUpdateModal?: boolean
    header: string
    courseId: number
    actionButtonText: string
    actionFunction: Function
    showModal: boolean
    refetch: Function
    setShowModal: Dispatch<SetStateAction<boolean>>
    selectedEntity?: any
}> = ({
    header,
    courseId,
    refetch,
    showModal,
    actionButtonText,
    actionFunction,
    setShowModal,
    selectedEntity,
    isUpdateModal = false,
}) => {
    //? states
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [comment, setComment] = useState<string>('')
    const [rating, setRating] = useState<number>(0)
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false)

    //? functions
    const actionHandler = async (e: any) => {
        e.preventDefault()
        if (comment === '' || rating === 0) {
            toast.error('Please fill all the details!')
        } else {
            setIsLoading(true)
            actionFunction({
                id: isUpdateModal ? selectedEntity.id : null,
                courseId,
                comment,
                rating,
                isAnonymous,
                refetch,
            })
            setRating(0)
            setComment('')
            setIsAnonymous(false)
            setShowModal(false)
            setIsLoading(false)
        }
    }

    const onRatingChangeHandler = (newRating: any) => {
        setRating(newRating)
    }

    //? effects
    useEffect(() => {
        if (selectedEntity) {
            setComment(selectedEntity.comment)
            setRating(selectedEntity.rating)
            setIsAnonymous(selectedEntity.anonymous)
        }
    }, [selectedEntity])

    useEffect(() => {
        const keyPressHandler = (event: any) => {
            if (event.key === 'Escape') {
                setShowModal(false)
            }
        }
        document.addEventListener('keydown', keyPressHandler, false)

        return () =>
            document.removeEventListener('keydown', keyPressHandler, false)
    }, [setShowModal])

    return (
        <ModalContainer
            header={header}
            setShowModal={setShowModal}
            showModal={showModal}
        >
            <div className="flex flex-col p-10 space-y-4">
                {/* Rating */}
                <div className="flex gap-3 items-center">
                    <span className="font-semibold">Rating: </span>
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={onRatingChangeHandler}
                        size={30}
                        color2={'#ffd700'}
                    />
                </div>

                {/* Title */}
                <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Comment</span>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={'e.g. This course is really helpful'}
                        rows={6}
                        className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md"
                    />
                </div>

                {/* Anonymous */}
                <div className="flex flex-col space-y-1">
                    <span className="font-semibold">
                        Do you want it post as Anonymous?
                    </span>
                    <label className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={() => setIsAnonymous(!isAnonymous)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <button
                    disabled={isLoading}
                    onClick={actionHandler}
                    type="submit"
                    className="flex items-center w-fit space-x-2 p-2 duration-200 transition-all rounded-md shadow-md hover:shadow-xl disabled:cursor-not-allowed disabled:bg-primary/70 bg-primary text-white font-semibold"
                >
                    <p>{actionButtonText}</p>
                </button>
            </div>
        </ModalContainer>
    )
}
