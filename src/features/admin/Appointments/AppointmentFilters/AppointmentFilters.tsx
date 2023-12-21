import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Grid, MenuItem, Paper, Select, IconButton} from "@material-ui/core";
import {Clear} from '@material-ui/icons';
import {TextField} from "../../../../components/FormControls/TextFieldStyled/TextField";
import {EAppointmentStatus} from "../../../../api/types";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {loadSchedulerList, loadServiceBookList} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TScheduler, TServiceBook} from "../../../../store/reducers/appointments/types";
import {ReactComponent as CalendarIcon} from '../../../../assets/img/calendar_blue.svg';
import {TFilters} from "../types";
import {initialPaging} from "../Appointments";
import {useStyles, EmptyMenuItem} from "./styles";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TAppointmentFilterProps = {
    status: EAppointmentStatus | '' | unknown;
    scheduler: TScheduler|null;
    serviceBook: TServiceBook|null;
    selectedDate: moment.Moment | null;
    setFilters: Dispatch<SetStateAction<TFilters>>;
}

export const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
                                                                          status,
                                                                          selectedDate,
                                                                          setFilters,
                                                                          scheduler,
                                                                          serviceBook,
                                                               }) => {
    const {schedulerList, serviceBookList, isLoading} = useSelector((state: RootState) => state.appointments)
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

    const onChange = (date: moment.Moment | null): void => {
        setFilters(prev => ({...prev, date, pageData: initialPaging}))
    }

    const handleDateChange = (date: MaterialUiPickersDate) => {
        onChange(moment(date));
    }

    const handleClear = (e: any) => {
        e.stopPropagation();
        onChange(null);
    }

    const handleSelectStatus = (e: React.ChangeEvent<{value: unknown}>) => {
        setFilters(prev => ({...prev, status: e.target.value, pageData: initialPaging}))
    }

    const handleSelectServiceBook = (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value) {
            const selected = serviceBookList.find(item => item.id === e.target.value || item.name === e.target.value)
            setFilters(prev => ({...prev, serviceBook: selected ?? null, pageData: initialPaging}))
        } else {
            setFilters(prev => ({...prev, serviceBook: null, pageData: initialPaging}))
        }
    }

    const handleSelectScheduler = (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value) {
            const selected = schedulerList.find(item => item.id
                ? item.id.toString() === e.target.value
                : item.fullName === e.target.value)
            setFilters(prev => ({...prev, scheduler: selected ?? null, pageData: initialPaging}))
        } else {
            setFilters(prev => ({...prev, scheduler: null, pageData: initialPaging}))
        }
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
                        disabled={isLoading}
                        InputProps={{
                            label: "Date",
                            placeholder: "Select date",
                            endAdornment:
                                selectedDate
                                    ? (<IconButton onClick={(e) => handleClear(e)}>
                                    <Clear />
                                </IconButton>)
                                    : <CalendarIcon/> }}
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        displayEmpty
                        disabled={isLoading}
                        style={{color: status ? "inherit" : '#858585'}}
                        onChange={handleSelectStatus}
                        value={status}
                        input={
                            <TextField label='Status'/>
                        }
                    >
                        <EmptyMenuItem value=''>Not selected</EmptyMenuItem>
                        {Object.keys(EAppointmentStatus).filter(item => Number.isNaN(+item)).map(status => {
                            return <MenuItem key={status} value={status}>{status}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        displayEmpty
                        disabled={isLoading}
                        style={{color: scheduler ? "inherit" : '#858585'}}
                        onChange={handleSelectScheduler}
                        value={scheduler?.id ?? scheduler?.fullName ?? ''}
                        input={
                            <TextField label='Scheduler'/>
                        }
                    >
                        <EmptyMenuItem value=''>Not selected</EmptyMenuItem>
                        {[...schedulerList]
                            .sort((a, b) => a.fullName.localeCompare(b.fullName))
                            .map(scheduler => {
                            return <MenuItem key={scheduler?.id ?? scheduler?.fullName} value={scheduler.id ?? scheduler?.fullName}>{scheduler?.fullName ?? ''}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        fullWidth
                        displayEmpty
                        disabled={isLoading}
                        style={{color: serviceBook ? "inherit" : '#858585'}}
                        onChange={handleSelectServiceBook}
                        value={serviceBook?.id ?? serviceBook?.name ?? ''}
                        input={
                            <TextField label='Service Book' />
                        }
                    >
                        <EmptyMenuItem value=''>Not selected</EmptyMenuItem>
                        {[...serviceBookList]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(serviceBook => {
                            return <MenuItem key={serviceBook.id} value={serviceBook.id ?? serviceBook.name}>{serviceBook.name}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Paper>
    );
};