import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { branches } from '../../constants/branches';
import { toast } from 'react-hot-toast';
import { ModalContainer } from './ModalContainer';
import { Input } from './Input';
import { SelectInput } from './SelectInput';
import { semesters } from '../../constants/semesters';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export const Modal: FC<{
    isUpdateModal?: boolean;
    header: string;
    actionButtonText: string;
    actionFunction: Function;
    showModal: boolean;
    refetch: Function;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    selectedEntity?: any;
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
    const db = getFirestore();
    //? states
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
    const [showSemesterDropdown, setShowSemesterDropdown] =
        useState<boolean>(false)
    const [showSubjectNameDropdown, setShowSubjectNameDropdown] =
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

    const auth = getAuth();
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    //? functions
    const actionHandler = async (e: any) => {
        e.preventDefault();

        try {
            if (
                title === '' ||
                selectedSubjectCode === '' ||
                selectedSubjectName === '' ||
                selectedSemester === '' ||
                selectedBranch === '' ||
                url === '' ||
                (selectedInstructorId === 0 && selectedInstructorName === '')
            ) {
                toast.error('Please fill in all the details!');
                return;
            }

            setIsLoading(true);
            const subjectQuerySnapshot = await getDocs(collection(db, 'subjects'));
            const subjectExists = subjectQuerySnapshot.docs.some(
                (doc) => doc.data().code === selectedSubjectCode
            );

            if (!subjectExists) {
                await addDoc(collection(db, 'subjects'), {
                    name: selectedSubjectName,
                    code: selectedSubjectCode,
                });

                const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
                setSubjects(subjectsSnapshot.docs.map((doc) => doc.data()));
            }

            const instructorQuerySnapshot = await getDocs(collection(db, 'instructors'));
            const existingInstructor = instructorQuerySnapshot.docs.find(
                (doc) => doc.data().name === selectedInstructorName
            );

            if (!existingInstructor) {
                await addDoc(collection(db, 'instructors'), {
                    name: selectedInstructorName,
                });

                const instructorsSnapshot = await getDocs(collection(db, 'instructors'));
                setInstructors(instructorsSnapshot.docs.map((doc) => doc.data()));
            }

            await actionFunction({
                id: isUpdateModal ? selectedEntity.id : null,
                title,
                subjectCode: selectedSubjectCode,
                subjectName:selectedSubjectName,
                semester: selectedSemester,
                uploadedBy : user?.displayName,
                instructorName: selectedInstructorName,
                branch: selectedBranch,
                url,
                isAnonymous,
                refetch,
            });

            setTitle('');
            setUrl('');
            setSelectedBranch('');
            setSelectedSemester('');
            setSelectedSubjectCode('');
            setSelectedSubjectName('');
            setSelectedInstructorName('');
            setSelectedInstructorId(0);
            setIsAnonymous(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error in actionHandler:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
};

    //? effects
    useEffect(() => {
        if (selectedEntity) {
            setTitle(selectedEntity.title || '');
            setUrl(selectedEntity.url || '');
            setSelectedBranch(selectedEntity.branch || '');
            setSelectedSemester(selectedEntity.semester || '');
            setSelectedSubjectCode(selectedEntity.subject_code || '');

            if (selectedEntity.subject && selectedEntity.subject.name) {
                setSelectedSubjectName(selectedEntity.subject.name);
            } else {
                setSelectedSubjectName('');
            }

            if (selectedEntity.instructor && selectedEntity.instructor.name) {
                setSelectedInstructorName(selectedEntity.instructor.name);
            } else {
                setSelectedInstructorName('');
            }
    
            setIsAnonymous(selectedEntity.anonymous || false);
        }
    }, [selectedEntity]);
    

    useEffect(() => {
        const fetchSubjects = async () => {
            const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
            setSubjects(subjectsSnapshot.docs.map((doc) => doc.data()));
        };

        const fetchInstructors = async () => {
            const instructorsSnapshot = await getDocs(collection(db, 'instructors'));
            setInstructors(instructorsSnapshot.docs.map((doc) => doc.data()));
        };

        fetchSubjects();
        fetchInstructors();
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
        );
    
        if (selectedInstructor) {
            setSelectedInstructorId(selectedInstructor.id);
        } else {
            setSelectedInstructorId(0);
        }
    }, [selectedInstructorName, instructors]);
    

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
                    placeholder={'e.g. Unit 1,2 and 3'}
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
