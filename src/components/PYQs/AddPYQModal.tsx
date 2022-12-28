import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react"
import { Dropdown } from "../Common/Dropdown"
import { batches } from "../../constants/batches"
import { branches } from "../../constants/branches"
import useOutsideClick from "../../hooks/useOutsideClick"
import Select from 'react-tailwindcss-select'
import { IoMdClose } from 'react-icons/io'

export const AddPYQModal: FC<{
    showAddPYQModal: boolean
    setShowAddPYQModal: Dispatch<SetStateAction<boolean>>
}> = ({
    showAddPYQModal,
    setShowAddPYQModal
}) => {
        //? constants


        //? refs
        const batchDropdownRef = useRef(null)
        const branchDropdownRef = useRef(null)
        const subjectDropdownRef = useRef(null)
        const subjectCodeDropdownRef = useRef(null)

        //? states
        const [showBatchDropdown, setShowBatchDropdown] = useState<boolean>(false)
        const [showSubjectDropdown, setShowSubjectDropdown] = useState<boolean>(false)
        const [showSubjectCodeDropdown, setShowSubjectCodeDropdown] = useState<boolean>(false)
        const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false)
        const [selectedBatch, setSelectedBatch] = useState<string>('')
        const [selectedBranch, setSelectedBranch] = useState<string>('')
        const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
        const [subjectCodeInput, setSubjectCodeInput] = useState<string>('')
        const [subjectNameInput, setSubjectNameInput] = useState<string>('')
        const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('')
        const [subjects, setSubjects] = useState<any[]>([])

        //? effects
        useEffect(() => {
            setSubjects([
                {
                    id: '0',
                    name: 'Computer Science Engineering',
                    code: 'MS-0101'
                },
                {
                    id: '1',
                    name: 'Electronics and Communication Engineering',
                    code: 'MS-0102'
                },
                {
                    id: '3',
                    name: 'Electrical Engineering',
                    code: 'MS-0103'
                },
                {
                    id: '4',
                    name: 'Mechanical Engineering',
                    code: 'MS-0104'
                },
                {
                    id: '5',
                    name: 'Agriculture Engineering',
                    code: 'MS-010'
                },
                {
                    id: '6',
                    name: 'Mining Engineering',
                    code: 'MS-0101'
                },
                {
                    id: '7',
                    name: 'Artificial Intelligence and Data Science',
                    code: 'MS-0101'
                }
            ])
        }, [])

        //? functions
        useOutsideClick([batchDropdownRef, branchDropdownRef, subjectDropdownRef, subjectCodeDropdownRef],
            () => {
                setShowSubjectCodeDropdown(false)
                setShowSubjectDropdown(false)
                setShowBranchDropdown(false)
                setShowBatchDropdown(false)
            })

        console.log("subject: ", selectedSubjectName)
        console.log("subject input: ", subjectNameInput)
        return (
            <div
                className={`${!showAddPYQModal && 'hidden'} flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 bg-black/50 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}>
                <div className="relative w-full h-full max-w-2xl md:h-auto">
                    <div className={`relative bg-white rounded-lg shadow`}>
                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Add New Notes
                            </h3>
                            <button onClick={() => setShowAddPYQModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="flex flex-col p-10 space-y-2">
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Title</span>
                                <input placeholder="e.g. Unit 1,2 and 3" type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                            </div>
                            <div className="flex flex-col space-y-1 relative">
                                <span className="font-semibold">Subject Code</span>
                                <label htmlFor="subjectCode" className="flex items-center">
                                    <input
                                        name="subjectCode"
                                        type="text"
                                        placeholder={selectedSubjectCode ? '' : 'e.g. MS0101'}
                                        value={subjectCodeInput}
                                        onChange={(e) => {
                                            setShowSubjectCodeDropdown(true)
                                            setSubjectCodeInput(e.target.value)
                                        }}
                                        className="p-1 ring-1 relative ring-gray-400 rounded-sm w-full shadow-md"
                                    />
                                    {
                                        selectedSubjectCode &&
                                        <div className="absolute flex items-center left-1 space-x-1 p-0.5 rounded bg-primary/20 text-primary">
                                            <span>{selectedSubjectCode}</span>
                                            <IoMdClose onClick={() => setSelectedSubjectCode('')} className="h-5 w-5 cursor-pointer" />
                                        </div>
                                    }
                                </label>
                                <ul ref={subjectCodeDropdownRef} className={`${(showSubjectCodeDropdown) && (subjectCodeInput !== "") ? 'absolute' : 'hidden'} max-h-56 overflow-x-clip border-2 z-50 top-16 overflow-y-auto w-1/3 border-gray-400 bg-white rounded shadow-md flex flex-col`}>
                                    {
                                        subjects
                                            .map((subject: any) => {
                                                var exp = new RegExp(subjectNameInput, 'i')

                                                if (subject.name.search(exp) !== -1) {
                                                    return (
                                                        <li
                                                            key={subject.id}
                                                            className="font-semibold p-3 border-b bg-white hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setShowSubjectCodeDropdown(false)
                                                                setSubjectCodeInput(subject.code)
                                                            }}
                                                        >
                                                            {subject.code}
                                                        </li>
                                                    )
                                                }
                                                else return
                                            })
                                    }
                                    {
                                        !subjects.find((item: any) => {
                                            var exp = new RegExp(subjectCodeInput, 'i')

                                            if (item.name.search(exp) !== -1) return true
                                            else return false
                                        }) && (subjectCodeInput !== "") &&
                                        <li
                                            onClick={() => {
                                                setSelectedSubjectCode(subjectCodeInput)
                                                setSubjectCodeInput('')
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer">
                                            Create a new subject code &quot;<span className="font-semibold">{subjectCodeInput}</span>&quot;
                                        </li>
                                    }
                                </ul>
                            </div>
                            <div className="flex flex-col space-y-1 relative">
                                <span className="font-semibold">Subject</span>
                                <label htmlFor="subjectName" className="flex items-center">
                                    <input
                                        name="subjectName"
                                        type="text"
                                        placeholder={selectedSubjectName ? '' : 'e.g. Mathematics-II'}
                                        value={subjectNameInput}
                                        onChange={(e) => {
                                            setShowSubjectDropdown(true)
                                            setSubjectNameInput(e.target.value)
                                        }}
                                        className="p-1 ring-1 relative ring-gray-400 rounded-sm w-full shadow-md"
                                    />
                                    {
                                        selectedSubjectName &&
                                        <div className="absolute flex items-center left-1 space-x-1 p-0.5 rounded bg-primary/20 text-primary">
                                            <span>{selectedSubjectName}</span>
                                            <IoMdClose onClick={() => setSelectedSubjectName('')} className="h-5 w-5 cursor-pointer" />
                                        </div>
                                    }
                                </label>
                                <ul className={`${(showSubjectDropdown) && (subjectNameInput !== "") ? 'absolute' : 'hidden'} max-h-56 overflow-x-clip border-2 top-[60px] z-50 overflow-y-auto w-1/2 border-gray-400 bg-white rounded shadow-md flex flex-col`}>
                                    {
                                        subjects
                                            .map((subject: any) => {
                                                var exp = new RegExp(subjectNameInput, 'i')

                                                if (subject.name.search(exp) !== -1) {
                                                    return (
                                                        <li
                                                            key={subject.id}
                                                            className="text-sm border-b px-1 py-2 bg-white hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setShowSubjectDropdown(false)
                                                                setSelectedSubjectName(subject.name)
                                                            }}
                                                        >
                                                            {subject.name}
                                                        </li>
                                                    )
                                                }
                                                else return
                                            })
                                    }
                                    {
                                        !subjects
                                            .find((item: any) => {
                                                var exp = new RegExp(subjectNameInput, 'i')

                                                if (item.name.search(exp) !== -1) return true
                                                else return false
                                            }) &&
                                        (subjectNameInput !== "") &&
                                        <li
                                            onClick={() => {
                                                console.log('clicked')
                                                setSelectedSubjectName(subjectNameInput)
                                                setSubjectNameInput('')
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Create a new subject
                                            &quot;
                                            <span
                                                className="font-semibold">
                                                {subjectNameInput}
                                            </span>
                                            &quot;
                                        </li>
                                    }
                                </ul>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Batch</span>
                                <input placeholder="e.g. 2019-20" value={selectedBatch} onFocus={() => setShowBatchDropdown(true)} type="text" className="p-1 ring-1 relative ring-gray-400 rounded-sm shadow-md" />
                                <Dropdown setSelectedItem={setSelectedBatch} showDropdown={showBatchDropdown} setShowDropdown={setShowBatchDropdown} items={batches} />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Branch</span>
                                <input placeholder="e.g. Computer Science and Engineering" value={selectedBranch} onFocus={() => setShowSubjectDropdown(true)} type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                                <Dropdown setSelectedItem={setSelectedBranch} showDropdown={showBranchDropdown} setShowDropdown={setShowBranchDropdown} items={branches} />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">URL</span>
                                <input placeholder="https://www.drive.google.com/" type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                            </div>
                            <button type="button" className="flex items-center w-fit space-x-2 p-2 duration-200 transition-all rounded-md shadow-md hover:shadow-xl bg-primary text-white font-semibold">
                                <p>
                                    Add Notes
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }