import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ModalContainer } from '../Common/ModalContainer'
import { Input } from '../Common/Input'

export const Modal: FC<{
    isUpdateModal?: boolean
    header: string
    actionButtonText: string
    actionFunction: Function
    showModal: boolean
    refetch: Function
    setShowModal: Dispatch<SetStateAction<boolean>>
    selectedEntity?: any
}> = ({
    header,
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
    const [title, setTitle] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false)

    //? functions
    const actionHandler = async (e: any) => {
        e.preventDefault()
        if (title === '' || code === '') {
            toast.error('Please fill all the details!')
        } else {
            setIsLoading(true)
            await actionFunction({
                id: isUpdateModal ? selectedEntity.id : null,
                title: title,
                code: code,
                isAnonymous: isAnonymous,
                refetch: refetch,
            })
            setTitle('')
            setCode('')
            setIsAnonymous(false)
            setShowModal(false)
            setIsLoading(false)
        }
    }

    //? effects
    useEffect(() => {
        if (selectedEntity) {
            setTitle(selectedEntity.title)
            setCode(selectedEntity.code)
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
            <div className="flex flex-col p-10 space-y-2">
                {/* Title */}
                <Input
                    inputTitle="Title"
                    value={title}
                    setValue={setTitle}
                    placeholder={
                        'e.g. Artificial Intelligence and Data Science'
                    }
                    type={'text'}
                />

                <Input
                    inputTitle="Code"
                    value={code}
                    setValue={setCode}
                    placeholder={'e.g. AD-0101'}
                    type={'text'}
                />

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
