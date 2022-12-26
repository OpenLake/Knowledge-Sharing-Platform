import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { Dropdown } from "../Common/Dropdown"
import { batches } from "../../constants/batches"
import { branches } from "../../constants/branches"

export const AddNoteModal: FC<{
    showAddNoteModal: boolean
    setShowAddNoteModal: Dispatch<SetStateAction<boolean>>
}> = ({
    showAddNoteModal,
    setShowAddNoteModal
}) => {
        //? states
        const [showBatchDropdown, setShowBatchDropdown] = useState(false)
        const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
        const [showBranchDropdown, setShowBranchDropdown] = useState(false)
        const [selectedBatch, setSelectedBatch] = useState('')
        const [selectedBranch, setSelectedBranch] = useState('')
        const [selectedSubject, setSelectedSubject] = useState('')
        const [subjects, setSubjects] = useState([])

        //? effects
        useEffect(() => {


        }, [])

        console.log(subjects)
        return (
            <div
                className={`${!showAddNoteModal && 'hidden'} flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 bg-black/50 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}>
                <div className="relative w-full h-full max-w-2xl md:h-auto">
                    <div className={`relative bg-white rounded-lg shadow`}>
                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Add New Notes
                            </h3>
                            <button onClick={() => setShowAddNoteModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="flex flex-col p-10 space-y-2">
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Title</span>
                                <input placeholder="e.g. Unit 1,2 and 3" type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Subject Code</span>
                                <input placeholder="e.g. MS-0101" type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-semibold">Subject</span>
                                <input placeholder="e.g. Mathematics-II" type="text" className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md" />
                                <ul className={`${showSubjectDropdown ? 'absolute' : 'hidden'} h-56 overflow-x-clip border-2 -bottom-12 overflow-y-auto w-1/3 border-gray-400 bg-white rounded-md shadow-md flex flex-col`}>
                                    {
                                        subjects.map((subject: any) => {
                                            return (
                                                <li onClick={() => {
                                                    setShowSubjectDropdown(false)
                                                    setSelectedSubject(subject.name)
                                                }} key={subject.id} className="font-semibold p-3 border-b bg-white hover:bg-gray-100 cursor-pointer">{subject.name}</li>
                                            )
                                        })
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