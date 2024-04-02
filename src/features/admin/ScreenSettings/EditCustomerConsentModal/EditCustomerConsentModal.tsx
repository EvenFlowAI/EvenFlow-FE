import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {RootState} from "../../../../store/rootReducer";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {TForm} from "./types";
import {customerTypeOptions, dayOfWeekOptions, initialForm, yearOptions} from "./constants";
import {
    createCustomerConsent,
    getCurrentConsent,
    loadConsentById,
    updateCustomerConsent
} from "../../../../store/reducers/screenSettings/actions";
import {Autocomplete, Button, Grid} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {autocompleteOptionsRender, autocompleteRender} from "../../../../utils/autocompleteRenders";
import {IMakeExtended, IModel} from "../../../../api/types";
import {TOption} from "../../PodsTable/PODModal/types";
import {EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {IPodShort} from "../../../../store/reducers/pods/types";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import TimeSelect from "../../../../components/pickers/TimeSelect/TimeSelect";
import dayjs from "dayjs";
import {timeSpanString} from "../../../../utils/constants";
import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {TTransportationShort} from "../../../../store/reducers/transportationNeeds/types";
import {TGeographicZoneShort} from "../../../../types/types";
import {Textarea} from "../../RecallsParts/AddRecallModal/styles";
import {useActionButtonsStyles} from "../../../../hooks/styling/useActionButtonsStyles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {Label, SectionTitle} from "./styles";
import {IBaseCustomerConsent, ICustomerConsentById} from "../../../../store/reducers/screenSettings/types";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {EDay} from "../../../../store/reducers/demandSegments/types";

const EditCustomerConsentModal: React.FC<DialogProps & { consentId: number|undefined }> = ({open, onClose, consentId}) => {
    const {advisorsList} = useSelector(({scEmployees}: RootState) => scEmployees);
    const {scRequestsShort: serviceRequests} = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {makesModels} = useSelector(({vehicleDetails}: RootState) => vehicleDetails);
    const {mobileZonesShort} = useSelector(({mobileService}: RootState) => mobileService);
    const {svZonesShort} = useSelector(({serviceValet}: RootState) => serviceValet);
    const {optionsShort: transportationsShort} = useSelector(({transportation}: RootState) => transportation);
    const {shortPodsList} = useSelector(({pods}: RootState) => pods);
    const {slotRange} = useSelector(({slotScoring}: RootState) => slotScoring);
    const {currentConsent, isConsentLoading, isLoading} = useSelector(({screenSettingsBooking}: RootState) => screenSettingsBooking);
    const [form, setForm] = useState<TForm>(initialForm);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const {classes} = useActionButtonsStyles();

    const startTimeError = useMemo(() => {
        return formIsChecked && (dayjs(form.appointmentTimeTo, timeSpanString).isSameOrBefore(dayjs(form.appointmentTimeFrom, timeSpanString), 'minute')
            || dayjs(form.appointmentTimeFrom, timeSpanString).isBefore(dayjs(slotRange?.start, timeSpanString), 'minute')
            || dayjs(form.appointmentTimeFrom, timeSpanString).isAfter(dayjs(slotRange?.end, timeSpanString), 'minute'))
    }, [formIsChecked, slotRange, form])
    const endTimeError = useMemo(() => {
        return formIsChecked && (dayjs(form.appointmentTimeTo, timeSpanString).isSameOrBefore(dayjs(form.appointmentTimeFrom, timeSpanString), 'minute')
            || dayjs(form.appointmentTimeTo, timeSpanString).isBefore(dayjs(slotRange?.start, timeSpanString), 'minute')
            || dayjs(form.appointmentTimeTo, timeSpanString).isAfter(dayjs(slotRange?.end, timeSpanString), 'minute'))
    }, [formIsChecked, slotRange, form])

    useEffect(() => {
        if (consentId && open) dispatch(loadConsentById(consentId))
    }, [consentId, open])

    useEffect(() => {
        if (open) {
            if (currentConsent) {
                setForm(() => {
                    const {name, title, message, isWaitlistEnabled,
                        modelYearFrom, modelYearTo, appointmentTimeFrom, appointmentTimeTo, daysOfWeek} = currentConsent
                    return {
                        name,
                        title,
                        message,
                        isWaitlistEnabled,
                        modelYearFrom,
                        modelYearTo,
                        appointmentTimeFrom,
                        appointmentTimeTo,
                        daysOfWeek: daysOfWeek ?? [],
                        makes: makesModels.filter(el => currentConsent.makeIds?.includes(el.id)),
                        models: makesModels
                            .map(el => el.models).flat(1).filter(el => currentConsent.modelIds?.includes(el.id)),
                        customerType: currentConsent.customerType ?? null,
                        serviceRequests: serviceRequests.filter(el => currentConsent.serviceRequestIds?.includes(el.id)),
                        advisors: advisorsList.filter(el => currentConsent.advisorIds?.includes(el.id)),
                        transportationOptions: transportationsShort.filter(el => currentConsent.transportationOptionIds?.includes(el.id)),
                        mobileServiceZones: mobileZonesShort.filter(el => currentConsent.mobileServiceZoneIds?.includes(el.id)),
                        serviceValetZones: svZonesShort.filter(el => currentConsent.serviceValetZoneIds?.includes(el.id)),
                        serviceBooks: shortPodsList.filter(el => currentConsent.serviceBookIds?.includes(el.id)),
                    }
                })
            }
        }
    }, [open, currentConsent, makesModels, serviceRequests, advisorsList,
        transportationsShort, mobileZonesShort, svZonesShort, shortPodsList])

    const onCancel = () => {
        dispatch(getCurrentConsent(null))
        setForm(initialForm)
        setFormIsChecked(false);
        onClose()
    }

    const checkIsValid = () => {
        let isValid = Boolean(form.message.length && form.name.length && form.title.length);
        if (form.modelYearFrom && form.modelYearTo && form.modelYearFrom > form.modelYearTo) {
            isValid = false;
            showError('"Year To" should be more than "Year From"')
        }
        if (form.modelYearFrom && !form.modelYearTo) {
            isValid = false;
            showError('"Year To" must not be empty. Either select "Year To" or remove "Year From" value')
        }
        if (form.modelYearTo && !form.modelYearFrom) {
            isValid = false;
            showError('"Year From" must not be empty. Either select "Year From" or remove "Year To" value')
        }
        if (form.serviceValetZones.length && form.mobileServiceZones.length) {
            isValid = false;
            showError('"Service Valet Zones" cannot be configured with "Mobile Service Zones"')
        }
        if (startTimeError || endTimeError) {
            isValid = false;
            showError('"Appointment Time To" must be later than "Appointment Time From" and both must be inside of the Hours Of Operations')
        }
        if (form.mobileServiceZones.length) {
            if (form.advisors.length) {
                isValid = false;
                showError('"Service Advisors" cannot be configured with "Mobile Service Zones"')
            }
            if (form.transportationOptions.length) {
                isValid = false;
                showError('"Transportation Options" cannot be configured with "Mobile Service Zones"')
            }
        }
        return isValid;
    }

    const onSave = () => {
        setFormIsChecked(true)
        if (checkIsValid() && selectedSC) {
            const data: IBaseCustomerConsent = {
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id ?? null,
                name: form.name,
                title: form.title,
                makeIds: form.makes.map(({id}) => id),
                modelIds: form.models.map(({id}) => id),
                modelYearFrom: form.modelYearFrom ?? null,
                modelYearTo: form.modelYearTo ?? null,
                customerType: form.customerType ?? null,
                serviceRequestIds: form.serviceRequests.map(({id}) => id),
                serviceBookIds: form.serviceBooks.map(({id}) => id),
                appointmentTimeFrom: form.appointmentTimeFrom ?? '',
                appointmentTimeTo: form.appointmentTimeTo ?? '',
                daysOfWeek: form.daysOfWeek,
                advisorIds: form.advisors.map(({id}) => id),
                transportationOptionIds: form.transportationOptions.map(({id}) => id),
                mobileServiceZoneIds: form.mobileServiceZones.map(({id}) => id),
                serviceValetZoneIds: form.serviceValetZones.map(({id}) => id),
                isWaitlistEnabled: form.isWaitlistEnabled,
                message: form.message,
            }
            if (currentConsent) {
                const updateData: ICustomerConsentById = {...data, id: currentConsent.id}
                dispatch(updateCustomerConsent(updateData, showError, onCancel))
            } else {
                dispatch(createCustomerConsent(data, showError, onCancel))
            }
        }
    }

    const getSortedMakes = () => {
        return [...makesModels]
            .sort((a, b) => form.makes
                .find(make => make.id === a.id) ? form.makes.find(make => make.id === b.id) ? 0 : -1 : 1);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false)
        setForm({...form, [e.target.name]: e.target.value});
    }

    const onMakeChange = useCallback((e: ChangeEvent<{}>, value: IMakeExtended[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, makes: value}));
        setModelsOptions(value.map(make => make.models).flat());
        setForm(prev => ({
            ...prev,
            models: prev.models.filter(item => value.find(make => make.models.find(model => model.id === item.id)))
        }));
    }, [])

    const getSortedModels = () => {
        return modelsOptions.sort((a, b) => form.models.find(model => model.id === a.id)
            ? form.models.find(model => model.id === b.id)
                ? 0
                : -1
            : 1);
    }

    const onModelChange = useCallback((e: ChangeEvent<{}>, value: IModel[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, models: value}));
    }, [])

    const onAutocompleteChange = (name: keyof TForm) => (e: ChangeEvent<{}>, value: string|null) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, [name]: value ? +value : null}))
    }

    const onCustomerTypeChange = (e: ChangeEvent<{}>, value: TOption|null) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, customerType: value ? value.value as EUserType : null}))
    }

    const onServiceBooksChange = (e: ChangeEvent<{}>, value: IPodShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, serviceBooks: value}))
    }

    const onServiceRequestsChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequestShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, serviceRequests: value}))
    }

    const onAppointmentTimeChange = (value: string|undefined, field: keyof TForm) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, [field]: value}))
    }

    const onDayOfWeekChange = (e: ChangeEvent<{}>, value: TOption[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, daysOfWeek: value.map(({value}) => value as EDay)}))
    }

    const onAdvisorsChange = (e: ChangeEvent<{}>, value: IAdvisorShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, advisors: value}))
    }

    const onTransportationsChange = (e: ChangeEvent<{}>, value: TTransportationShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, transportationOptions: value}))
    }

    const onMobileZonesChange = (e: ChangeEvent<{}>, value: TGeographicZoneShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, mobileServiceZones: value}))
    }

    const onSvZonesChange = (e: ChangeEvent<{}>, value: TGeographicZoneShort[]) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, serviceValetZones: value}))
    }

    const onWaitListChange = (e: ChangeEvent<{}>, value: string|null) => {
        setFormIsChecked(false)
        setForm(prev => ({...prev, isWaitlistEnabled: value === "Yes"}))
    }

    const onMessageChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({target: {value}}) => {
        setFormIsChecked(false);
        setForm(prev => ({...prev, message: value}))
    }

    return (
        <BaseModal open={open} width={940} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {consentId ? "Edit" : "Add"} Customer Consent
            </DialogTitle>
            <DialogContent>
                {isConsentLoading || isLoading
                    ? <Loading/>
                    : <>
                    <Grid container spacing={3} style={{marginBottom: 36}}>
                        <Grid item xs={12}><SectionTitle>Consent</SectionTitle></Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="name"
                                name="name"
                                label="Consent Name"
                                placeholder="Name"
                                required
                                fullWidth
                                error={formIsChecked && !form.name.length}
                                onChange={handleChange}
                                value={form.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="title"
                                name="title"
                                required
                                label="Booking Flow Consent Title"
                                error={formIsChecked && !form.title.length}
                                placeholder="Title"
                                fullWidth
                                onChange={handleChange}
                                value={form.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                fullWidth
                                multiline
                                style={{ marginBottom: 10 }}
                                required
                                error={formIsChecked && !form.message.length}
                                placeholder="Enter Error Message"
                                label="Consent Message"
                                onChange={onMessageChange}
                                value={form.message}
                                rows={3}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} style={{marginBottom: 36}}>
                        <Grid item xs={12}><SectionTitle>Appointment Request</SectionTitle></Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={serviceRequests}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={form.serviceRequests}
                                getOptionLabel={i => i.code}
                                onChange={onServiceRequestsChange}
                                renderOption={autocompleteOptionsRender((e) => e.code)}
                                renderInput={autocompleteRender({
                                    label: "Service Requests (Ops Codes)",
                                    placeholder: 'Service Requests (Ops Codes)'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={shortPodsList}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={form.serviceBooks}
                                onChange={onServiceBooksChange}
                                renderOption={autocompleteOptionsRender((e) => e.name)}
                                getOptionLabel={i => i.name}
                                renderInput={autocompleteRender({
                                    label: "PODs (Service Books) Assignment",
                                    placeholder: "PODs (Service Books) Assignment",
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={advisorsList}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={form.advisors}
                                renderOption={autocompleteOptionsRender(i => `${i.firstName} ${i.lastName}`)}
                                getOptionLabel={i => `${i.firstName} ${i.lastName}`}
                                onChange={onAdvisorsChange}
                                renderInput={autocompleteRender({
                                    label: "Advisors Selection",
                                    placeholder: 'Advisors Selection',
                                    error: formIsChecked && !!form.advisors.length && !!form.mobileServiceZones.length
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={transportationsShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={form.transportationOptions}
                                renderOption={autocompleteOptionsRender(i => i.name)}
                                getOptionLabel={i => i.name}
                                onChange={onTransportationsChange}
                                renderInput={autocompleteRender({
                                    label: "Transportation Options",
                                    placeholder: 'Transportation Options',
                                    error: formIsChecked && !!form.transportationOptions.length && !!form.mobileServiceZones.length
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={svZonesShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                renderOption={autocompleteOptionsRender(i => i.name)}
                                getOptionLabel={i => i.name}
                                value={form.serviceValetZones}
                                onChange={onSvZonesChange}
                                renderInput={autocompleteRender({
                                    label: "Service Valet Zones",
                                    placeholder: 'Select Service Valet Zones',
                                    error: formIsChecked && !!form.mobileServiceZones.length && !!form.serviceValetZones.length
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={mobileZonesShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                renderOption={autocompleteOptionsRender(i => i.name)}
                                value={form.mobileServiceZones}
                                getOptionLabel={i => i.name}
                                onChange={onMobileZonesChange}
                                renderInput={autocompleteRender({
                                    label: "Mobile Service Zones",
                                    placeholder: 'Select Mobile Service Zones',
                                    error: formIsChecked && !!form.mobileServiceZones.length && !!form.serviceValetZones.length
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={['Yes', 'No']}
                                isOptionEqualToValue={(o, v) => o === v}
                                getOptionLabel={i => i}
                                value={form.isWaitlistEnabled ? "Yes" : "No"}
                                onChange={onWaitListChange}
                                renderInput={autocompleteRender({
                                    label: "Waitlist Appointment",
                                    placeholder: 'Waitlist Appointment',
                                    error: formIsChecked && form.isWaitlistEnabled
                                        && (!!form.serviceValetZones.length || !!form.mobileServiceZones.length)
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} style={{marginBottom: 36}}>
                        <Grid item xs={12}><SectionTitle>Customer & Vehicle</SectionTitle></Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                options={customerTypeOptions}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                getOptionLabel={i => i.name}
                                value={customerTypeOptions.find(el => el.value as EUserType === form.customerType) ?? null}
                                onChange={onCustomerTypeChange}
                                renderInput={autocompleteRender({
                                    label: "Customer Type (New, Existing)",
                                    placeholder: "Customer Type (New, Existing)",
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                style={{ marginBottom: 10 }}
                                options={yearOptions}
                                isOptionEqualToValue={(option, value) => option === value}
                                value={form.modelYearFrom?.toString() ?? ''}
                                onChange={onAutocompleteChange("modelYearFrom")}
                                renderInput={autocompleteRender({
                                    label: 'Vehicle Year From',
                                    placeholder: 'Vehicle Year From',
                                    error: formIsChecked
                                        && ((!!form.modelYearFrom && !!form.modelYearTo && (form.modelYearFrom > form.modelYearTo))
                                            || (!!form.modelYearTo && !form.modelYearFrom))
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                style={{ marginBottom: 10 }}
                                options={yearOptions}
                                isOptionEqualToValue={(option, value) => option === value}
                                value={form.modelYearTo?.toString() ?? ''}
                                onChange={onAutocompleteChange("modelYearTo")}
                                renderInput={autocompleteRender({
                                    label: 'Vehicle Year To',
                                    placeholder: 'Vehicle Year To',
                                    error: formIsChecked
                                        && ((!!form.modelYearFrom && !!form.modelYearTo && (form.modelYearFrom > form.modelYearTo))
                                            || (!!form.modelYearFrom && !form.modelYearTo))
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                multiple
                                style={{ marginBottom: 10 }}
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                options={getSortedMakes()}
                                disableCloseOnSelect
                                getOptionLabel={i => i.name}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                renderOption={autocompleteOptionsRender((e) => e.name)}
                                value={form.makes}
                                onChange={onMakeChange}
                                renderInput={autocompleteRender({
                                    label: "Vehicle Makes",
                                    placeholder: 'Vehicle Makes'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                style={{ marginBottom: 10 }}
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                options={getSortedModels()}
                                disableCloseOnSelect
                                getOptionLabel={i => i.name}
                                renderOption={autocompleteOptionsRender((e) => e.name)}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                value={form.models}
                                onChange={onModelChange}
                                renderInput={autocompleteRender({
                                    label: "Vehicle Models",
                                    placeholder: 'Vehicle Models'
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} style={{marginBottom: 36}}>
                        <Grid item xs={12}><SectionTitle>Time Factor</SectionTitle></Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                ChipProps={{
                                    color: "primary",
                                    style: {borderRadius: 4},
                                    size: "small"
                                }}
                                disableCloseOnSelect
                                options={dayOfWeekOptions}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                renderOption={autocompleteOptionsRender((e) => e.name)}
                                value={dayOfWeekOptions.filter(el => form.daysOfWeek.includes(el.value as EDay))}
                                onChange={onDayOfWeekChange}
                                getOptionLabel={i => i.name}
                                renderInput={autocompleteRender({
                                    label: "Appointment Days Of Week",
                                    placeholder: 'Select Appointment Days Of Week'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label>Appointment Time Of Day From</Label>
                            <TimeSelect
                                disableClearable={false}
                                width={"100%"}
                                error={startTimeError}
                                gap={60}
                                start={slotRange?.start ?? ""}
                                end={slotRange?.end ?? ""}
                                value={form.appointmentTimeFrom}
                                onChange={(value) => onAppointmentTimeChange(value, "appointmentTimeFrom")}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label>Appointment Time Of Day To</Label>
                            <TimeSelect
                                disableClearable={false}
                                width={"100%"}
                                error={endTimeError}
                                gap={60}
                                start={slotRange?.start ?? ""}
                                end={slotRange?.end ?? ""}
                                value={form.appointmentTimeTo}
                                onChange={(value) => onAppointmentTimeChange(value, "appointmentTimeTo")}/>
                        </Grid>
                    </Grid>
                </>}
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </Button>
                        <LoadingButton
                            loading={isConsentLoading || isLoading}
                            onClick={onSave}
                            disabled={!form.message.length || !form.name.length || !form.title.length}
                            className={classes.saveButton}>
                            Save
                        </LoadingButton>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default EditCustomerConsentModal;