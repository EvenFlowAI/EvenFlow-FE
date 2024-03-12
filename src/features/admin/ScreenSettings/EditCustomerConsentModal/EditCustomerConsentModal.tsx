import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {RootState} from "../../../../store/rootReducer";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {TForm} from "./types";
import {customerTypeOptions, dayOfWeekOptions, initialForm, yearOptions} from "./constants";
import {loadConsentById} from "../../../../store/reducers/screenSettings/actions";
import {Autocomplete, Grid} from "@mui/material";
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
import {EDayOfWeek} from "../../../../store/reducers/offers/types";
import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {TTransportationShort} from "../../../../store/reducers/transportationNeeds/types";
import {TGeographicZoneShort} from "../../../../types/types";
import {Textarea} from "../../RecallsParts/AddRecallModal/styles";
import {useActionButtonsStyles} from "../../../../hooks/styling/useActionButtonsStyles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {Label} from "./styles";

const EditCustomerConsentModal: React.FC<DialogProps & { consentId: number|undefined }> = ({open, onClose, consentId}) => {
    const {advisorsList} = useSelector(({scEmployees}: RootState) => scEmployees);
    const {scRequestsShort: serviceRequests} = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {makesModels} = useSelector(({vehicleDetails}: RootState) => vehicleDetails);
    const {mobileZonesShort} = useSelector(({mobileService}: RootState) => mobileService);
    const {svZonesShort} = useSelector(({serviceValet}: RootState) => serviceValet);
    const {optionsShort: transportationsShort} = useSelector(({transportation}: RootState) => transportation);
    const {shortPodsList} = useSelector(({pods}: RootState) => pods);
    const {slotRange} = useSelector(({slotScoring}: RootState) => slotScoring);
    const {currentConsent, isConsentLoading} = useSelector(({screenSettingsBooking}: RootState) => screenSettingsBooking);
    const [form, setForm] = useState<TForm>(initialForm);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {classes} = useActionButtonsStyles();
    // todo loading
    const loading = false;

    useEffect(() => {
        if (consentId && open) dispatch(loadConsentById(consentId))
    }, [consentId, open])

    useEffect(() => {
        if (open && currentConsent) {
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
                    daysOfWeek,
                    makes: makesModels.filter(el => currentConsent.makeIds.includes(el.id)),
                    models: makesModels
                        .map(el => el.models).flat(1).filter(el => currentConsent.modelIds.includes(el.id)),
                    customerType: currentConsent.customerType ?? null,
                    serviceRequests: serviceRequests.filter(el => currentConsent.serviceRequestIds.includes(el.id)),
                    advisors: advisorsList.filter(el => currentConsent.advisorIds.includes(el.id)),
                    transportationOptions: transportationsShort.filter(el => currentConsent.transportationOptionIds.includes(el.id)),
                    mobileServiceZones: mobileZonesShort.filter(el => currentConsent.mobileServiceZoneIds.includes(el.id)),
                    serviceValetZones: svZonesShort.filter(el => currentConsent.serviceValetZoneIds.includes(el.id)),
                    serviceBooks: shortPodsList.filter(el => currentConsent.serviceBookIds.includes(el.id)),
                }
            })
        }
    }, [currentConsent, open])

    const onCancel = () => {
        onClose()
    }

    const checkIsValid = () => {
        let isValid = Boolean(form.message.length && form.name.length && form.title.length);
        if (form.modelYearFrom && form.modelYearTo && form.modelYearFrom > form.modelYearTo) {
            isValid = false;
            showError('"Year To" should be more than "Year From"')
        }
        return isValid;
    }

    const onSave = () => {
        if (checkIsValid()) {

        }
    }

    const getSortedMakes = () => {
        return [...makesModels]
            .sort((a, b) => form.makes
                .find(make => make.id === a.id) ? form.makes.find(make => make.id === b.id) ? 0 : -1 : 1);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const onMakeChange = useCallback((e: ChangeEvent<{}>, value: IMakeExtended[]) => {
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
        setForm(prev => ({...prev, models: value}));
    }, [])

    const onAutocompleteChange = (name: keyof TForm) => (e: ChangeEvent<{}>, value: string|null) => {
        setForm(prev => ({...prev, [name]: value ? +value : null}))
    }

    const onCustomerTypeChange = (e: ChangeEvent<{}>, value: TOption|null) => {
        setForm(prev => ({...prev, customerType: value ? value.value as EUserType : null}))
    }

    const onServiceBooksChange = (e: ChangeEvent<{}>, value: IPodShort[]) => {
        setForm(prev => ({...prev, serviceBooks: value}))
    }

    const onServiceRequestsChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequestShort[]) => {
        setForm(prev => ({...prev, serviceRequests: value}))
    }

    const onAppointmentTimeChange = (value: string, field: keyof TForm) => {
        setForm(prev => ({...prev, [field]: value}))
    }

    const onDayOfWeekChange = (e: ChangeEvent<{}>, value: TOption[]) => {
        setForm(prev => ({...prev, daysOfWeek: value.map(({value}) => value as EDayOfWeek)}))
    }

    const onAdvisorsChange = (e: ChangeEvent<{}>, value: IAdvisorShort[]) => {
        setForm(prev => ({...prev, advisors: value}))
    }

    const onTransportationsChange = (e: ChangeEvent<{}>, value: TTransportationShort[]) => {
        setForm(prev => ({...prev, transportationOptions: value}))
    }

    const onMobileZonesChange = (e: ChangeEvent<{}>, value: TGeographicZoneShort[]) => {
        setForm(prev => ({...prev, mobileServiceZones: value}))
    }

    const onSvZonesChange = (e: ChangeEvent<{}>, value: TGeographicZoneShort[]) => {
        setForm(prev => ({...prev, serviceValetZones: value}))
    }

    const onWaitListChange = (e: ChangeEvent<{}>, value: string|null) => {
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
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="name"
                                name="name"
                                label="Consent Name"
                                placeholder="Type Name"
                                fullWidth
                                onChange={handleChange}
                                value={form.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="title"
                                name="title"
                                label="Consent Title on Booking Flow"
                                placeholder="Type Description"
                                fullWidth
                                onChange={handleChange}
                                value={form.title}
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
                                    label: "Makes",
                                    placeholder: 'Select Makes'
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
                                    label: "Models",
                                    placeholder: 'Select Models'
                                })}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Autocomplete
                                style={{ marginBottom: 10 }}
                                options={yearOptions}
                                isOptionEqualToValue={(option, value) => option === value}
                                value={form.modelYearFrom?.toString() ?? ''}
                                onChange={onAutocompleteChange("modelYearFrom")}
                                renderInput={autocompleteRender({
                                    label: 'Year From',
                                    placeholder: 'Select Year From',
                                    error: formIsChecked && !!form.modelYearFrom && !!form.modelYearTo && (form.modelYearFrom > form.modelYearTo)
                                })}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Autocomplete
                                style={{ marginBottom: 10 }}
                                options={yearOptions}
                                isOptionEqualToValue={(option, value) => option === value}
                                value={form.modelYearFrom?.toString() ?? ''}
                                onChange={onAutocompleteChange("modelYearTo")}
                                renderInput={autocompleteRender({
                                    label: 'Year To',
                                    placeholder: 'Select Year To',
                                    error: formIsChecked && !!form.modelYearFrom && !!form.modelYearTo && (form.modelYearFrom > form.modelYearTo)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                options={customerTypeOptions}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                getOptionLabel={i => i.name}
                                value={customerTypeOptions.find(el => el.value as EUserType === form.customerType) ?? null}
                                onChange={onCustomerTypeChange}
                                renderInput={autocompleteRender({
                                    label: "Customer Type",
                                    placeholder: 'Select Customer Type'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={shortPodsList}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => i.name}
                                value={form.serviceBooks}
                                onChange={onServiceBooksChange}
                                renderInput={autocompleteRender({
                                    label: "Service Books",
                                    placeholder: 'Select Service Books'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={serviceRequests}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => i.code}
                                value={form.serviceRequests}
                                onChange={onServiceRequestsChange}
                                renderInput={autocompleteRender({
                                    label: "Service Requests",
                                    placeholder: 'Select Service Requests'
                                })}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Label>Appointment Time From</Label>
                            <TimeSelect
                                width={"100%"}
                                error={
                                    formIsChecked
                                    && (dayjs(form.appointmentTimeTo, timeSpanString).isSameOrBefore(dayjs(form.appointmentTimeFrom, timeSpanString), 'minute')
                                        || dayjs(form.appointmentTimeFrom, timeSpanString).isBefore(dayjs(slotRange?.start, timeSpanString), 'minute')
                                        || dayjs(form.appointmentTimeFrom, timeSpanString).isAfter(dayjs(slotRange?.end, timeSpanString), 'minute'))
                                }
                                gap={60}
                                start={slotRange?.start ?? ""}
                                end={slotRange?.end ?? ""}
                                value={form.appointmentTimeFrom}
                                onChange={(value) => onAppointmentTimeChange(value, "appointmentTimeFrom")}/>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Label>Appointment Time To</Label>
                            <TimeSelect
                                width={"100%"}
                                error={
                                    formIsChecked
                                    && (dayjs(form.appointmentTimeTo, timeSpanString).isSameOrBefore(dayjs(form.appointmentTimeFrom, timeSpanString), 'minute')
                                        || dayjs(form.appointmentTimeTo, timeSpanString).isAfter(dayjs(slotRange?.start, timeSpanString), 'minute')
                                        || dayjs(form.appointmentTimeTo, timeSpanString).isBefore(dayjs(slotRange?.end, timeSpanString), 'minute'))
                                }
                                gap={60}
                                start={slotRange?.start ?? ""}
                                end={slotRange?.end ?? ""}
                                value={form.appointmentTimeTo}
                                onChange={(value) => onAppointmentTimeChange(value, "appointmentTimeTo")}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                multiple
                                options={dayOfWeekOptions}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                getOptionLabel={i => i.name}
                                value={dayOfWeekOptions.filter(el => form.daysOfWeek.includes(el.value as EDayOfWeek))}
                                onChange={onDayOfWeekChange}
                                renderInput={autocompleteRender({
                                    label: "Appointment Days Of Week",
                                    placeholder: 'Select Appointment Days Of Week'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={advisorsList}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => `${i.firstName} ${i.lastName}`}
                                value={form.advisors}
                                onChange={onAdvisorsChange}
                                renderInput={autocompleteRender({
                                    label: "Service Advisors",
                                    placeholder: 'Select Service Advisors'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={transportationsShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => i.name}
                                value={form.transportationOptions}
                                onChange={onTransportationsChange}
                                renderInput={autocompleteRender({
                                    label: "Transportation Options",
                                    placeholder: 'Select Transportation Options'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={mobileZonesShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => i.name}
                                value={form.mobileServiceZones}
                                onChange={onMobileZonesChange}
                                renderInput={autocompleteRender({
                                    label: "Mobile Service Zones",
                                    placeholder: 'Select Mobile Service Zones'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                multiple
                                options={svZonesShort}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={i => i.name}
                                value={form.serviceValetZones}
                                onChange={onSvZonesChange}
                                renderInput={autocompleteRender({
                                    label: "Service Valet Zones",
                                    placeholder: 'Select Service Valet Zones'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Autocomplete
                                options={['Yes', 'No']}
                                isOptionEqualToValue={(o, v) => o === v}
                                getOptionLabel={i => i}
                                value={form.isWaitlistEnabled ? "Yes" : "No"}
                                onChange={onWaitListChange}
                                renderInput={autocompleteRender({
                                    label: "Waitlist Appointment",
                                    placeholder: 'Select Waitlist Appointment'
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                fullWidth
                                multiline
                                style={{ marginBottom: 10 }}
                                error={formIsChecked && !form.message.length}
                                placeholder="Type Consent Message"
                                label="Consent Message"
                                onChange={onMessageChange}
                                value={form.message}
                                rows={5}/>
                        </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            loading={loading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            loading={loading}
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