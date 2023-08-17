import React, {useState} from 'react';
import {Grid, MenuItem, Paper, Select, IconButton} from "@material-ui/core";
import {Clear} from '@material-ui/icons';
import {TextField} from "../UI/TextField";
import {EAppointmentStatus} from "../../api/types";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";

type TAppointmentFilterProps = {
    handleSelectStatus: (e: React.ChangeEvent<{value: unknown}>) => void;
    handleSelectScheduler: (e: React.ChangeEvent<{value: unknown}>) => void;
    handleSelectServiceBook: (e: React.ChangeEvent<{value: unknown}>) => void;
    status: EAppointmentStatus | '' | unknown;
    scheduler: string | unknown;
    serviceBook: string | unknown;
    selectedDate: moment.Moment | null;
    onChange: (date: moment.Moment | null) => void;
}

const useStyles = makeStyles({
    label: {
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left'
    }
})

const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
                                                                   handleSelectStatus,
                                                                   status,
                                                                   selectedDate,
                                                                   onChange,
                                                                   handleSelectScheduler,
                                                                   handleSelectServiceBook,
                                                                   scheduler,
                                                                   serviceBook,
                                                               }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const classes = useStyles()

    const handleOpen = (s: boolean) => () => {
        setOpen(s);
    }

    const handleDateChange = (date: MaterialUiPickersDate) => {
        onChange(moment(date));
    }

    const handleClear = (e: any) => {
        e.stopPropagation();
        onChange(null);
    }

    return (
        <Paper variant="outlined" style={{
            borderRadius: 0, marginBottom: 18, padding: 18, width: '100%'
        }}>
            <Grid container spacing={2} justify="space-between" alignItems='flex-end'>
                <Grid item xs={3}>
                    <div className={classes.label}>Date</div>
                    <DatePicker
                        style={{width: "100%"}}
                        onOpen={handleOpen(true)}
                        onClose={handleOpen(false)}
                        open={isOpen}
                        InputProps={{
                            label: "Date",
                            placeholder: "Date",
                            endAdornment:
                                selectedDate
                                    ? (<IconButton onClick={(e) => handleClear(e)}>
                                    <Clear />
                                </IconButton>)
                                    : null }}
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        placeholder='Status'
                        onChange={handleSelectStatus}
                        value={status}
                        input={
                            <TextField label='Status'/>
                        }
                    >
                        <MenuItem value=''>-</MenuItem>
                        {Object.keys(EAppointmentStatus).filter(item => Number.isNaN(+item)).map(status => {
                            return <MenuItem key={status} value={status}>{status}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        placeholder='Shceduler'
                        onChange={handleSelectScheduler}
                        value={scheduler}
                        input={
                            <TextField label='Shceduler'/>
                        }
                    >
                        <MenuItem value=''>-</MenuItem>
                        {Object.keys(EAppointmentStatus).filter(item => Number.isNaN(+item)).map(status => {
                            return <MenuItem key={status} value={status}>{status}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        placeholder='Service Book'
                        onChange={handleSelectServiceBook}
                        value={serviceBook}
                        input={
                            <TextField label='Service Book'/>
                        }
                    >
                        <MenuItem value=''>-</MenuItem>
                        {Object.keys(EAppointmentStatus).filter(item => Number.isNaN(+item)).map(status => {
                            return <MenuItem key={status} value={status}>{status}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AppointmentFilters;