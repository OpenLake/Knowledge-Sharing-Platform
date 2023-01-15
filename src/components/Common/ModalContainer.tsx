import { Dispatch, FC, SetStateAction, useRef } from 'react'
import useOutsideClick from '../../hooks/useOutsideClick'

export const ModalContainer: FC<{
    showModal: boolean
    children?: any
    header: string
    setShowModal: Dispatch<SetStateAction<boolean>>
}> = ({ children, showModal, header, setShowModal }) => {
    return (
        <div
            className={`${
                !showModal && 'hidden'
            } flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full bg-black/50 overflow-x-hidden overflow-y-auto h-full`}
        >
            <div className="relative w-full h-full mt-16 flex flex-col justify-center max-w-2xl md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-start justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {header}
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
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
                    {children}
                </div>
            </div>
        </div>
    )
}
