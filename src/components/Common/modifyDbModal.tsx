import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { branches } from '../../constants/branches'
import { toast } from 'react-hot-toast'
import { ModalContainer } from './ModalContainer'
import { Input } from './Input'
import { DbInput } from './DbInput'
import { semesters } from '../../constants/semesters'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseInit'

export const ModifyDbModal: FC<{
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
    const [selectedInstructorName, setSelectedInstructorName] =
        useState<string>('')
    const [instructorNameInput, setInstructorNameInput] = useState<string>('')
    const [selectedInstructorId, setSelectedInstructorId] = useState<number>(0)
    const [instructors, setInstructors] = useState<any[]>([])

    const [semester, setSemester] = useState<any[]>([])
    const [semesterInput, setSemesterInput] = useState<string>('')
    const [selectedSemester, setSelectedSemester] = useState<string>('')

    const [branches, setBranches] = useState<any[]>([])
    const [branchInput, setBranchInput] = useState<string>('')
    const [selectedBranch, setSelectedBranch] = useState<string>('')

    const [subjectCodeInput, setSubjectCodeInput] = useState<string>('')
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('')
    const [subjectNameInput, setSubjectNameInput] = useState<string>('')
    const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
    const [subjects, setSubjects] = useState<any[]>([])

    const [adminStatus, setAdminStatus] = useState<boolean>(false)

    const [resourceTypes, setResourceTypes] = useState<any[]>([])
    const [resourceTypeInput, setResourceTypeInput] = useState<string>('')
    const [selectedResourceType, setSelectedResourceType] = useState<string>('')

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
            setIsLoading(true)

            const subjectQuerySnapshot = await getDocs(
                collection(db, 'subjects')
            )
            const subjectExists = subjectQuerySnapshot.docs.some(
                (doc) => doc.data().code === subjectCodeInput
            )

            if (!subjectExists) {
                await addDoc(collection(db, 'subjects'), {
                    name: subjectNameInput,
                    code: subjectCodeInput,
                })

                const subjectsSnapshot = await getDocs(
                    collection(db, 'subjects')
                )
                setSubjects(subjectsSnapshot.docs.map((doc) => doc.data()))
            }

            const instructorQuerySnapshot = await getDocs(
                collection(db, 'instructors')
            )
            const existingInstructor = instructorQuerySnapshot.docs.find(
                (doc) => doc.data().name === instructorNameInput
            )

            if (!existingInstructor) {
                await addDoc(collection(db, 'instructors'), {
                    name: instructorNameInput,
                })

                const instructorsSnapshot = await getDocs(
                    collection(db, 'instructors')
                )
                setInstructors(
                    instructorsSnapshot.docs.map((doc) => doc.data())
                )
            }

            //resourceType
            const resourceTypeQuerySnapshot = await getDocs(
                collection(db, 'resourceTypes')
            )
            const existingResourceType = resourceTypeQuerySnapshot.docs.find(
                (doc) => (doc.data().resourceType = resourceTypeInput)
            )

            if (!existingResourceType) {
                await addDoc(collection(db, 'resourceTypes'), {
                    resourceType: resourceTypeInput,
                })

                const resourceTypeSnapshot = await getDocs(
                    collection(db, 'resourceTypes')
                )
                setResourceTypes(
                    resourceTypeSnapshot.docs.map((doc) => doc.data())
                )
            }

            //branch
            const branchQuerySnapshot = await getDocs(
                collection(db, 'branches')
            )
            const existingBranch = branchQuerySnapshot.docs.find(
                (doc) => (doc.data().branch = branchInput)
            )

            if (!existingBranch) {
                await addDoc(collection(db, 'branches'), {
                    branch: branchInput,
                })

                const branchSnapshot = await getDocs(collection(db, 'branches'))
                setBranches(branchSnapshot.docs.map((doc) => doc.data()))
            }

            //semester
            const semesterQuerySnapshot = await getDocs(
                collection(db, 'semesters')
            )
            const existingSemester = semesterQuerySnapshot.docs.find(
                (doc) => (doc.data().semester = semesterInput)
            )

            if (!existingSemester) {
                await addDoc(collection(db, 'semesters'), {
                    semester: semesterInput,
                })

                const semesterSnapshot = await getDocs(
                    collection(db, 'semesters')
                )
                setSemester(semesterSnapshot.docs.map((doc) => doc.data()))
            }

            await actionFunction({
                id: isUpdateModal ? selectedEntity.id : null,
                resourceType: resourceTypeInput,
                subjectCode: subjectCodeInput,
                subjectName: subjectNameInput,
                semester: semesterInput,
                uploadedBy: user?.displayName,
                instructorName: instructorNameInput,
                branch: branchInput,
                refetch,
            })

            setResourceTypeInput('')
            setSemesterInput('')
            setSubjectCodeInput('')
            setBranchInput('')
            setSubjectNameInput('')
            setInstructorNameInput('')
            setResourceTypeInput('')
            setSelectedInstructorId(0)
            setShowModal(false)
        } catch (error) {
            console.error('Error in actionHandler:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    //? effects

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
            setSemester(semestersSnapshot.docs.map((doc) => doc.data()))
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

    return (
        <ModalContainer
            header={header}
            setShowModal={setShowModal}
            showModal={showModal}
        >
            <div className="flex flex-col p-10 space-y-2">
                {/*Resource Type*/}
                <DbInput
                    inputTitle="Resource Type"
                    value={resourceTypeInput}
                    setValue={setResourceTypeInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

                {/* Subject Code */}
                <DbInput
                    inputTitle="Subject Code"
                    value={subjectCodeInput}
                    setValue={setSubjectCodeInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

                {/* Subject Name */}
                <DbInput
                    inputTitle="Subject Name"
                    value={subjectNameInput}
                    setValue={setSubjectNameInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

                {/* Semester */}
                <DbInput
                    inputTitle="Semester"
                    value={semesterInput}
                    setValue={setSemesterInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

                {/* Instructor */}
                <DbInput
                    inputTitle="Instructor"
                    value={instructorNameInput}
                    setValue={setInstructorNameInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

                {/* Branch */}
                <DbInput
                    inputTitle="Branch"
                    value={branchInput}
                    setValue={setBranchInput}
                    placeholder={'e.g. Unit 1,2 and 3'}
                    type={'text'}
                />

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
