import { Dispatch, FC, SetStateAction, useRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import useOutsideClick from '../../hooks/useOutsideClick'
import { isStringMatch } from '../../utils/isStringMatch'

export const SelectInput: FC<{
    createNew?: boolean
    dropdownKey: string
    dropdownValue: string
    type: string
    inputName: string
    placeholder: string
    selectedValue: any
    inputValue: any
    dropdownItems: any
    showDropdown: boolean
    setShowDropdown: Dispatch<SetStateAction<boolean>>
    setSelectedValue: Dispatch<SetStateAction<any>>
    setInputValue: Dispatch<SetStateAction<any>>
    inputTitle: string
}> = ({
    createNew = true,
    dropdownKey,
    dropdownValue,
    type,
    selectedValue,
    inputName,
    placeholder,
    inputTitle,
    inputValue,
    showDropdown,
    dropdownItems,
    setInputValue,
    setShowDropdown,
    setSelectedValue,
}) => {
    const dropdownRef = useRef(null)

    useOutsideClick([dropdownRef], () => {
        setShowDropdown(false)
    })

    return (
        <div className="flex flex-col space-y-1 relative">
            <span className="font-semibold">{inputTitle}</span>
            <label
                htmlFor={inputName}
                className="flex items-center"
            >
                <input
                    name={inputName}
                    type={type}
                    autoComplete="off"
                    disabled={!!selectedValue}
                    placeholder={selectedValue ? '' : placeholder}
                    value={inputValue}
                    onFocus={() => {
                        dropdownItems.length
                            ? setShowDropdown(true)
                            : inputValue !== ''
                            ? setShowDropdown(true)
                            : setShowDropdown(false)
                    }}
                    onChange={(e) => {
                        setShowDropdown(true)
                        setInputValue(e.target.value)
                    }}
                    className="p-1 ring-1 relative ring-gray-400 rounded-sm w-full shadow-md"
                />
                {selectedValue && (
                    <div className="absolute flex items-center left-1 max-w-[90%] space-x-1 p-0.5 rounded-sm bg-primary/20 text-primary">
                        <span className="truncate">{selectedValue}</span>
                        <IoMdClose
                            onClick={() => setSelectedValue('')}
                            className="h-5 w-5 cursor-pointer"
                        />
                    </div>
                )}
            </label>
            <ul
                ref={dropdownRef}
                className={`${
                    showDropdown ? 'absolute' : 'hidden'
                } max-h-56 overflow-x-clip border z-50 top-16 overflow-y-auto w-1/2 border-gray-400 bg-gray-50 rounded shadow-xl flex flex-col`}
            >
                {dropdownItems
                    ?.filter((item: any) =>
                        isStringMatch(inputValue, item[dropdownValue])
                    )
                    ?.map((item: any) => {
                        return (
                            <li
                                key={item.id}
                                className="px-2 py-1 md:py-2 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedValue(item[dropdownKey])
                                    setInputValue('')
                                    setShowDropdown(false)
                                }}
                            >
                                {item[dropdownValue]}
                            </li>
                        )
                    })}
                {createNew ? (
                    !dropdownItems?.find((item: any) =>
                        isStringMatch(inputValue, item[dropdownValue])
                    ) &&
                    inputValue !== '' && (
                        <li
                            onClick={() => {
                                setShowDropdown(false)
                                setSelectedValue(inputValue)
                                setInputValue('')
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            Create a new {inputTitle} &quot;
                            <span className="font-semibold">{inputValue}</span>
                            &quot;
                        </li>
                    )
                ) : (
                    <li className="w-full text-center font-semibold px-2 py-1 md:py-2 bg-white">
                        No records found
                    </li>
                )}
            </ul>
        </div>
    )
}
