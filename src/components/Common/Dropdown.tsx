import { Dispatch, FC, Ref, SetStateAction, forwardRef } from "react";

export const Dropdown: FC<{
    ref: Ref<any>
    items: Array<any>
    setSelectedItem: Dispatch<SetStateAction<string>>
    showDropdown: boolean
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}> = forwardRef(
    function Dropdown({ items, showDropdown, setShowDropdown, setSelectedItem }, ref) {
        return (
            <ul ref={ref} className={`${showDropdown ? 'absolute' : 'hidden'} max-h-44 top-16 overflow-x-clip z-50 border overflow-y-auto items-center min-w-[20%] border-gray-400 bg-gray-50 rounded shadow-xl flex flex-col`}>
                {
                    items.map((item) => {
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
                }
            </ul>
        )
    }
)