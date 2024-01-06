import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react'
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
import { coursesColumnData } from '../../types/coursesColumnData'
import { deleteCourse } from '../../services/db/courses/deleteCourse'
import { UpvoteButton } from '../Common/UpvoteButton'
import { upvoteCourse } from '../../services/db/courses/upvoteCourse'
import { removeCourseUpvote } from '../../services/db/courses/removeCourseUpvote'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { GlobalFilter } from '../Common/GlobalFilter'

export const Table: FC<{
    courses: coursesColumnData[]
    setSelectedCourse: Dispatch<SetStateAction<any>>
    isDataFetching: boolean
    refetchCourses: Function
}> = ({ courses, refetchCourses, setSelectedCourse, isDataFetching }) => {
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
                                removeUpvoteHandler={removeCourseUpvote}
                                upvoteHandler={upvoteCourse}
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
                                Course Code
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
                accessor: 'courseCode',
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
                        row.value
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
                                    setSelectedCourse(row.value)
                                }}
                            >
                                <BsPencilSquare className="h-5 w-5 text-primary" />
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                onClick={(e) => {
                                    deleteCourse(row.value.id, refetchCourses)
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
        [isDataFetching, setSelectedCourse, refetchCourses, user]
    )
    const data = useMemo(
        () =>
            isDataFetching
                ? Array(8).fill({})
                : courses &&
                  courses?.map((course: any, index) => {
                      return {
                          sno: `${index + 1}.`,
                          id: course.id,
                          title: course.title,
                          upvotes: {
                              count: course._count.upvotes,
                              users: course.upvotes,
                          },
                          courseCode: course.code,
                          uploadedBy: course.created_by.name,
                          anonymous: course.anonymous,
                          actions: course,
                      }
                  }),
        [isDataFetching, courses]
    )

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

    return isDataFetching || courses.length ? (
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
