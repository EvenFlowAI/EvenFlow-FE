import React, {useEffect, useState} from 'react';
import {Autocomplete, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup} from "@mui/material";
import {Clear, DateRange} from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {
    loadSchedulerList,
    loadServiceBookList,
    loadServiceConsultants,
    setAppointmentsLoading
} from "../../../../store/reducers/appointments/actions";
import {RootState} from "../../../../store/rootReducer";
import {TScheduler, TServiceBook, TServiceConsultant} from "../../../../store/reducers/appointments/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {EReportingStatus} from "../../../../api/types";
import {CustomDatePicker} from "../../../../components/pickers/CustomDatePicker/CustomDatePicker";
import {TOption, TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {RadioBlock, RadioGroupLabel, useAutocompleteClasses} from "./styles";
import {statusOptions} from "./constants";
import {TAppointmentFilterProps} from "./types";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {useException} from "../../../../hooks/useException/useException";
import {EDate} from "../types";

export const AppointmentFilters: React.FC<TAppointmentFilterProps> = ({
                                                                          status,
                                                                          dateFrom,
                                                                          dateTo,
                                                                          setFilters,
                                                                          scheduler,
                                                                          serviceBook,
                                                                          advisor,
                                                                          technician,
                                                                          dateRangeType,
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
            if (field === "dateFrom" && (dayjs(date).isAfter(prev.dateTo) || !prev.dateTo)) {
                return {...prev, [field]: dayjs(date), dateTo: dayjs(date).add(1, 'month'), pageData: {...prev.pageData, pageIndex: 0}}
            } else if (field === "dateTo" && (dayjs(date).isBefore(prev.dateFrom) || !prev.dateFrom)) {
                return {...prev, [field]: dayjs(date), dateFrom: dayjs(date).subtract(1, 'month'), pageData: {...prev.pageData, pageIndex: 0}}
            } else {
                return {...prev, [field]: dayjs(date), pageData: {...prev.pageData, pageIndex: 0}}
            }
        })
    }

    const handleClear = (e: any, field: "dateFrom"|"dateTo") => {
        e.stopPropagation();
        setFilters(prev => {
            return {...prev, [field]: null, pageData: {...prev.pageData, pageIndex: 0}}
        })
    }

    const onSchedulerChange = (e: React.SyntheticEvent, value: TScheduler|null) => {
        setFilters(prev => ({...prev, scheduler: value, pageData: {...prev.pageData, pageIndex: 0}}))
    }

    const onServiceBookChange = (e: React.SyntheticEvent, value: TServiceBook |null) => {
        setFilters(prev => ({...prev, serviceBook: value, pageData: {...prev.pageData, pageIndex: 0}}))
    }

    const onStatusChange = (e: React.SyntheticEvent, value: TOption[]) => {
        setFilters(prev => ({...prev, reportingStatus: value.map(el => +el.value as EReportingStatus), pageData: {...prev.pageData, pageIndex: 0}}))
    }

    const onAdvisorChange = (e: React.SyntheticEvent, value: TServiceConsultant|null) => {
        setFilters(prev => ({...prev, advisor: value, pageData: {...prev.pageData, pageIndex: 0}}))
    }

    const onTechnicianChange = (e: React.SyntheticEvent, value: TServiceConsultant|null) => {
        setFilters(prev => ({...prev, technician: value, pageData: {...prev.pageData, pageIndex: 0}}))
    }

    const handleType = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setFilters(prev => ({
            ...prev,
            dateRangeFilterBy: value === "AppointmentDate" ? EDate.AppointmentDate : EDate.CreatedDate,
            pageData: {...prev.pageData, pageIndex: 0}
        }))
    }

    return (
        <Paper variant="outlined" style={{
            borderRadius: 0, marginBottom: 18, padding: 18, width: '100%'
        }}>
            <RadioBlock>
                <RadioGroupLabel>Date Search:</RadioGroupLabel>
                <RadioGroup
                    row
                    aria-label="countType"
                    name="countType"
                    value={dateRangeType === EDate.AppointmentDate ? 'AppointmentDate' : 'CreatedDate'}
                    onChange={handleType}
                >
                    <FormControlLabel
                        value={"CreatedDate"}
                        control={<Radio color="primary"/>}
                        label="Created Date"
                    />
                    <FormControlLabel
                        value={"AppointmentDate"}
                        control={<Radio color="primary"/>}
                        label="Appointment Date"
                    />
                </RadioGroup>
            </RadioBlock>
            <Grid container spacing={2} justifyContent="space-between" alignItems='flex-start'>
                <Grid item xs={12} sm={3} key="datepickerFrom">
                    <CustomDatePicker
                        onOpen={handleOpenFrom(true)}
                        onClose={handleOpenFrom(false)}
                        open={isOpenFrom}
                        format="MMMM Do"
                        fullWidth
                        maxDate={dateTo}
                        required
                        label="Date From"
                        InputProps={{
                            placeholder: "Not selected",
                            disabled: isLoading,
                            fullWidth: true,
                            error: !dateFrom,
                            endAdornment:
                                dateFrom
                                    ? (<IconButton onClick={(e) => handleClear(e, "dateFrom")} size="large">
                                        <Clear />
                                    </IconButton>)
                                    : <DateRange cursor="pointer" htmlColor={!dateFrom ? "#FF0000" : "rgba(0, 0, 0, 0.54)"}/>
                        }}
                        value={dateFrom}
                        onAccept={handleDateChange("dateFrom")}
                    />
                </Grid>
                <Grid item xs={12} sm={3} key="datepickerTo">
                    <CustomDatePicker
                        onOpen={handleOpenTo(true)}
                        onClose={handleOpenTo(false)}
                        open={isOpenTo}
                        minDate={dateFrom}
                        required
                        format="MMMM Do"
                        fullWidth
                        shouldDisableDate={day => dayjs(day).isBefore(dateFrom)}
                        label="Date To"
                        InputProps={{
                            placeholder: "Not selected",
                            disabled: isLoading,
                            fullWidth: true,
                            error: !dateTo,
                            endAdornment:
                                dateTo
                                    ? (<IconButton onClick={(e) => handleClear(e, "dateTo")} size="large">
                                        <Clear />
                                    </IconButton>)
                                    : <DateRange cursor="pointer" htmlColor={!dateTo ? "#FF0000" : "rgba(0, 0, 0, 0.54)"}/>
                        }}
                        value={dateTo}
                        onAccept={handleDateChange('dateTo')}
                    />
                </Grid>
                <Grid item xs={12} sm={3} key="service advisor">
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
                <Grid item xs={12} sm={3} key="technician">
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
                <Grid item xs={12} sm={3} key="scheduler">
                    <Autocomplete
                        renderInput={autocompleteRender({
                            label: "Scheduler",
                            placeholder: 'Not selected'
                        })}
                        disabled={isLoading}
                        onChange={onSchedulerChange}
                        value={scheduler}
                        getOptionKey={o => o.id ? o.id : o.fullName + new Date()}
                        getOptionLabel={o => o.fullName}
                        isOptionEqualToValue={(o, v) => o.id && v.id ? o.id === v.id : o.fullName === v.fullName}
                        options={[...schedulerList]
                            .sort((a, b) => a.fullName.localeCompare(b.fullName))}
                    />
                </Grid>
                <Grid item xs={12} sm={3} key="serviceBook">
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
                <Grid item xs={12} sm={6} key="status">
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