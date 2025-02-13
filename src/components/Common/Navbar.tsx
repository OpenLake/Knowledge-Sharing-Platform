import { FC, useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { FcGoogle } from 'react-icons/fc'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'
import Image from 'next/image'
import Link from 'next/link'

export const Navbar: FC<{}> = ({}) => {
    const router = useRouter()
    const { user, photoURL, displayName, login, logout, loading } = useAuth()
    const activeRef = useRef<any | null>(null)
    const [activeOffsetWidth, setActiveOffsetWidth] = useState<string>('')
    const [activeOffsetLeft, setActiveOffsetLeft] = useState<string>('')
    const [showOptions, setShowOptions] = useState(false)

    useEffect(() => {
        if (activeRef.current) {
            setActiveOffsetWidth(activeRef.current.offsetWidth.toString())
            setActiveOffsetLeft(activeRef.current.offsetLeft.toString())
        }
    }, [router, activeRef, activeRef.current?.offsetWidth])

    return (
        <div className="w-full fixed top-0 right-0 left-0  z-50 bg-bg-primary shadow-md px-5 md:px-8 py-3 md:py-6 space-y-3 md:space-y-0 flex flex-col">
            <div className="flex justify-between items-center">
                <Logo />
                {user ? (
                    <div
                        onClick={() => setShowOptions(!showOptions)}
                        className="rounded-full bg-white cursor-pointer flex space-x-2 items-center pl-2 pr-3 py-2"
                    >
                        <Image
                            className="rounded-full"
                            src={photoURL || '/default-profile.jpg'}
                            width={40}
                            height={40}
                            alt="user"
                        />
                        <span className="font-semibold">{displayName}</span>
                        <BsThreeDotsVertical className="h-6 w-6 text-primary" />
                        {showOptions && (
                            <div
                                onClick={logout}
                                className="absolute top-[5.5rem] z-50 bg-white py-2 rounded-xl flex flex-col items-center justify-center"
                            >
                                <div className="px-5 py-3 cursor-pointer group hover:bg-black/10 flex space-x-2 items-center justify-between">
                                    <p className="font-semibold ">Logout</p>
                                    <FiLogOut className="h-6 w-6 text-gray-800" />
                                </div>
                                <Link href="/profile"> 
                                    <a className="px-5 py-3 cursor-pointer group hover:bg-black/10 flex space-x-2 items-center justify-between">
                                        <p className="font-semibold">Profile</p>
                                    </a>
                                </Link>
                              
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        disabled={loading}
                        onClick={login}
                        className="disabled:cursor-wait rounded-full bg-white cursor-pointer flex space-x-2 items-center py-2 px-3"
                    >
                        <FcGoogle className="h-7 w-7 text-primary" />
                        <span className="font-semibold">Login</span>
                    </button>
                )}
            </div>

            <div className="flex gap-3 overflow-hidden relative justify-center items-center font-semibold">
                <span
                    ref={router.asPath === '/' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[""] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-75 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}
                >
                    Home
                </span>
                <span
                    ref={router.asPath === '/notes' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/notes')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[""] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-75 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}
                >
                    Notes
                </span>

                <span
                    ref={router.asPath === '/pyqs' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/pyqs')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[''] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-100 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}
                >
                    PYQs
                </span>

                <span
                    ref={router.asPath === '/courses' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/courses')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[''] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-100 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}
                >
                    Courses
                </span>


                <span
                    ref={router.asPath === '/rateprofessor' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/rateprofessor')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[''] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-100 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}
                >
                    Rate Professor
                </span>

                <span
                    style={{
                        width: `${activeOffsetWidth}px`,
                        left: `${activeOffsetLeft}px`,
                        transition: 'all 0.3s',
                    }}
                    className={`absolute bg-primary left-0 bottom-0 h-[5px] z-[1] rounded-[8px_8px_0_0]`}
                ></span>
            </div>
        </div>
    )
}
