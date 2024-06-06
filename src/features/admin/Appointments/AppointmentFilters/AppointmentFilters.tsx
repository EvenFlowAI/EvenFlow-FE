import React, {useEffect, useState} from 'react';
import {Autocomplete, Grid, IconButton, Paper} from "@mui/material";
import {Clear, DateRange} from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {
    loadSchedulerList,
    loadServiceBookList,
    loadServiceConsultants, setAppointmentsLoading
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
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {useException} from "../../../../hooks/useException/useException";

export const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
                                                                          status,
                                                                          dateFrom,
                                                                          dateTo,
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
    const [isOpenFrom, setOpenFrom] = useState<boolean>(false);
    const [isOpenTo, setOpenTo] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<TOption[]>([])
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const showError = useException();
    const { classes: autocompleteClasses } = useAutocompleteClasses();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceBookList(selectedSC.id))
            dispatch(loadSchedulerList())
            dispatch(loadServiceConsultants(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (currentUser) {
            if (currentUser?.role === "Advisor" && serviceAdvisors.length) {
                if (!currentUser.dmsId) {
                    showError("The user does not have DMS ID assigned")
                } else {
                    const currentAdvisor = serviceAdvisors.find(el => el.dmsId.toString() === currentUser.dmsId);
                    if (currentAdvisor) {
                        dispatch(setAppointmentsLoading(true))
                        setFilters(prev => ({...prev, advisor: currentAdvisor, initialFiltersSet: true}))
                    }
                }
            } else if (currentUser?.role === "Technician" && technicians.length) {
                if (!currentUser.dmsId) {
                    showError("The user does not have DMS ID assigned")
                } else {
                    const currentTechnician = technicians.find(el => el.dmsId.toString() === currentUser.dmsId);
                    if (currentTechnician) {
                        dispatch(setAppointmentsLoading(true))
                        setFilters(prev => ({...prev, technician: currentTechnician, initialFiltersSet: true}))
                    }
                }
            } else {
                setFilters(prev => ({...prev, initialFiltersSet: true}))
            }
        }
    }, [currentUser, serviceAdvisors, technicians])

    useEffect(() => {
        setSelectedStatus(statusOptions.filter(el => status.includes(+el.value)))
    }, [status])

    const handleOpenFrom = (s: boolean) => () => {
        setOpenFrom(s);
    }

    const handleOpenTo = (s: boolean) => () => {
        setOpenTo(s);
    }

    const handleDateChange = (field: "dateFrom"|"dateTo") => (date: TParsableDate) => {
        setFilters(prev => {
          if (field === "dateFrom" && dayjs(date).isAfter(prev.dateTo)) {
                return {...prev, [field]: dayjs(date), dateTo: null, pageData: initialPaging}
            } else {
                return {...prev, [field]: dayjs(date), pageData: initialPaging}
            }
        })
    }

    const handleClear = (e: any, field: "dateFrom"|"dateTo") => {
        e.stopPropagation();
        setFilters(prev => ({...prev, [field]: null, pageData: initialPaging}))
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
                <Grid item xs={3} key="datepickerFrom">
                    <CustomDatePicker
                        onOpen={handleOpenFrom(true)}
                        onClose={handleOpenFrom(false)}
                        open={isOpenFrom}
                        format="MMMM Do"
                        fullWidth
                        label="Appointment Date From"
                        InputProps={{
                            placeholder: "Not selected",
                            disabled: isLoading,
                            fullWidth: true,
                            endAdornment:
                                dateFrom
                                    ? (<IconButton onClick={(e) => handleClear(e, "dateFrom")} size="large">
                                        <Clear />
                                    </IconButton>)
                                    : <DateRange cursor="pointer" htmlColor="rgba(0, 0, 0, 0.54)"/>
                        }}
                        value={dateFrom}
                        onAccept={handleDateChange("dateFrom")}
                    />
                </Grid>
                <Grid item xs={3} key="datepickerTo">
                    <CustomDatePicker
                        onOpen={handleOpenTo(true)}
                        onClose={handleOpenTo(false)}
                        open={isOpenTo}
                        format="MMMM Do"
                        fullWidth
                        shouldDisableDate={day => dayjs(day).isBefore(dateFrom)}
                        label="Appointment Date To"
                        InputProps={{
                            placeholder: "Not selected",
                            disabled: isLoading,
                            fullWidth: true,
                            endAdornment:
                                dateTo
                                    ? (<IconButton onClick={(e) => handleClear(e, "dateTo")} size="large">
                                        <Clear />
                                    </IconButton>)
                                    : <DateRange cursor="pointer" htmlColor="rgba(0, 0, 0, 0.54)"/>
                        }}
                        value={dateTo}
                        onAccept={handleDateChange('dateTo')}
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