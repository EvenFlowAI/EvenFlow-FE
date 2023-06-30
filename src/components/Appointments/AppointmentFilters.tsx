import React, {useState} from 'react';
import {Grid, MenuItem, Paper, Select, IconButton} from "@material-ui/core";
import {Clear} from '@material-ui/icons';
import {TextField} from "../UI/TextField";
import {EAppointmentStatus} from "../../api/types";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";

type TAppointmentFilterProps = {
    handleSelectStatus: (e: React.ChangeEvent<{value: unknown}>) => void;
    status: EAppointmentStatus | '' | unknown;
    selectedDate: moment.Moment | null;
    onChange: (date: moment.Moment | null) => void;
}

const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({ handleSelectStatus, status, selectedDate, onChange }) => {
    const [isOpen, setOpen] = useState<boolean>(false);

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
            <Grid container spacing={2} justify="flex-end" alignItems='flex-end'>
                <Grid item xs={3}>
                    <DatePicker
                        onOpen={handleOpen(true)}
                        onClose={handleOpen(false)}
                        open={isOpen}
                        InputProps={{
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
            </Grid>
        </Paper>
    );
};

export default AppointmentFilters;