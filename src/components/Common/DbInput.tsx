import { Dispatch, FC, SetStateAction } from 'react'

export const DbInput: FC<{
    inputTitle: string
    placeholder: string
    type: string
    value: any
    setValue: Dispatch<SetStateAction<any>>
}> = ({ inputTitle, setValue, value, placeholder, type }) => {
    return (
        <div className="flex flex-col space-y-1">
            <span className="font-semibold">{inputTitle}</span>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                type={type}
                className="p-1 ring-1 ring-gray-400 rounded-sm shadow-md"
            />
        </div>
    )
}
