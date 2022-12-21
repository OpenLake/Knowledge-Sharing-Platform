import { FC, Ref, RefObject, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { FcGoogle } from 'react-icons/fc'
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import Image from 'next/image'

export const Navbar: FC<{}> = ({ }) => {
    const router = useRouter()
    const { user, photoURL, displayName, login } = useAuth()
    const activeRef = useRef<any | null>(null)
    const [activeOffsetWidth, setActiveOffsetWidth] = useState<string>('')
    const [activeOffsetLeft, setActiveOffsetLeft] = useState<string>('')

    useEffect(() => {
        if (activeRef.current) {
            setActiveOffsetWidth(activeRef.current.offsetWidth.toString())
            setActiveOffsetLeft(activeRef.current.offsetLeft.toString())
        }
    }, [router, activeRef, activeRef.current?.offsetWidth])

    return (
        <div className="w-full fixed top-0 right-0 left-0 z-50 bg-transparent px-8 py-6 flex flex-col">
            <div className="flex justify-between items-center">
                <Logo />
                {
                    user ?
                        <div className="rounded-full bg-white cursor-pointer flex space-x-2 items-center pl-2 pr-3 py-2">
                            <Image className="rounded-full" src={photoURL} width={40} height={40} alt="user" />
                            <span className="text-lg font-semibold">{displayName}</span>
                        </div>
                        :
                        <div onClick={login} className="rounded-full bg-white cursor-pointer flex space-x-2 items-center p-3">
                            <FcGoogle className="h-7 w-7 text-primary" />
                            <span className="text-lg font-semibold">Login with Google</span>
                        </div>
                }
            </div>

            <div className="inline-flex gap-3 overflow-hidden relative justify-center items-center font-semibold text-xl">
                <span
                    ref={router.asPath === '/' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[""] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-75 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}>
                    Home
                </span>
                <span
                    ref={router.asPath === '/notes' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/notes')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[""] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-75 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}>
                    Notes
                </span>

                <span
                    ref={router.asPath === '/pyqs' ? activeRef : null}
                    onClick={(e) => {
                        router.push('/pyqs')
                    }}
                    className={`cursor-pointer p-3 relative before:content-[''] before:absolute before:bottom-[-7px] before:left-0 before:w-full before:h-[5px] before:bg-primary/40 before:rounded-[8px_8px_0_0] before:opacity-0 before:duration-100 text-gray-600 hover:before:opacity-100 hover:before:bottom-0 hover:text-gray-800`}>
                    PYQs
                </span>
                <span
                    style={{
                        width: `${activeOffsetWidth}px`,
                        left: `${activeOffsetLeft}px`,
                        transition: 'all 0.3s'
                    }}
                    className={`absolute bg-primary left-0 bottom-0 h-[5px] z-[1] rounded-[8px_8px_0_0]`}></span>
            </div>
        </div >
    )
}