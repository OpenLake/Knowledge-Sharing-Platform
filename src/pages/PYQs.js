import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {visuallyHidden} from '@mui/utils';
import Popup from '../components/Popup';
// import axios from 'axios';

function createData(name, course_name, course_id, batch, link, voting) {
    return {
        name,
        course_name,
        course_id,
        batch,
        link,
        voting
    };
}

const rows = [
    createData('Dr.Soumajit Pramanik', 'Intro to Programming', 'IC100', 2020, 'xxx', 56),
    createData('Dr.Subhajit', 'Database Management Systems', 'CS204', 2019, 'xxx', 90),
    createData('Dr. Amit Dhar', 'Intro to Programming', 'IC100', 2019, 'xxx', 40),
    createData('Dr.Subidh Ali', 'Machine Learning', 'CS301', 2020, 'xxx', 35),
    createData('Dr. Dhiman', 'STT', 'CS201', 2019, 'xxx', 50),
    createData('Dr. xyz', 'abcde', 'IC222', 2021, 'xxx', 57),
    createData('Dr. ACB', 'abcjw', 'CY674', 2020, 'xxx', 59),
    createData('Dr. jwub', 'BWEFB', 'DS501', 2016, 'xxx', 30),
    createData('Dr. DQR', 'DBH', 'hwbd', 2021, 'xxx', 5),
    createData('Dr. qhwdb', 'bfberq', 'dbh', 2021, 'xxx', 66),
    createData('Dr.bhdb', 'nxje', 'CS303', 2019, 'xxx', 45),
    createData('Dr. abc', 'dcjen', 'IC493', 2019, 'xxx', 70),
    createData('Dr. Sonal Jha', 'Adaptation', 'LA323', 2019, 'xxx', 65),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        label: 'Course instructor',
    },
    {
        id: 'course_name',
        numeric: true,
        label: 'Course name',
    },
    {
        id: 'course_id',
        numeric: true,
        label: 'Course ID',
    },
    {
        id: 'batch',
        numeric: true,
        label: 'Batch',
    },
    {
        id: 'link',
        numeric: true,
        label: 'Link',
    },
    {
        id: 'voting',
        numeric: true,
        label: 'Voting',
    }
];

function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <>
            <Popup type='Papers'/>
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding='normal'
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        </>

    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = () => {

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
            }}
        >
            <Typography
                sx={{flex: '1 1 100%'}}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                All Previous Year Papers
            </Typography>
        </Toolbar>
    );
};

function Notes() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('voting');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <>
            <Box ml={42} mt={18.5} sx={{width: '75%'}}>
                <Paper sx={{width: '100%', mb: 2}}>
                    <EnhancedTableToolbar/>
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size='medium'
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>

                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={row.name}
                                            >
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding='normal'
                                                >
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.course_name}</TableCell>
                                                <TableCell align="right">{row.course_id}</TableCell>
                                                <TableCell align="right">{row.batch}</TableCell>
                                                <TableCell align="right">{row.link}</TableCell>
                                                <TableCell align="right">{row.voting}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 53 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </>

    );
}

export default Notes;

