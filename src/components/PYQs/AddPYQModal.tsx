import React, {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Dropdown } from '../Common/Dropdown'
import { batches } from '../../constants/batches'
import { branches } from '../../constants/branches'
import useOutsideClick from '../../hooks/useOutsideClick'
import { IoMdClose } from 'react-icons/io'
import { addSubject } from '../../services/db/subjects/addSubject'
import { toast } from 'react-hot-toast'
import { classes } from '../../constants/classes'
import { getSubjects } from '../../services/db/subjects/getSubjects'
import { addNotes } from '../../services/db/notes/addNotes'
import { addPyq } from '../../services/db/pyqs/addPyq'
import { generateYears } from '../../utils/generateYears'
import { validateYearRange } from '../../utils/validateYearRange'
import { isStringMatch } from '../../utils/isStringMatch'

export const AddPYQModal: FC<{
    showAddPYQModal: boolean
    refetchPYQs: Function
    setShowAddPYQModal: Dispatch<SetStateAction<boolean>>
}> = ({ refetchPYQs, showAddPYQModal, setShowAddPYQModal }) => {
    //? contexts

    //? constants

    //? refs
    const addNoteModalRef = useRef(null)
    const fromYearDropdownRef = useRef(null)
    const toYearDropdownRef = useRef(null)
    const branchDropdownRef = useRef(null)
    const classDropdownRef = useRef(null)
    const subjectNameDropdownRef = useRef(null)
    const subjectCodeDropdownRef = useRef(null)

    //? states
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
    const [showFromYearDropdown, setShowFromYearDropdown] =
        useState<boolean>(false)
    const [showToYearDropdown, setShowToYearDropdown] = useState<boolean>(false)
    const [showSubjectNameDropdown, setShowSubjectNameDropdown] =
        useState<boolean>(false)
    const [showSubjectCodeDropdown, setShowSubjectCodeDropdown] =
        useState<boolean>(false)
    const [showClassDropdown, setShowClassDropdown] = useState<boolean>(false)
    const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false)
    const [selectedFromYear, setSelectedFromYear] = useState<string>('')
    const [selectedFromYearInput, setSelectedFromYearInput] =
        useState<string>('')
    const [selectedToYear, setSelectedToYear] = useState<string>('')
    const [selectedToYearInput, setSelectedToYearInput] = useState<string>('')
    const [selectedBranch, setSelectedBranch] = useState<string>('')
    const [selectedBranchInput, setSelectedBranchInput] = useState<string>('')
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [selectedClassInput, setSelectedClassInput] = useState<string>('')
    const [subjectCodeInput, setSubjectCodeInput] = useState<string>('')
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('')
    const [subjectNameInput, setSubjectNameInput] = useState<string>('')
    const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
    const [subjects, setSubjects] = useState<any[]>([])

    //? functions
    const addPYQHandler = async (e: any) => {
        e.preventDefault()
        if (
            title === '' ||
            selectedSubjectCode === '' ||
            selectedSubjectName === '' ||
            selectedFromYear === '' ||
            selectedToYear === '' ||
            selectedBranch === '' ||
            url === ''
        )
            toast.error('Please fill all the details!')
        else {
            setIsLoading(true)
            if (
                !subjects.find(
                    (subject) => subject.code === selectedSubjectCode
                )
            ) {
                await addSubject(selectedSubjectName, selectedSubjectCode)
                const res = await getSubjects()
                setSubjects(res)
            }
            if (validateYearRange(selectedFromYear, selectedToYear)) {
                addPyq(
                    title,
                    selectedSubjectCode,
                    selectedFromYear,
                    selectedToYear,
                    selectedClass,
                    selectedBranch,
                    url,
                    isAnonymous,
                    refetchPYQs
                )
                setTitle('')
                setUrl('')
                setSelectedFromYear('')
                setSelectedToYear('')
                setSelectedBranch('')
                setSelectedClass('')
                setSelectedSubjectCode('')
                setSelectedSubjectName('')
                setIsAnonymous(false)
                setShowAddPYQModal(false)
            } else {
                toast.error('Invalid Range of From and To Years')
            }
            setIsLoading(false)
        }
    }

    //? effects
    useEffect(() => {
        getSubjects().then((res) => setSubjects(res))
    }, [])

    useEffect(() => {
        const keyPressHandler = (event: any) => {
            if (event.key === 'Escape') {
                setShowAddPYQModal(false)
            }
        }
        document.addEventListener('keydown', keyPressHandler, false)

        return () =>
            document.removeEventListener('keydown', keyPressHandler, false)
    }, [setShowAddPYQModal])

    useOutsideClick(
        [
            subjectNameDropdownRef,
            subjectCodeDropdownRef,
            fromYearDropdownRef,
            toYearDropdownRef,
            branchDropdownRef,
            classDropdownRef,
        ],
        () => {
            setShowSubjectCodeDropdown(false)
            setShowSubjectNameDropdown(false)
            setShowBranchDropdown(false)
            setShowFromYearDropdown(false)
            setShowToYearDropdown(false)
            setShowClassDropdown(false)
        }
    )

    useOutsideClick([addNoteModalRef], () => {
        setShowAddPYQModal(false)
    })

    return (
        <div
            className={`${
                !showAddPYQModal && 'hidden'
            } flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full bg-black/50 overflow-x-hidden overflow-y-auto h-full`}
        >
            <div className="relative w-full pt-32 md:pt-48 px-5 h-full max-w-2xl md:h-auto">
                <form
                    autoComplete={'off'}
                    ref={addNoteModalRef}
                    className={`relative bg-white rounded-lg shadow`}
                >
                    <div className="flex items-start justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Add New PYQ
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowAddPYQModal(false)}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex flex-col p-10 space-y-2">
                        {/* Title */}
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold">Title</span>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Unit 1,2 and 3"
                                type="text"
                                className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md"
                            />
                        </div>

                        {/* Subject Code */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">Subject Code</span>
                            <label
                                htmlFor="subjectCode"
                                className="flex items-center"
                            >
                                <input
                                    name="subjectCode"
                                    type="text"
                                    autoComplete="off"
                                    disabled={!!selectedSubjectCode}
                                    placeholder={
                                        selectedSubjectCode ? '' : 'e.g. MS0101'
                                    }
                                    value={subjectCodeInput}
                                    onFocus={() => {
                                        subjects.length
                                            ? setShowSubjectCodeDropdown(true)
                                            : subjectCodeInput !== ''
                                            ? setShowSubjectCodeDropdown(true)
                                            : setShowSubjectCodeDropdown(false)
                                    }}
                                    onChange={(e) => {
                                        setShowSubjectCodeDropdown(true)
                                        setSubjectCodeInput(e.target.value)
                                    }}
                                    className="p-1 ring-1 relative ring-gray-400 rounded-sm w-full shadow-md"
                                />
                                {selectedSubjectCode && (
                                    <div className="absolute flex items-center left-1 max-w-[90%] space-x-1 p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span className="truncate">
                                            {selectedSubjectCode}
                                        </span>
                                        <IoMdClose
                                            onClick={() =>
                                                setSelectedSubjectCode('')
                                            }
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <ul
                                ref={subjectCodeDropdownRef}
                                className={`${
                                    showSubjectCodeDropdown
                                        ? 'absolute'
                                        : 'hidden'
                                } max-h-56 overflow-x-clip border z-50 top-16 overflow-y-auto w-1/2 border-gray-400 bg-gray-50 rounded shadow-xl flex flex-col`}
                            >
                                {subjects
                                    .filter((item: any) =>
                                        isStringMatch(
                                            subjectCodeInput,
                                            item.code
                                        )
                                    )
                                    .map((subject: any) => {
                                        return (
                                            <li
                                                key={subject.id}
                                                className="px-2 py-1 md:py-2 border-b hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setShowSubjectCodeDropdown(
                                                        false
                                                    )
                                                    setSelectedSubjectCode(
                                                        subject.code
                                                    )
                                                    setSubjectCodeInput('')
                                                }}
                                            >
                                                {subject.code}
                                            </li>
                                        )
                                    })}
                                {!subjects.find((item: any) =>
                                    isStringMatch(subjectCodeInput, item.name)
                                ) &&
                                    subjectCodeInput !== '' && (
                                        <li
                                            onClick={() => {
                                                setShowSubjectCodeDropdown(
                                                    false
                                                )
                                                setSelectedSubjectCode(
                                                    subjectCodeInput
                                                )
                                                setSubjectCodeInput('')
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Create a new subject code &quot;
                                            <span className="font-semibold">
                                                {subjectCodeInput}
                                            </span>
                                            &quot;
                                        </li>
                                    )}
                            </ul>
                        </div>

                        {/* Subject Name */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">Subject Name</span>
                            <label
                                htmlFor="subjectName"
                                className="flex items-center relative"
                            >
                                <input
                                    type="text"
                                    name="subjectName"
                                    value={subjectNameInput}
                                    disabled={!!selectedSubjectName}
                                    placeholder={
                                        selectedSubjectName
                                            ? ''
                                            : 'e.g. Mathematics-II'
                                    }
                                    onFocus={() => {
                                        subjects.length
                                            ? setShowSubjectNameDropdown(true)
                                            : subjectNameInput !== ''
                                            ? setShowSubjectNameDropdown(true)
                                            : setShowSubjectNameDropdown(false)
                                    }}
                                    onChange={(e) => {
                                        setShowSubjectNameDropdown(true)
                                        setSubjectNameInput(e.target.value)
                                    }}
                                    className="p-1 ring-1 relative ring-gray-400 rounded-sm w-full shadow-md"
                                />
                                {selectedSubjectName && (
                                    <div className="absolute flex items-center left-1 max-w-[90%] space-x-1 p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span className="truncate">
                                            {selectedSubjectName}
                                        </span>
                                        <IoMdClose
                                            onClick={() =>
                                                setSelectedSubjectName('')
                                            }
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <ul
                                ref={subjectNameDropdownRef}
                                className={`${
                                    showSubjectNameDropdown
                                        ? 'absolute'
                                        : 'hidden'
                                } max-h-56 overflow-x-clip border top-[60px] z-50 overflow-y-auto w-1/2 border-gray-400 bg-gray-50 rounded shadow-xl flex flex-col`}
                            >
                                {subjects
                                    .filter((item: any) =>
                                        isStringMatch(
                                            subjectNameInput,
                                            item.name
                                        )
                                    )
                                    .map((subject: any) => {
                                        return (
                                            <li
                                                key={subject.id}
                                                className="border-b px-2 py-1 md:py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setShowSubjectNameDropdown(
                                                        false
                                                    )
                                                    setSelectedSubjectName(
                                                        subject.name
                                                    )
                                                    setSubjectNameInput('')
                                                }}
                                            >
                                                {subject.name}
                                            </li>
                                        )
                                    })}
                                {!subjects.find((item: any) =>
                                    isStringMatch(subjectNameInput, item.name)
                                ) &&
                                    subjectNameInput !== '' && (
                                        <li
                                            onClick={() => {
                                                setShowSubjectNameDropdown(
                                                    false
                                                )
                                                setSelectedSubjectName(
                                                    subjectNameInput
                                                )
                                                setSubjectNameInput('')
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Create a new subject &quot;
                                            <span className="font-semibold">
                                                {subjectNameInput}
                                            </span>
                                            &quot;
                                        </li>
                                    )}
                            </ul>
                        </div>

                        {/* From Year */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">From Year</span>
                            <label
                                htmlFor="fromYear"
                                className="flex items-center relative"
                            >
                                <input
                                    name="fromYear"
                                    placeholder={
                                        selectedFromYear ? '' : 'e.g. 2016'
                                    }
                                    disabled={!!selectedFromYear}
                                    value={selectedFromYearInput}
                                    onChange={(e) =>
                                        setSelectedFromYearInput(e.target.value)
                                    }
                                    onFocus={() =>
                                        setShowFromYearDropdown(true)
                                    }
                                    type="text"
                                    className="p-1 ring-1 w-full relative ring-gray-400 rounded-sm shadow-md"
                                />
                                {selectedFromYear && (
                                    <div className="absolute flex items-center left-1 space-x-1 p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span>{selectedFromYear}</span>
                                        <IoMdClose
                                            onClick={() =>
                                                setSelectedFromYear('')
                                            }
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <Dropdown
                                ref={fromYearDropdownRef}
                                setSelectedItem={setSelectedFromYear}
                                showDropdown={showFromYearDropdown}
                                setSelectedItemInput={setSelectedFromYearInput}
                                setShowDropdown={setShowFromYearDropdown}
                                items={generateYears().filter((fromYear: any) =>
                                    isStringMatch(
                                        selectedFromYearInput,
                                        fromYear.name
                                    )
                                )}
                            />
                        </div>

                        {/* To Year */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">To Year</span>
                            <label
                                htmlFor="toYear"
                                className="flex items-center relative"
                            >
                                <input
                                    name="toYear"
                                    placeholder={
                                        selectedToYear ? '' : 'e.g. 2019'
                                    }
                                    disabled={!!selectedToYear}
                                    value={selectedToYearInput}
                                    onChange={(e) =>
                                        setSelectedToYearInput(e.target.value)
                                    }
                                    onFocus={() => setShowToYearDropdown(true)}
                                    type="text"
                                    className="p-1 ring-1 w-full relative ring-gray-400 rounded-sm shadow-md"
                                />
                                {selectedToYear && (
                                    <div className="absolute flex items-center left-1 space-x-1 p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span>{selectedToYear}</span>
                                        <IoMdClose
                                            onClick={() =>
                                                setSelectedToYear('')
                                            }
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <Dropdown
                                ref={toYearDropdownRef}
                                setSelectedItem={setSelectedToYear}
                                showDropdown={showToYearDropdown}
                                setSelectedItemInput={setSelectedToYearInput}
                                setShowDropdown={setShowToYearDropdown}
                                items={generateYears().filter((toYear: any) =>
                                    isStringMatch(
                                        selectedToYearInput,
                                        toYear.name
                                    )
                                )}
                            />
                        </div>

                        {/* Class */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">Class</span>
                            <label
                                htmlFor="class"
                                className="flex relative items-center"
                            >
                                <input
                                    name="class"
                                    placeholder={selectedClass ? '' : 'e.g. 2'}
                                    disabled={!!selectedClass}
                                    value={selectedClassInput}
                                    onChange={(e) =>
                                        setSelectedClassInput(e.target.value)
                                    }
                                    onFocus={() => setShowClassDropdown(true)}
                                    type="text"
                                    className="p-1 w-full ring-1 relative ring-gray-400 rounded-sm shadow-md"
                                />
                                <span className="flex items-center right-0 justify-center h-full w-1/5 absolute bg-gray-300 text-gray-700 font-semibold p-2">
                                    Year
                                </span>
                                {selectedClass && (
                                    <div className="absolute flex items-center left-1 space-x-1 max-w-[90%] p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span>{selectedClass}</span>
                                        <IoMdClose
                                            onClick={() => setSelectedClass('')}
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <Dropdown
                                ref={classDropdownRef}
                                setSelectedItem={setSelectedClass}
                                showDropdown={showClassDropdown}
                                setSelectedItemInput={setSelectedBranchInput}
                                setShowDropdown={setShowClassDropdown}
                                items={classes.filter((item: any) =>
                                    isStringMatch(selectedClassInput, item.name)
                                )}
                            />
                        </div>

                        {/* Branch */}
                        <div className="flex flex-col space-y-1 relative">
                            <span className="font-semibold">Branch</span>
                            <label
                                htmlFor="branch"
                                className="flex items-center relative"
                            >
                                <input
                                    name="branch"
                                    disabled={!!selectedBranch}
                                    placeholder={
                                        selectedBranch
                                            ? ''
                                            : 'e.g. Computer Science and Engineering'
                                    }
                                    onFocus={() => setShowBranchDropdown(true)}
                                    value={selectedBranchInput}
                                    onChange={(e) =>
                                        setSelectedBranchInput(e.target.value)
                                    }
                                    type="text"
                                    className="relative w-full p-1 ring-1 ring-gray-400 rounded-sm shadow-md"
                                />
                                {selectedBranch && (
                                    <div className="absolute flex items-center left-1 w-4/5 space-x-1 max-w-[90%] p-0.5 rounded-sm bg-primary/20 text-primary">
                                        <span className="truncate">
                                            {selectedBranch}
                                        </span>
                                        <IoMdClose
                                            onClick={() =>
                                                setSelectedBranch('')
                                            }
                                            className="h-5 w-5 cursor-pointer"
                                        />
                                    </div>
                                )}
                            </label>
                            <Dropdown
                                ref={branchDropdownRef}
                                setSelectedItem={setSelectedBranch}
                                showDropdown={showBranchDropdown}
                                setSelectedItemInput={setSelectedBranchInput}
                                setShowDropdown={setShowBranchDropdown}
                                items={branches.filter((batch: any) =>
                                    isStringMatch(
                                        selectedBranchInput,
                                        batch.name
                                    )
                                )}
                            />
                        </div>

                        {/* URL */}
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold">URL</span>
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.drive.google.com/"
                                type="text"
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
                                    onChange={() =>
                                        setIsAnonymous(!isAnonymous)
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <button
                            disabled={isLoading}
                            onClick={addPYQHandler}
                            type="submit"
                            className="flex items-center w-fit space-x-2 p-2 duration-200 transition-all rounded-md shadow-md hover:shadow-xl disabled:cursor-not-allowed disabled:bg-primary/70 bg-primary text-white font-semibold"
                        >
                            <p>Add PYQ</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
