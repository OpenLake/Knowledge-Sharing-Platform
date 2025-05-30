'use client'
import Head from 'next/head'
import { BsPencilSquare, BsPlus } from 'react-icons/bs'
import { useAuth } from '../../contexts/auth'
import { useEffect, useState } from 'react'
import { coursesColumnData } from '../../types/coursesColumnData'
import { toast } from 'react-hot-toast'
import { getCourses } from '../../services/db/courses/getCourses'
import { Modal } from '../../components/Courses/Modal'
import { addCourse } from '../../services/db/courses/addCourse'
import { updateCourse } from '../../services/db/courses/updateCourse'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { deleteCourse } from '../../services/db/courses/deleteCourse'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseInit'
import { query, where } from 'firebase/firestore'
const Player = dynamic(
    () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
    { ssr: false }
)

export default function Courses() {
    //? router
    const router = useRouter()

    //? contexts
    const { user, loading }: any = useAuth()

    //? states
    const [isDataFetching, setIsDataFetching] = useState<boolean>(false)
    const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false)
    const [showUpdateCourseModal, setShowUpdateCourseModal] =
        useState<boolean>(false)
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [courses, setCourses] = useState<coursesColumnData[]>([])
    const [searchInput, setSearchInput] = useState<string>('')
    const [adminStatus, setAdminStatus] = useState<boolean>(false)

    useEffect(() => {
        const checkUserAuthentication = async () => {
            if (user) {
                // If the user is authenticated, call checkIfAdminExists
                await checkIfAdminExists()
            } else {
                // Handle the case when the user is not authenticated
                console.error('User not authenticated.')
            }
        }

        // Call the function to check user authentication
        checkUserAuthentication()
    }, [user]) // Run this effect whenever the user changes

    const checkIfAdminExists = async () => {
        // Check if the user object is defined and has the 'name' property
        if (user && user.name) {
            try {
                const q1 = await getDocs(
                    query(
                        collection(firestore, 'users'),
                        where('name', '==', user.name),
                        where('isAdmin', '==', true)
                    )
                )
                if (q1.size > 0) {
                    setAdminStatus(true)
                }
            } catch (error) {
                console.error('Error checking admin existence:', error)
            }
        } else {
            // Handle the case when the user is not authenticated
            console.error('Invalid user object:', user)
        }
    }

    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await checkIfAdminExists()
        }
    })

    //? functions
    const refetchCourses = () => {
        setIsDataFetching(true)
        getCourses().then((res) => {
            setCourses(res)
            setIsDataFetching(false)
        })
    }

    //? effects
    useEffect(() => {
        setIsDataFetching(true)
        getCourses().then((res) => {
            setCourses(res)
            setIsDataFetching(false)
        })
    }, [])

    return (
        <div className={`w-full bg-white flex flex-col py-48`}>
            {user && (
                <Modal
                    header="Add New Course"
                    actionButtonText="Add Course"
                    actionFunction={addCourse}
                    refetch={refetchCourses}
                    showModal={showAddCourseModal}
                    setShowModal={setShowAddCourseModal}
                />
            )}
            {selectedCourse && (
                <Modal
                    header="Update Course"
                    actionButtonText="Update Course"
                    isUpdateModal={true}
                    selectedEntity={selectedCourse}
                    actionFunction={updateCourse}
                    refetch={refetchCourses}
                    showModal={showUpdateCourseModal}
                    setShowModal={setShowUpdateCourseModal}
                />
            )}
            <Head>
                <title>Courses</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <div className="grid grid-cols-5 gap-0 justify-center c px-5 md:px-14 space-y-8 min-h-screen">
                <div className="col-span-5 flex flex-row items-center gap-4 justify-between">
                    <h3 className="font-bold text-xl md:text-3xl">Courses</h3>
                    {adminStatus && (
                        <button
                            disabled={loading}
                            onClick={() => {
                                if (user) setShowAddCourseModal(true)
                                else
                                    toast('Please login to add new course', {
                                        icon: 'ℹ️',
                                    })
                            }}
                            type="button"
                            className="flex items-center space-x-2 px-2 py-1 duration-200 transition-all rounded-md shadow-md hover:shadow-xl bg-primary text-white font-semibold disabled:bg-primary/70 disabled:cursor-wait"
                        >
                            <BsPlus className="h-8 w-8" />
                            <span className="">Add Course</span>
                        </button>
                    )}
                </div>
                <div className="flex col-span-5 w-full px-2 py-3">
                    <label
                        htmlFor="search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only"
                    >
                        Search
                    </label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value)
                            }}
                            type="search"
                            id="search"
                            className="w-full font-medium text-base pl-12 pr-2 py-2 md:pr-4 md:py-4 text-gray-700 outline-none ring-2 ring-primary/40 focus:border-none rounded-md bg-primary/5 focus:bg-primary/10 focus:ring-primary placeholder:font-medium placeholder:text-gray-600"
                            placeholder={`Search ${
                                courses && courses.length
                            } records...`}
                        />
                    </div>
                </div>
                <div className="col-span-5 flex flex-wrap md:justify-start justify-center gap-8 h-fit w-full">
                    {isDataFetching ? (
                        Array(8)
                            .fill({})
                            .map((res, index) => {
                                return (
                                    <div
                                        key={index}
                                        role="status"
                                        className="shadow-md p-6 rounded-md animate-pulse"
                                    >
                                        <div className="h-2.5 bg-gray-400 rounded-full w-48 mb-4"></div>
                                        <div className="h-2 bg-gray-400 rounded-full max-w-[360px] mb-2.5"></div>
                                        <div className="h-2 bg-gray-400 rounded-full mb-2.5"></div>
                                        <div className="h-2 bg-gray-400 rounded-full max-w-[330px] mb-2.5"></div>
                                        <div className="h-2 bg-gray-400 rounded-full max-w-[300px] mb-2.5"></div>
                                        <div className="h-2 bg-gray-400 rounded-full max-w-[360px]"></div>
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                )
                            })
                    ) : courses.length ? (
                        courses
                            .filter((course: any) => {
                                const regex = new RegExp(searchInput, 'i')
                                if (course.title.match(regex)) return true
                                else return false
                            })
                            .map((course: any) => {
                                return (
                                    <div
                                        className=" bg-primary/5 shadow-xl duration-150 transition-all p-6 w-full md:w-[20rem] rounded-md flex flex-col gap-3"
                                        key={course.id}
                                    >
                                        <div className="flex gap-7 items-center justify-between">
                                            <p
                                                onClick={() => {
                                                    router.push(
                                                        '/courses/' +
                                                            course.code
                                                    )
                                                }}
                                                className="font-semibold cursor-pointer text-primary hover:underline duration-150 transition-all text-xl"
                                            >
                                                {course.title}
                                            </p>
                                            {user &&
                                                user.user_id ===
                                                    course.created_by_id && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                                            onClick={(e) =>
                                                                setSelectedCourse(
                                                                    course
                                                                )
                                                            }
                                                        >
                                                            <BsPencilSquare className="h-5 w-5 text-primary" />
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                                            onClick={(e) => {
                                                                deleteCourse(
                                                                    course.id,
                                                                    refetchCourses
                                                                )
                                                            }}
                                                        >
                                                            <RiDeleteBin6Line className="h-5 w-5 text-red-500" />
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="font-semibold">
                                                Code:
                                            </p>
                                            <p>{course.code}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="font-semibold">
                                                Title :
                                            </p>
                                            <p>{course.title}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="font-semibold">
                                                Credits:
                                            </p>
                                            <p>{course.credits}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="font-semibold">
                                                Instructor:
                                            </p>
                                            <p>{course.instructor}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="font-semibold">
                                                Total Reviews:
                                            </p>
                                            <p>{course._count?.reviews}</p>
                                        </div>
                                    </div>
                                )
                            })
                    ) : (
                        <div className="col-span-5 pt-24 w-full flex flex-col items-center justify-center">
                            <Player
                                autoplay={true}
                                loop={true}
                                className="h-56 w-56"
                                src="https://assets7.lottiefiles.com/packages/lf20_ttvteyvs.json"
                            />
                            <span className="font-bold text-2xl text-gray-700">
                                No Records Found
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
