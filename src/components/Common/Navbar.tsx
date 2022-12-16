import { FC } from "react";
import { Logo } from "./Logo";
import Link from "next/link";

export const Navbar: FC<{}> = ({ }) => {
    return (
        <div className="w-full bg-primary px-8 py-3 flex justify-between items-center">
            <Logo />
            <div className="flex space-x-8 text-white justify-between items-center">
                <Link href={'/notes'}>
                    <span className="cursor-pointer">
                        Notes
                    </span>
                </Link>
                <Link href={'/pyqs'}>
                    <span className="cursor-pointer">
                        PYQs
                    </span>
                </Link>
            </div>
        </div>
    )
}