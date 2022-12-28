import { Dispatch, FC, Ref, SetStateAction } from "react";

export const Dropdown: FC<{
    ref?: Ref<any>
    items: Array<any>
    setSelectedItem: Dispatch<SetStateAction<string>>
    showDropdown: boolean
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}> = ({
    ref, items, showDropdown, setShowDropdown, setSelectedItem
}) => {
        return (
            <ul ref={ref} className={`${showDropdown ? 'absolute' : 'hidden'} max-h-44 top-16 overflow-x-clip z-50 border-2 overflow-y-auto items-center min-w-[20%] border-gray-300 bg-white rounded shadow-xl flex flex-col`}>
                {
                    items.map((item) => {
                        return (
                            <li
                                key={item.id}
                                onClick={() => {
                                    setSelectedItem(item.name)
                                    setShowDropdown(false)
                                }}
                                className="font-semibold w-full text-center p-2 border-b bg-white hover:bg-gray-100 cursor-pointer"
                            >
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }