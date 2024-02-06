import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Grid, MenuItem, Paper, Select, IconButton, SelectChangeEvent} from "@mui/material";
import {Clear, DateRange} from '@mui/icons-material';
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useDispatch, useSelector} from "react-redux";
import {loadSchedulerList, loadServiceBookList} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TScheduler, TServiceBook} from "../../../../store/reducers/appointments/types";
import {TFilters} from "../types";
import {initialPaging} from "../Appointments";
import {EmptyMenuItem} from "./styles";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {EReportingStatus, reportingStatuses} from "../../../../api/types";
import {CustomDatePicker} from "../../../../components/pickers/CustomDatePicker/CustomDatePicker";
import {TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";

type TAppointmentFilterProps = {
    status: EReportingStatus | '' | unknown;
    scheduler: TScheduler|null;
    serviceBook: TServiceBook|null;
    selectedDate: TParsableDate;
    setFilters: Dispatch<SetStateAction<TFilters>>;
}

export const AppointmentFilters: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAppointmentFilterProps>>> = ({
                                                                          status,
                                                                          selectedDate,
                                                                          setFilters,
                                                                          scheduler,
                                                                          serviceBook,
                                                               }) => {
    const {schedulerList, serviceBookList, isLoading} = useSelector((state: RootState) => state.appointments)
    const [isOpen, setOpen] = useState<boolean>(false);
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

    const onChange = (date: TParsableDate): void => {
        setFilters(prev => ({...prev, date, pageData: initialPaging}))
    }

    const handleDateChange = (date: TParsableDate) => {
        onChange(dayjs(date));
    }

    const handleClear = (e: any) => {
        e.stopPropagation();
        onChange(null);
    }

    const handleSelectStatus = (e: SelectChangeEvent<string | number | unknown>) => {
        setFilters(prev => ({...prev, reportingStatus: e.target.value, pageData: initialPaging}))
    }

    const handleSelectServiceBook = (e: SelectChangeEvent<string | number>) => {
        if (e.target.value) {
            const selected = serviceBookList.find(item => item.id === e.target.value || item.name === e.target.value)
            setFilters(prev => ({...prev, serviceBook: selected ?? null, pageData: initialPaging}))
        } else {
            setFilters(prev => ({...prev, serviceBook: null, pageData: initialPaging}))
        }
    }

    const handleSelectScheduler = (e: SelectChangeEvent<string | number>) => {
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
            <Grid container spacing={2} justifyContent="space-between" alignItems='flex-end'>
                <Grid item xs={3} key="datepicker">
                    <CustomDatePicker
                        onOpen={handleOpen(true)}
                        onClose={handleOpen(false)}
                        open={isOpen}
                        format="MMMM, DD"
                        label="Date"
                        InputProps={{
                            placeholder: "Select date",
                            disabled: isLoading,
                            fullWidth: true,
                            endAdornment:
                                selectedDate
                                    ? (<IconButton onClick={(e) => handleClear(e)} size="large">
                                        <Clear />
                                    </IconButton>)
                                    : <DateRange cursor="pointer" color="disabled"/>
                        }}
                        value={selectedDate}
                        onAccept={handleDateChange}
                    />
                </Grid>
                <Grid item xs={3} key="status">
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
                        {Object.entries(reportingStatuses).map(([number, status]) => {
                            return <MenuItem key={number} value={number}>{status}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={3} key="scheduler">
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
                <Grid item xs={3} key="serviceBook">
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
                            .map((serviceBook, index) => {
                            return <MenuItem key={`${serviceBook.id} ${index}`} value={serviceBook.id ?? serviceBook.name}>{serviceBook.name}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Grid>
        </Paper>
    );
};