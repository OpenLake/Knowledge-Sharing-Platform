import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    Column,
    useFilters,
    useGlobalFilter,
    useSortBy,
    useTable,
} from 'react-table'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { BsPencilSquare } from 'react-icons/bs'
import { Player } from '@lottiefiles/react-lottie-player'
import { useAuth } from '../../contexts/auth'
import { pyqsColumnData } from '../../types/pyqsColumnData'
import { deletePyq } from '../../services/db/pyqs/deletePyq'
import { UpvoteButton } from '../Common/UpvoteButton'
import { removePyqUpvote } from '../../services/db/pyqs/removePyqUpvote'
import { upvotePyq } from '../../services/db/pyqs/upvotePyq'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { GlobalFilter } from '../Common/GlobalFilter'

const dummyPyqsData: pyqsColumnData[] = [
    {
        sno: '1.',
        upvotes: {
            count: 10,
            users: [
                { user_id: 'user1' },
                { user_id: 'user2' }
            ],
        },
        title: 'Sample Title 1',
        subjectCode: 'SC001',
        subjectName: 'Sample Subject 1',
        url: 'https://example.com/sample1',
        semester: 'Semester 1',
        instructor: 'Instructor 1',
        branch: 'Branch 1',
        uploadedBy: 'User 1',
        actions: <button onClick={() => console.log('Edit')}>Edit</button>,
    },
    {
        sno: '2.',
        upvotes: {
            count: 5,
            users: [
                { user_id: 'user3' },
                { user_id: 'user4' }
            ],
        },
        title: 'Sample Title 2',
        subjectCode: 'SC002',
        subjectName: 'Sample Subject 2',
        url: 'https://example.com/sample2',
        semester: 'Semester 2',
        instructor: 'Instructor 2',
        branch: 'Branch 2',
        uploadedBy: 'User 2',
        actions: <button onClick={() => console.log('Edit')}>Edit</button>,
    },
];


