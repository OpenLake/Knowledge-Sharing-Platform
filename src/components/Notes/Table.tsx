import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Column, useTable } from 'react-table'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { notesColumnData } from '../../types/notesColumnData'
import { BsPencilSquare } from 'react-icons/bs'
import { Player } from '@lottiefiles/react-lottie-player'
import { useAuth } from '../../contexts/auth'
import { deleteNotes } from '../../services/db/notes/deleteNotes'
import { UpvoteButton } from '../Common/UpvoteButton'
import { removeNotesUpvote } from '../../services/db/notes/removeNotesUpvote'
import { upvoteNotes } from '../../services/db/notes/upvoteNotes'

export const Table: FC<{
    notes: notesColumnData[]
    setSelectedNote: Dispatch<SetStateAction<any>>
    isDataFetching: boolean
    refetchNotes: Function
}> = ({ notes, refetchNotes, setSelectedNote, isDataFetching }) => {
    const { user, loading }: any = useAuth()
    const columns = useMemo<Column<notesColumnData>[]>(
        () => [
            {
                Header: 'S.No.',
                accessor: 'sno',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Upvotes',
                accessor: 'upvotes',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value && (
                            <UpvoteButton
                                id={row.row.original.id}
                                users={row.value.users}
                                upvotesCount={row.value.count}
                                removeUpvoteHandler={removeNotesUpvote}
                                upvoteHandler={upvoteNotes}
                            />
                        )
                    ),
            },
            {
                Header: 'Title',
                accessor: 'title',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Subject Code',
                accessor: 'subjectCode',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Subject',
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
                Header: 'Semester',
                accessor: 'semester',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Instructor',
                accessor: 'instructor',
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : (
                        row.value
                    ),
            },
            {
                Header: 'Branch',
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
                Cell: (row: any) =>
                    isDataFetching ? (
                        <div className="h-2.5 bg-gray-200 w-24"></div>
                    ) : user && row.value.created_by_id === user.user_id ? (
                        <div className="flex items-center justify-center">
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                onClick={(e) => {
                                    setSelectedNote(row.value)
                                }}
                            >
                                <BsPencilSquare className="h-5 w-5 text-primary" />
                            </button>
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 duration-150"
                                onClick={(e) => {
                                    deleteNotes(row.value.id, refetchNotes)
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
        [isDataFetching, setSelectedNote, refetchNotes, user]
    )
    const data = useMemo(
        () =>
            isDataFetching
                ? Array(8).fill({})
                : notes &&
                  notes.map((note: any, index) => {
                      return {
                          sno: `${index + 1}.`,
                          id: note.id,
                          upvotes: {
                              count: note._count.upvotes,
                              users: note.upvotes,
                          },
                          title: note.title,
                          subjectCode: note.subject_code,
                          subjectName: note.subject.name,
                          url: note.url,
                          semester: note.semester,
                          instructor: note.instructor.name,
                          branch: note.branch,
                          uploadedBy: note.created_by.name,
                          anonymous: note.anonymous,
                          actions: note,
                      }
                  }),
        [isDataFetching, notes]
    )

    const tableInstance = useTable({ columns, data })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        setHiddenColumns,
        prepareRow,
    } = tableInstance

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

    return isDataFetching ? (
        <table
            {...getTableProps()}
            className="w-full"
        >
            <thead className="">
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
                            {headerGroup.headers.map((column) => {
                                const {
                                    key: headerPropsKey,
                                    ...restHeaderProps
                                } = column.getHeaderProps()
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
                                const { key: cellPropsKey, ...restCellProps } =
                                    cell.getCellProps()
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
    ) : !loading && notes.length ? (
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
                            {headerGroup.headers.map((column) => {
                                const {
                                    key: headerPropsKey,
                                    ...restHeaderProps
                                } = column.getHeaderProps()
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
                                const { key: cellPropsKey, ...restCellProps } =
                                    cell.getCellProps()
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
