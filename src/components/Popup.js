import * as React from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {indigo} from "@mui/material/colors";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import '../pages/css/Notes.css';

const theme = createTheme({
    palette: {
        primary: {
            main: indigo[500],
        },
    },
});

function Popup(props) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <div className='new'>
            <ThemeProvider theme={theme}>
                <Button variant='contained' color='primary' onClick={handleClickOpen}>
                    ADD NEW {props.type}
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Course ID'
                            type='text'
                            fullWidth
                            variant='standard'
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Course name'
                            type='text'
                            fullWidth
                            variant='standard'
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Course instructor'
                            type='text'
                            fullWidth
                            variant='standard'
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Batch'
                            type='number'
                            fullWidth
                            variant='standard'
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label={props.type === 'REVIEW' ? 'Review' : 'Link'}
                            type='text'
                            fullWidth
                            variant='standard'
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

        </div>


    );
}

export default Popup;