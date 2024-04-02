import React, {useEffect, useState} from 'react';
import {Autocomplete, Grid, IconButton, Paper} from "@mui/material";
import {Clear, DateRange} from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {
    loadSchedulerList,
    loadServiceBookList,
    loadServiceConsultants
} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TScheduler, TServiceBook, TServiceConsultant} from "../../../../store/reducers/appointments/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {EReportingStatus} from "../../../../api/types";
import {CustomDatePicker} from "../../../../components/pickers/CustomDatePicker/CustomDatePicker";
import {TOption, TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useAutocompleteClasses} from "./styles";
import {initialPaging} from "../constants";
import {statusOptions} from "./constants";
import {TAppointmentFilterProps} from "./types";

export const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
                                                                          status,
                                                                          selectedDate,
                                                                          setFilters,
                                                                          scheduler,
                                                                          serviceBook,
                                                                          advisor,
                                                                          technician
                                                                      }) => {
    const {schedulerList,
        serviceBookList,
        isLoading,
        serviceAdvisors,
        technicians} = useSelector((state: RootState) => state.appointments)
    const [isOpen, setOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<TOption[]>([])
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const { classes: autocompleteClasses } = useAutocompleteClasses();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceBookList(selectedSC.id))
            dispatch(loadSchedulerList(selectedSC.id))
            dispatch(loadServiceConsultants(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        setSelectedStatus(statusOptions.filter(el => status.includes(+el.value)))
    }, [status])

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

    const onSchedulerChange = (e: React.SyntheticEvent, value: TScheduler|null) => {
        setFilters(prev => ({...prev, scheduler: value, pageData: initialPaging}))
    }

    const onServiceBookChange = (e: React.SyntheticEvent, value: TServiceBook |null) => {
        setFilters(prev => ({...prev, serviceBook: value, pageData: initialPaging}))
    }

    const onStatusChange = (e: React.SyntheticEvent, value: TOption[]) => {
        setFilters(prev => ({...prev, reportingStatus: value.map(el => +el.value as EReportingStatus), pageData: initialPaging}))
    }

    const onAdvisorChange = (e: React.SyntheticEvent, value: TServiceConsultant|null) => {
        setFilters(prev => ({...prev, advisor: value, pageData: initialPaging}))
    }

    const onTechnicianChange = (e: React.SyntheticEvent, value: TServiceConsultant|null) => {
        setFilters(prev => ({...prev, technician: value, pageData: initialPaging}))
    }

    return (
        <Paper variant="outlined" style={{
            borderRadius: 0, marginBottom: 18, padding: 18, width: '100%'
        }}>
            <Grid container spacing={2} justifyContent="space-between" alignItems='flex-start'>
                <Grid item xs={6} key="datepicker">
                    <CustomDatePicker
                        onOpen={handleOpen(true)}
                        onClose={handleOpen(false)}
                        open={isOpen}
                        format="MMMM Do"
                        fullWidth
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
                                    : <DateRange cursor="pointer" htmlColor="rgba(0, 0, 0, 0.54)"/>
                        }}
                        value={selectedDate}
                        onAccept={handleDateChange}
                    />
                </Grid>
                <Grid item xs={3} key="service advisor">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Service Advisor",
                            placeholder: 'Not selected'
                        })}
                        disabled={isLoading}
                        onChange={onAdvisorChange}
                        value={advisor}
                        getOptionLabel={o => o.fullName ? `${o.fullName} - ${ o.dmsId}` : o.dmsId}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        options={serviceAdvisors}
                    />
                </Grid>
                <Grid item xs={3} key="technician">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Technician",
                            placeholder: 'Not selected'
                        })}
                        disabled={isLoading}
                        onChange={onTechnicianChange}
                        value={technician}
                        getOptionLabel={o => o.fullName ? `${o.fullName} - ${ o.dmsId}` : o.dmsId}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        options={technicians}
                    />
                </Grid>
                <Grid item xs={3} key="scheduler">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Scheduler",
                            placeholder: 'Not selected'
                        })}
                        disabled={isLoading}
                        onChange={onSchedulerChange}
                        value={scheduler}
                        getOptionLabel={o => o.fullName}
                        isOptionEqualToValue={(o, v) => o.id && v.id ? o.id === v.id : o.fullName === v.fullName}
                        options={[...schedulerList]
                        .sort((a, b) => a.fullName.localeCompare(b.fullName))}
                    />
                </Grid>
                <Grid item xs={3} key="serviceBook">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Service Book",
                            placeholder: 'Not selected'
                        })}
                        disabled={isLoading}
                        fullWidth
                        onChange={onServiceBookChange}
                        value={serviceBook}
                        getOptionLabel={o => o.name}
                        isOptionEqualToValue={(o, v) => o.id && v.id ? o.id === v.id : o.name === v.name}
                        options={[...serviceBookList]
                            .sort((a, b) => a.name.localeCompare(b.name))}
                    />
                </Grid>
                <Grid item xs={6} key="status">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Status",
                            placeholder: 'Not selected'
                        })}
                        multiple
                        disableCloseOnSelect
                        classes={autocompleteClasses}
                        disabled={isLoading}
                        onChange={onStatusChange}
                        value={selectedStatus}
                        getOptionLabel={o => o.name}
                        isOptionEqualToValue={(o, v) => o.value === v.value}
                        options={statusOptions}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};