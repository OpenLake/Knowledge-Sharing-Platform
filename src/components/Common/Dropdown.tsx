import { Dispatch, FC, RefAttributes, SetStateAction, forwardRef } from "react";

interface PropsType {
    items: Array<any>
    showDropdown: boolean
    setSelectedItem: Dispatch<SetStateAction<string>>
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}

export const Dropdown: FC<PropsType & RefAttributes<HTMLUListElement>> =
    forwardRef<HTMLUListElement, PropsType>(({
        items,
        showDropdown,
        setSelectedItem,
        setShowDropdown
    }, ref) => {
        return (
            <ul ref={ref} className={`${showDropdown ? 'absolute' : 'hidden'} max-h-44 top-16 overflow-x-clip z-50 border overflow-y-auto items-center min-w-[20%] border-gray-400 bg-gray-50 rounded shadow-xl flex flex-col`}>
                {
                    items.length ? items.map((item) => {
                        return (
                            <li
                                key={item.id}
                                onClick={() => {
                                    setSelectedItem(item.name)
                                    setShowDropdown(false)
                                }}
                                className="w-full text-center p-2 border-b bg-white hover:bg-gray-100 cursor-pointer"
                            >
                                {item.name}
                            </li>
                        )
                    })
                        :
                        <li className="w-full text-center font-semibold p-2 bg-white">
                            No records found
                        </li>
                }
            </ul>
        )
    })

Dropdown.displayName = "Dropdown"