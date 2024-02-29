import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ModalContainer } from './ModalContainer'
import { Input } from './Input'
import { SelectInput } from './SelectInput'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseInit'
import { query, where } from 'firebase/firestore'
import { s3 } from '../../utils/awsConfig'

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
    const db = getFirestore()
    //? states
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [url, setUrl] = useState<string>('')
    const [resourceNumber, setResourceNumber] = useState<number>(0)
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
    const [showSemesterDropdown, setShowSemesterDropdown] =
        useState<boolean>(false)
    const [showSubjectNameDropdown, setShowSubjectNameDropdown] =
        useState<boolean>(false)
    const [showResourceTypeDropdown, setShowResourceTypeDropdown] =
        useState<boolean>(false)
    const [showSubjectCodeDropdown, setShowSubjectCodeDropdown] =
        useState<boolean>(false)
    const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false)
    const [showInstructorNameDropdown, setShowInstructorNameDropdown] =
        useState<boolean>(false)
    const [selectedInstructorName, setSelectedInstructorName] =
        useState<string>('')
    const [instructorNameInput, setInstructorNameInput] = useState<string>('')
    const [selectedInstructorId, setSelectedInstructorId] = useState<number>(0)
    const [selectedSemester, setSelectedSemester] = useState<string>('')
    const [semesterInput, setSemesterInput] = useState<string>('')
    const [selectedBranch, setSelectedBranch] = useState<string>('')
    const [branchInput, setBranchInput] = useState<string>('')
    const [subjectCodeInput, setSubjectCodeInput] = useState<string>('')
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('')
    const [subjectNameInput, setSubjectNameInput] = useState<string>('')
    const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
    const [subjects, setSubjects] = useState<any[]>([])
    const [instructors, setInstructors] = useState<any[]>([])
    const [semesters, setSemesters] = useState<any[]>([])
    const [branches, setBranches] = useState<any[]>([])
    const [adminStatus, setAdminStatus] = useState<boolean>(false)
    const [resourceTypes, setResourceTypes] = useState<any[]>([])
    const [resourceTypeInput, setResourceTypeInput] = useState<string>('')
    const [selectedResourceType, setSelectedResourceType] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [file, setFile] = useState<File | null>(null)

    const auth = getAuth()
    const [user, setUser] = useState<any | null>(null)

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(firestore, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setAdminStatus(docSnap.data().isAdmin)
            }
        }
    })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        return () => unsubscribe()
    }, [auth])

    //? functions
    const actionHandler = async (e: any) => {
        e.preventDefault()

        try {
            if (
                selectedResourceType === '' ||
                selectedSubjectCode === '' ||
                selectedSubjectName === '' ||
                selectedSemester === '' ||
                selectedBranch === '' ||
                // url === '' ||
                resourceNumber <= 0 ||
                description === '' ||
                file === null ||
                (selectedInstructorId === 0 && selectedInstructorName === '')
            ) {
                toast.error('Please fill in all the details!')
                return
            }

            setIsLoading(true)

            const combinationExists = await getDocs(
                query(
                    collection(db, 'notes'),
                    where('resourceNumber', '==', resourceNumber),
                    where('resourceType', '==', selectedResourceType),
                    where('subject_code', '==', selectedSubjectCode),
                    where('subjectName', '==', selectedSubjectName),
                    where('semester', '==', selectedSemester),
                    where('instructorName', '==', selectedInstructorName),
                    where('branch', '==', selectedBranch)
                )
            )
            if (!combinationExists.empty) {
                toast.error('The selected combination already exists !')
                return
            }

            const subjectQuerySnapshot = await getDocs(
                collection(db, 'subjects')
            )
            const subjectExists = subjectQuerySnapshot.docs.some(
                (doc) => doc.data().code === selectedSubjectCode
            )

            if (!subjectExists) {
                toast.error('The subject is not added, contact your admin.')
                return
            }

            const instructorQuerySnapshot = await getDocs(
                collection(db, 'instructors')
            )
            const existingInstructor = instructorQuerySnapshot.docs.find(
                (doc) => doc.data().name === selectedInstructorName
            )

            if (!existingInstructor) {
                toast.error('The instructor is not added, contact your admin.')
                return
            }

            const resourceTypeQuerySnapshot = await getDocs(
                collection(db, 'resourceTypes')
            )
            const existingResourceType = resourceTypeQuerySnapshot.docs.find(
                (doc) => (doc.data().resourceType = selectedResourceType)
            )

            if (!existingResourceType) {
                toast.error("Resource Type doesn't exist, contact your admin.")
                return
            }

            let generatedTitle =
                selectedSubjectCode +
                '_' +
                selectedSubjectName +
                '_' +
                selectedBranch +
                '_' +
                selectedSemester +
                '_' +
                selectedInstructorName +
                '_' +
                selectedResourceType +
                '_' +
                resourceNumber

            const q = await getDocs(
                query(
                    collection(firestore, 'cities'),
                    where('title', '==', generatedTitle)
                )
            )
            if (!q.empty) {
                toast.error(
                    'Resource already exists, please choose a different combination.'
                )
                return
            }

            let urlToSend
            const fileExtension = file.name.split('.').pop()
            const expirationTime = new Date()
            expirationTime.setHours(expirationTime.getHours() + 10000)
            try {
                await Promise.all([
                    s3
                        .upload({
                            Body: file,
                            Bucket: 'ksp-pdf',
                            Key: generatedTitle + '.' + fileExtension,
                            Expires: expirationTime,
                        })
                        .promise(),
                    s3.getSignedUrl('getObject', {
                        Bucket: 'ksp-pdf',
                        Key: generatedTitle + '.' + fileExtension,
                    }),
                ]).then(([uploadResponse, url]) => {
                    console.log('File uploaded successfully')
                    console.log('url generated successfully: ', url)
                    urlToSend = url
                })
            } catch (error) {
                console.error('Error uploading file:', error)
            }

            console.log(urlToSend)

            await actionFunction({
                id: isUpdateModal ? selectedEntity.id : null,
                resourceType: selectedResourceType,
                resourceNumber: resourceNumber,
                subjectCode: selectedSubjectCode,
                subjectName: selectedSubjectName,
                semester: selectedSemester,
                uploadedBy: user?.displayName,
                instructorName: selectedInstructorName,
                description,
                branch: selectedBranch,
                url: urlToSend,
                isAnonymous,
                refetch,
            })

            setUrl('')
            setSelectedBranch('')
            setSelectedSemester('')
            setSelectedSubjectCode('')
            setSelectedSubjectName('')
            setSelectedInstructorName('')
            setDescription('')
            setSelectedResourceType('')
            setSelectedInstructorId(0)
            setResourceNumber(0)
            setIsAnonymous(false)
            setShowModal(false)
        } catch (error) {
            console.error('Error in actionHandler:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchSubjects = async () => {
            const subjectsSnapshot = await getDocs(collection(db, 'subjects'))
            setSubjects(subjectsSnapshot.docs.map((doc) => doc.data()))
        }

        const fetchInstructors = async () => {
            const instructorsSnapshot = await getDocs(
                collection(db, 'instructors')
            )
            setInstructors(instructorsSnapshot.docs.map((doc) => doc.data()))
        }

        const fetchResourceTypes = async () => {
            const resourceTypesSnapshot = await getDocs(
                collection(db, 'resourceTypes')
            )
            setResourceTypes(
                resourceTypesSnapshot.docs.map((doc) => doc.data())
            )
        }

        const fetchBranches = async () => {
            const branchesSnapshot = await getDocs(collection(db, 'branches'))
            setBranches(branchesSnapshot.docs.map((doc) => doc.data()))
        }

        const fetchSemesters = async () => {
            const semestersSnapshot = await getDocs(collection(db, 'semesters'))
            setSemesters(semestersSnapshot.docs.map((doc) => doc.data()))
        }

        fetchSubjects()
        fetchInstructors()
        fetchResourceTypes()
        fetchBranches()
        fetchSemesters()
    }, [db])

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
        instructors.map((instructor) => {
            if (instructor.name === selectedInstructorName)
                setSelectedInstructorId(instructor.id)
        })
    }, [selectedInstructorName, instructors])

    useEffect(() => {
        const selectedInstructor = instructors.find(
            (instructor) => instructor.name === selectedInstructorName
        )

        if (selectedInstructor) {
            setSelectedInstructorId(selectedInstructor.id)
        } else {
            setSelectedInstructorId(0)
        }
    }, [selectedInstructorName, instructors])

    const handleResourceNumberChange = (value: number) => {
        console.log('Resource Number changed to:', value)
        setResourceNumber(value)
    }

    return (
        <ModalContainer
            header={header}
            setShowModal={setShowModal}
            showModal={showModal}
        >
            <div className="flex flex-col p-10 space-y-2">
                {/* Number */}
                <Input
                    inputTitle="Resource Number"
                    placeholder="1, 2, 3, ..."
                    setValue={handleResourceNumberChange}
                    type="number"
                    value={resourceNumber}
                />

                {/* Resource Type */}
                <SelectInput
                    dropdownItems={resourceTypes}
                    dropdownKey={'resourceType'}
                    dropdownValue={'resourceType'}
                    inputName={'resourceType'}
                    inputValue={resourceTypeInput}
                    inputTitle="Resource Type"
                    placeholder={'e.g. Class notes, References, etc.'}
                    selectedValue={selectedResourceType}
                    setInputValue={setResourceTypeInput}
                    setSelectedValue={setSelectedResourceType}
                    setShowDropdown={setShowResourceTypeDropdown}
                    showDropdown={showResourceTypeDropdown}
                    type={'text'}
                />

                {/* Subject Code */}
                <SelectInput
                    dropdownItems={subjects}
                    dropdownKey={'code'}
                    dropdownValue={'code'}
                    inputName={'subjectCode'}
                    inputTitle={'Subject Code'}
                    inputValue={subjectCodeInput}
                    placeholder={'e.g. MS0101'}
                    selectedValue={selectedSubjectCode}
                    setInputValue={setSubjectCodeInput}
                    setSelectedValue={setSelectedSubjectCode}
                    setShowDropdown={setShowSubjectCodeDropdown}
                    showDropdown={showSubjectCodeDropdown}
                    type={'text'}
                />

                {/* Subject Name */}
                <SelectInput
                    dropdownItems={subjects}
                    dropdownKey={'name'}
                    dropdownValue={'name'}
                    inputName={'subjectName'}
                    inputTitle={'Subject Name'}
                    inputValue={subjectNameInput}
                    placeholder={'e.g. Mathematics-II'}
                    selectedValue={selectedSubjectName}
                    setInputValue={setSubjectNameInput}
                    setSelectedValue={setSelectedSubjectName}
                    setShowDropdown={setShowSubjectNameDropdown}
                    showDropdown={showSubjectNameDropdown}
                    type={'text'}
                />

                {/* Semester */}
                <SelectInput
                    createNew={false}
                    dropdownItems={semesters}
                    dropdownKey={'semester'}
                    dropdownValue={'semester'}
                    inputName={'semester'}
                    inputTitle={'Semester'}
                    inputValue={semesterInput}
                    placeholder={'e.g. 2022-23W'}
                    selectedValue={selectedSemester}
                    setInputValue={setSemesterInput}
                    setSelectedValue={setSelectedSemester}
                    setShowDropdown={setShowSemesterDropdown}
                    showDropdown={showSemesterDropdown}
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

                {/* Branch */}
                <SelectInput
                    dropdownItems={branches}
                    createNew={false}
                    dropdownKey={'branch'}
                    dropdownValue={'branch'}
                    inputName={'branch'}
                    inputTitle={'Branch'}
                    inputValue={branchInput}
                    placeholder={'e.g. Computer Science and Engineering'}
                    selectedValue={selectedBranch}
                    setInputValue={setBranchInput}
                    setSelectedValue={setSelectedBranch}
                    setShowDropdown={setShowBranchDropdown}
                    showDropdown={showBranchDropdown}
                    type={'text'}
                />

                {/* URL */}
                <Input
                    inputTitle="URL"
                    placeholder="https://www.drive.google.com/"
                    setValue={setUrl}
                    type="text"
                    value={url}
                />

                {/* Description */}
                <Input
                    inputTitle="Remarks/Description"
                    placeholder="Add a description..."
                    setValue={setDescription}
                    type="text"
                    value={description}
                />

                {/* File Upload */}
                <label className="flex flex-col space-y-1">
                    <span className="font-semibold">Upload File</span>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border rounded-md p-2"
                    />
                </label>

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