export const Table: FC<{
    pyqs: pyqsColumnData[]
    setSelectedPYQ: Dispatch<SetStateAction<any>>
    isDataFetching: boolean
    refetchPYQs: Function
}> = ({ pyqs, refetchPYQs, setSelectedPYQ, isDataFetching }) => {
    const { user, loading }: any = useAuth()
    const columns = useMemo<Column<any>[]>(
        () => [
            {
                Header: 'S.No.',
                accessor: 'sno',
                disableSortBy: true,
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end justify-center space-x-2 w-full">
                            <span>Upvotes</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'upvotes',
                sortType: (rowA: any, rowB: any) => {
                    return rowA.values.upvotes.count > rowB.values.upvotes.count
                        ? 1
                        : -1
                },
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value && (
                            <UpvoteButton
                                id={row.row.original.id}
                                users={row.value.users}
                                upvotesCount={row.value.count}
                                removeUpvoteHandler={removePyqUpvote}
                                upvoteHandler={upvotePyq}
                            />
                        )
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end justify-center space-x-2 w-full">
                            <span>Title</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'title',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end justify-center w-full space-x-2">
                            <span className="whitespace-nowrap">
                                Subject Code
                            </span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'subjectCode',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end justify-center w-full space-x-2">
                            <span>Subject</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'subjectName',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'URL',
                accessor: 'url',
                disableSortBy: true,
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        <Link
                            target={'_blank'}
                            href={row.value}
                        >
                            <span className="text-ellipsis text-blue-500 hover:underline">
                                URL
                            </span>
                        </Link>
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end w-full justify-center space-x-2">
                            <span>Semester</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'semester',
                filterMethod: (filter: any, row: any) =>
                    row._original.semester.includes(filter.value),
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end justify-center w-full space-x-2">
                            <span>Instructor</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'instructor',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: (header: any) => {
                    return (
                        <div className="flex items-end w-full justify-center space-x-2">
                            <span>Branch</span>
                            {header.column.canSort ? (
                                header.column.isSortedDesc ? (
                                    <IoMdArrowDropdown className="h-5 w-5" />
                                ) : (
                                    <IoMdArrowDropup className="h-5 w-5" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    )
                },
                accessor: 'branch',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Uploaded By',
                accessor: 'uploadedBy',
                disableSortBy: true,
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : row.row.original.anonymous ? (
                        'Anonymous'
                    ) : (
                        <span className="whitespace-nowrap">{row.value}</span>
                    ),
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                disableSortBy: true,
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : user && row.value.created_by_id === user.user_id ? (
                        <div className="flex items-center justify-center">
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                onClick={(e) => {
                                    setSelectedPYQ(row.value)
                                }}
                            >
                                <BsPencilSquare className="h-5 w-5 text-primary" />
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                onClick={(e) => {
                                    deletePyq(row.value.id, refetchPYQs)
                                }}
                            >
                                <RiDeleteBin6Line className="h-5 w-5 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <div></div>
                    ),
            },
        ],
        [isDataFetching, setSelectedPYQ, refetchPYQs, user]
    )
    const data = useMemo(
        () =>
            isDataFetching
                ? Array(8).fill({})
                : dummyPyqsData
                ? dummyPyqsData.map((pyq: any, index) => {
                      return {
                          sno: `${index + 1}.`,
                          id: pyq.id,
                          title: pyq.title,
                          upvotes: {
                              count:  // Replace this with a static value or your logic
                                  pyq.upvotes ? pyq.upvotes.length : 0, // For example, counting the length of upvotes array
                              users: pyq.upvotes,
                          },
                          subjectCode: pyq.subjectCode,
                          subjectName: pyq.subjectName ? pyq.subjectName : '',
                          url: pyq.url,
                          semester: pyq.semester,
                          instructor: pyq.instructor ? pyq.instructor: '',
                          branch: pyq.branch,
                          uploadedBy: pyq.created_by ? pyq.uploadedBy : '',
                          anonymous: pyq.anonymous,
                          actions: pyq,
                      };
                  })
                : [],
        [isDataFetching, dummyPyqsData]
    );
    
    

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        state,
        visibleColumns,
        setHiddenColumns,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy)

    //? effects
    useEffect(() => {
        if (!loading) {
            if (user) {
                setHiddenColumns([])
            } else {
                setHiddenColumns(['actions'])
            }
        }
    }, [loading, setHiddenColumns, user])

    return isDataFetching || dummyPyqsData.length ? (
        <div className="flex flex-col space-y-2 w-full">
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <div className="flex overflow-x-auto">
                <table
                    className="w-full"
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups.map((headerGroup, index) => {
                            const {
                                key: headerGroupPropsKey,
                                ...restHeaderGroupProps
                            } = headerGroup.getHeaderGroupProps()
                            return (
                                <tr
                                    className=""
                                    key={headerGroupPropsKey}
                                    {...restHeaderGroupProps}
                                >
                                    {headerGroup.headers.map((column: any) => {
                                        const {
                                            key: headerPropsKey,
                                            ...restHeaderProps
                                        } = column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )
                                        return (
                                            <th
                                                key={headerPropsKey}
                                                className="bg-gray-200 text-gray-900 font-semibold p-3"
                                                {...restHeaderProps}
                                            >
                                                {column.render('Header')}
                                            </th>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            const { key: rowPropsKey, ...restRowProps } =
                                row.getRowProps()
                            return (
                                <tr
                                    key={rowPropsKey}
                                    className="hover:bg-gray-50"
                                    {...restRowProps}
                                >
                                    {row.cells.map((cell) => {
                                        const {
                                            key: cellPropsKey,
                                            ...restCellProps
                                        } = cell.getCellProps()
                                        return (
                                            <td
                                                key={cellPropsKey}
                                                className="text-center p-3 border-b"
                                                {...restCellProps}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <div className="col-span-5 pt-24 w-full flex flex-col items-center justify-center">
            <Player
                autoplay={true}
                loop={true}
                className="h-56 w-56"
                src="https://assets7.lottiefiles.com/packages/lf20_ttvteyvs.json"
            />
            <span className="font-bold text-2xl text-gray-700">
                No Records Found
            </span>
        </div>
    )
}
