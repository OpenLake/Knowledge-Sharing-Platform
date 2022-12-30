import { FC, useEffect, useMemo } from "react"
import Link from "next/link"
import { Column, useTable } from "react-table"
import { RiDeleteBin6Line } from 'react-icons/ri'
import { notesColumnData } from "../../types/notesColumnData"
import { BsPencilSquare } from "react-icons/bs";
import { Player } from "@lottiefiles/react-lottie-player"
import { useAuth } from "../../contexts/auth"
import { deleteNotes } from "../../services/db/deleteNotes"

export const Table: FC<{
    notes: notesColumnData[]
    isDataFetching: boolean
    refetchNotes: Function
}> = ({
    notes,
    refetchNotes,
    isDataFetching
}) => {
        const { user }: any = useAuth()
        const initialState = { hiddenColumns: ['actions'] }
        const columns = useMemo<Column<notesColumnData>[]>(
            () =>
                [
                    {
                        Header: 'S.No.',
                        accessor: 'sno',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'Title',
                        accessor: 'title',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'Subject Code',
                        accessor: 'subjectCode',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'Subject',
                        accessor: 'subject',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'URL',
                        accessor: 'url',
                        Cell: (row: any) => isDataFetching ?
                            <div className="h-2.5 bg-gray-200 w-24"></div>
                            :
                            <Link target={"_blank"} href={row.value}>
                                <span className="text-ellipsis text-blue-500 hover:underline">{row.value}</span>
                            </Link>
                    },
                    {
                        Header: 'Class',
                        accessor: 'class',
                        Cell: (row: any) => {
                            let suffix = "th"
                            if (!isDataFetching) {
                                if (row.value === "1")
                                    suffix = "st"
                                else if (row.value === "2")
                                    suffix = "nd"
                                else if (row.value === "3")
                                    suffix = "rd"
                            }

                            return isDataFetching ?
                                <div className="h-2.5 bg-gray-200 w-24"></div>
                                :
                                <span>{row.value + suffix} Year</span>
                        }
                    },
                    {
                        Header: 'Batch',
                        accessor: 'batch',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'Branch',
                        accessor: 'branch',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.value
                        )
                    },
                    {
                        Header: 'Uploaded By',
                        accessor: 'uploadedBy',
                        Cell: (row: any) => (
                            isDataFetching ? <div className="h-2.5 bg-gray-200 w-24"></div> : row.row.original.anonymous ? 'Anonymous' : row.value
                        )
                    },
                    {
                        Header: 'Actions',
                        accessor: 'actions',

                        Cell: (row: any) => isDataFetching ?
                            <div className="h-2.5 bg-gray-200 w-24"></div>
                            :
                            user && (row.value.created_by_id === user.user_id) ?
                                <div className="flex items-center justify-center">
                                    <button className="p-2 rounded-full hover:bg-gray-200 duration-150" onClick={e => console.log(row.row.original)}>
                                        <BsPencilSquare className="h-5 w-5 text-primary" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-200 duration-150" onClick={e => {
                                        deleteNotes(row.value.id)
                                        refetchNotes()
                                    }}>
                                        <RiDeleteBin6Line className="h-5 w-5 text-red-500" />
                                    </button>
                                </div> :
                                <div></div>
                    }
                ]
            ,
            [isDataFetching, refetchNotes, user]
        )
        const data = useMemo(
            () => (isDataFetching ? Array(8).fill({}) : notes && notes.map((note: any) => {
                return {
                    sno: `${note.id}.`,
                    title: note.title,
                    subjectCode: note.subject,
                    subject: note.subjects.name,
                    url: note.url,
                    class: note.class,
                    batch: note.batch,
                    branch: note.branch,
                    uploadedBy: note.created_by.name,
                    anonymous: note.anonymous,
                    actions: note
                }
            })),
            [isDataFetching, notes]
        )

        const tableInstance = useTable({ columns, data, initialState })

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
            if (user) setHiddenColumns([])
        }, [setHiddenColumns, user])

        return isDataFetching ?
            <table className="col-span-5 overflow-x-auto" {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map((headerGroup, index) => {
                            const { key: headerGroupPropsKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                            return (
                                <tr className="" key={headerGroupPropsKey} {...restHeaderGroupProps}>
                                    {
                                        headerGroup.headers.map(column => {
                                            const { key: headerPropsKey, ...restHeaderProps } = column.getHeaderProps()
                                            return (
                                                <th key={headerPropsKey} className="bg-gray-200 text-gray-900 font-semibold p-3" {...restHeaderProps}>
                                                    {
                                                        column.render('Header')}
                                                </th>
                                            )
                                        })}
                                </tr>
                            )
                        })
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)
                            const { key: rowPropsKey, ...restRowProps } = row.getRowProps()
                            return (
                                <tr key={rowPropsKey} className="hover:bg-gray-50" {...restRowProps}>
                                    {
                                        row.cells.map(cell => {
                                            const { key: cellPropsKey, ...restCellProps } = cell.getCellProps()
                                            return (
                                                <td key={cellPropsKey} className="text-center p-3 border-b" {...restCellProps}>
                                                    {
                                                        cell.render('Cell')
                                                    }
                                                </td>
                                            )
                                        })}
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            :
            notes.length ?
                <table className="col-span-5 overflow-x-auto" {...getTableProps()}>
                    <thead>
                        {
                            headerGroups.map((headerGroup, index) => {
                                const { key: headerGroupPropsKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                                return (
                                    <tr className="" key={headerGroupPropsKey} {...restHeaderGroupProps}>
                                        {
                                            headerGroup.headers.map(column => {
                                                const { key: headerPropsKey, ...restHeaderProps } = column.getHeaderProps()
                                                return (
                                                    <th key={headerPropsKey} className="bg-gray-200 text-gray-900 font-semibold p-3" {...restHeaderProps}>
                                                        {
                                                            column.render('Header')}
                                                    </th>
                                                )
                                            })}
                                    </tr>
                                )
                            })
                        }
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            rows.map(row => {
                                prepareRow(row)
                                const { key: rowPropsKey, ...restRowProps } = row.getRowProps()
                                return (
                                    <tr key={rowPropsKey} className="hover:bg-gray-50" {...restRowProps}>
                                        {
                                            row.cells.map(cell => {
                                                const { key: cellPropsKey, ...restCellProps } = cell.getCellProps()
                                                return (
                                                    <td key={cellPropsKey} className="text-center p-3 border-b" {...restCellProps}>
                                                        {
                                                            cell.render('Cell')
                                                        }
                                                    </td>
                                                )
                                            })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
                :
                <div className="col-span-5 pt-24 flex flex-col items-center justify-center">
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
    }