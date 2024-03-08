import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {RootState} from "../../../../store/rootReducer";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {TForm} from "./types";
import {initialForm} from "./constants";
import {loadConsentById} from "../../../../store/reducers/screenSettings/actions";
import {Autocomplete, Grid} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {autocompleteOptionsRender, autocompleteRender} from "../../../../utils/autocompleteRenders";
import {IMakeExtended, IModel} from "../../../../api/types";
import {getOptions, getYearOptions} from "../../../../utils/utils";
import {TOption} from "../../PodsTable/PODModal/types";
import {EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";

const yearOptions = getYearOptions();
const customerTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EUserType).filter(key => Number.isNaN(+key))), []);

const EditCustomerConsentModal: React.FC<DialogProps & { id: number }> = ({open, onClose, id}) => {
    const {advisorsList} = useSelector(({scEmployees}: RootState) => scEmployees);
    const {scRequestsShort: serviceRequests} = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {makesModels} = useSelector(({vehicleDetails}: RootState) => vehicleDetails);
    const {mobileZonesShort} = useSelector(({mobileService}: RootState) => mobileService);
    const {svZonesShort} = useSelector(({serviceValet}: RootState) => serviceValet);
    const {optionsShort} = useSelector(({transportation}: RootState) => transportation);
    const {currentConsent, isConsentLoading} = useSelector(({screenSettingsBooking}: RootState) => screenSettingsBooking);
    const [form, setForm] = useState<TForm>(initialForm);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (id && open) dispatch(loadConsentById(id))
    }, [id, open])

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
                    transportationOptions: optionsShort.filter(el => currentConsent.transportationOptionIds.includes(el.id)),
                    mobileServiceZones: mobileZonesShort.filter(el => currentConsent.mobileServiceZoneIds.includes(el.id)),
                    serviceValetZones: svZonesShort.filter(el => currentConsent.serviceValetZoneIds.includes(el.id)),
                    serviceBooks: [],
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
        setForm(prev => ({...form, customerType: value ? value.value as EUserType : null}))
    }

    return (
        <BaseModal open={open} width={940} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {currentConsent ? "Edit" : "Add"} Customer Consent
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
                </Grid>
            </DialogContent>
            <DialogActions></DialogActions>
        </BaseModal>
    );
};

export default EditCustomerConsentModal;