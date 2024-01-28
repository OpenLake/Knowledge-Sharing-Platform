import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ModalContainer } from '../Common/ModalContainer'
import { Input } from '../Common/Input'
import { SelectInput } from '../Common/SelectInput'
import { getInstructors } from '../../services/db/instructors/getInstructors'
import { addInstructor } from '../../services/db/instructors/addInstructor'

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
    const [instructors, setInstructors] = useState<any[]>([])
    const [instructorNameInput, setInstructorNameInput] = useState<string>('')
    const [selectedInstructorId, setSelectedInstructorId] = useState<number>(0)
    const [showInstructorNameDropdown, setShowInstructorNameDropdown] =
        useState<boolean>(false)
    const [selectedInstructorName, setSelectedInstructorName] =
        useState<string>('')

    //? functions
    const actionHandler = async (e: any) => {
        e.preventDefault()
        if (
            title === '' ||
            code === '' ||
            ( selectedInstructorName === '')
        ) {
            toast.error('Please fill all the details!')
        } else {
            setIsLoading(true)
            if (
                !instructors.find(
                    (instructor) => instructor.instructorName === selectedInstructorName
                )
            ) {
                
                const instructor = await addInstructor(selectedInstructorName)
                await actionFunction({
                    id: isUpdateModal ? selectedEntity.id : null,
                    title: title,
                    code: code,
                    instructorName: selectedInstructorName,
                    isAnonymous: isAnonymous,
                    refetch: refetch,
                })
            } else {
                await actionFunction({
                    id: isUpdateModal ? selectedEntity.id : null,
                    title: title,
                    code: code,
                    instructorName:selectedInstructorName,
                    isAnonymous: isAnonymous,
                    refetch: refetch,
                })
            }
            setTitle('')
            setCode('')
            setSelectedInstructorName('')
            setSelectedInstructorId(0)
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
            setSelectedInstructorName(selectedEntity.instructor.instructorName)
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

    useEffect(() => {
        getInstructors().then((res) => setInstructors(res))
    }, [])

    useEffect(() => {
        instructors.map((instructor) => {
            if (instructor.instructorName === selectedInstructorName)
                setSelectedInstructorId(instructor.id)
        })
    }, [selectedInstructorName, instructors])

    return (
        <ModalContainer
            header={header}
            setShowModal={setShowModal}
            showModal={showModal}
        >
            <div className="flex flex-col p-10 space-y-2">
                {/* Title */}
                <Input
                    inputTitle="Course Name"
                    value={title}
                    setValue={setTitle}
                    placeholder={
                        'e.g. Artificial Intelligence and Data Science'
                    }
                    type={'text'}
                />
                {/* Code */}
                <Input
                    inputTitle="Code"
                    value={code}
                    setValue={setCode}
                    placeholder={'e.g. AD-0101'}
                    type={'text'}
                />

                {/* Instructor */}
                <SelectInput
                    dropdownItems={instructors}
                    dropdownKey={'name'}
                    dropdownValue={'name'}
                    inputName={'instructor'}
                    inputTitle={'Instructor'}
                    placeholder={'e.g. Dr. R.S. Sharma'}
                    selectedValue={selectedInstructorName}
                    setSelectedValue={setSelectedInstructorName}
                    inputValue={instructorNameInput}
                    setInputValue={setInstructorNameInput}
                    showDropdown={showInstructorNameDropdown}
                    setShowDropdown={setShowInstructorNameDropdown}
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