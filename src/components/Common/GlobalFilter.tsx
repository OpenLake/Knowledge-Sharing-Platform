import { FC, useState } from 'react'

export const GlobalFilter: FC<{
    preGlobalFilteredRows: any
    globalFilter: any
    setGlobalFilter: any
}> = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
    const records = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = (value: any) => {
        setGlobalFilter(value || undefined)
    }

    return (
        <div className="flex w-full px-2 py-3">
            <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
                Search
            </label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>
                <input
                    value={value || ''}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange(e.target.value)
                    }}
                    type="search"
                    id="search"
                    className="w-full font-medium text-base pl-12 pr-2 py-2 md:pr-4 md:py-4 text-gray-700 outline-none ring-2 ring-primary/40 focus:border-none rounded-md bg-primary/5 focus:bg-primary/10 focus:ring-primary placeholder:font-medium placeholder:text-gray-600"
                    placeholder={`Search ${records} records...`}
                />
            </div>
        </div>
    )
}
