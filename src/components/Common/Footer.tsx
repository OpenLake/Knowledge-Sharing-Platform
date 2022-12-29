import { FC } from "react"

export const Footer: FC<{}> = ({ }) => {
    const date = new Date()
    const year = date.getFullYear()

    return (
        <footer className="p-4 bg-primary text-white md:px-6 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0">
                    <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap ">Knowledge Sharing App</span>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0">
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
            <span className="block text-sm sm:text-center">Copyright © {year} <a href="https://flowbite.com/" className="hover:underline">KSP</a>
            </span>
        </footer>
    )
}