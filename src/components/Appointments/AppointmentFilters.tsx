import React, {useEffect, useState} from 'react';
import {Grid, MenuItem, Paper, Select, IconButton} from "@material-ui/core";
import {Clear} from '@material-ui/icons';
import {TextField} from "../UI/TextField";
import {EAppointmentStatus} from "../../api/types";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import {useSCs} from "../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadSchedulerList, loadServiceBookList} from "../../store/reducers/appointments/actions";
import {RootState} from "../../store/rootReducer";
import {TScheduler, TServiceBook} from "../../store/reducers/appointments/types";

type TAppointmentFilterProps = {
    handleSelectStatus: (e: React.ChangeEvent<{value: unknown}>) => void;
    handleSelectScheduler: (e: React.ChangeEvent<{value: unknown}>) => void;
    handleSelectServiceBook: (e: React.ChangeEvent<{value: unknown}>) => void;
    status: EAppointmentStatus | '' | unknown;
    scheduler: TScheduler|null;
    serviceBook: TServiceBook|null;
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
    const {schedulerList, serviceBookList} = useSelector((state: RootState) => state.appointments)
    const [isOpen, setOpen] = useState<boolean>(false);
    const classes = useStyles()
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceBookList(selectedSC.id))
            dispatch(loadSchedulerList(selectedSC.id))
        }
    }, [selectedSC])

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
                        value={scheduler?.id ?? null}
                        input={
                            <TextField label='Shceduler'/>
                        }
                    >
                        <MenuItem value=''>-</MenuItem>
                        {schedulerList.map(scheduler => {
                            return <MenuItem key={scheduler.id} value={scheduler.id}>{scheduler.fullName}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        placeholder='Service Book'
                        onChange={handleSelectServiceBook}
                        value={serviceBook?.id ?? null}
                        input={
                            <TextField label='Service Book'/>
                        }
                    >
                        <MenuItem value=''>-</MenuItem>
                        {serviceBookList.map(serviceBook => {
                            return <MenuItem key={serviceBook.id} value={serviceBook.id}>{serviceBook.name}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AppointmentFilters;