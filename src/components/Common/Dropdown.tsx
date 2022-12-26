import { Dispatch, FC, SetStateAction } from "react";

export const Dropdown: FC<{
    items: Array<any>
    setSelectedItem: Dispatch<SetStateAction<string>>
    showDropdown: boolean
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}> = ({
    items, showDropdown, setShowDropdown, setSelectedItem
}) => {
        return (
            <ul className={`${showDropdown ? 'absolute' : 'hidden'} h-56 overflow-x-clip border-2 -bottom-12 overflow-y-auto w-1/3 border-gray-400 bg-white rounded-md shadow-md flex flex-col`}>
                {
                    items.map((item) => {
                        return (
                            <li onClick={() => {
                                setShowDropdown(false)
                                setSelectedItem(item.name)
                            }} key={item.id} className="font-semibold p-3 border-b bg-white hover:bg-gray-100 cursor-pointer">{item.name}</li>
                        )
                    })
                }
            </ul>
        )
    }