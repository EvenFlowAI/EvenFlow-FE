import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, SelectChangeEvent} from "@mui/material";
import {
    customerSegments,
    dayOfWeek,
    ECustomerPresence,
    ECustomerSegment,
    EDayOfWeek,
    EOfferType,
    IOffer,
    IOfferForm,
} from "../../../../store/reducers/offers/types";
import {useDispatch} from "react-redux";
import {createOffer, removeOffer, setArchiveOffer, updateOffer} from "../../../../store/reducers/offers/actions";
import {SC_UNDEFINED, SOMETHING_WRONG, timeSpanString} from "../../../../utils/constants";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {loadSCRequestsShort} from "../../../../store/reducers/serviceRequests/actions";
import moment from "moment";
import {ViewOffer} from "./ViewOffer/ViewOffer";
import {OfferForm} from "./OfferForm/OfferForm";
import {selectAllSR, TOfferForm} from "../types";
import {EPricingDisplayType} from "../../../../store/reducers/pricingSettings/types";
import {ICategory} from "../../../../store/reducers/categories/types";
import {loadCategoriesByQuery} from "../../../../store/reducers/categories/actions";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {TEnumMap} from "../../../../store/reducers/types";
import {ParsableDate} from "../../../../types/types";

const initialForm: TOfferForm = {
    offerValue: undefined,
    offerTitle: undefined,
    offerType: EOfferType.AmountOff,
    serviceRequests: [selectAllSR],
    serviceCategories: [],
    customerSegments: [customerSegments[0]],
    customerPresence: ECustomerPresence.Both,
    dayOfWeek: [dayOfWeek[0]],
    timeOfDayFrom: moment("00:00:00", "hh:mm:ss"),
    timeOfDayTo: moment("23:59:59", "hh:mm:ss"),
    isProductPageOn: false,
}

export const OfferModal:React.FC<DialogProps<IOffer>&{archive?: boolean}> = ({onAction, archive, payload, ...props}) => {
    const [form, setForm] = useState<TOfferForm>(initialForm);
    const [archiving, setArchiving] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setViewMode(true);
            } else {
                setViewMode(false);
            }
        }
    }, [payload, props.open])

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    offerTitle: payload.title,
                    offerValue: String(payload.value),
                    offerType: payload.type,
                    serviceRequests: payload.isAllServiceRequestsIncluded
                        ? [selectAllSR] : payload.serviceRequests,
                    customerSegments: payload.customerSegments.map(s => {
                        return customerSegments.find(seg => seg.id === s);
                    }).filter(el => el !== undefined) as TEnumMap<ECustomerSegment>[],
                    customerPresence: payload.customerPresence,
                    dayOfWeek: payload.dayOfWeeks.reduce((acc, el) => {
                        const dof = dayOfWeek.find(e => e.id === el);
                        if (dof) acc.push(dof);
                        return acc;
                    }, [] as TEnumMap<EDayOfWeek>[]),
                    durationFrom: moment(payload.duration.start),
                    durationTo: moment(payload.duration.end),
                    timeOfDayFrom: moment(payload.timeOfDay.start, timeSpanString),
                    timeOfDayTo: moment(payload.timeOfDay.end, timeSpanString),
                    serviceType: payload.serviceType?.name,
                    serviceCategories: payload.serviceCategories,
                })
            } else {
                setForm(initialForm);
            }
        }
    }, [props.open, payload]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCRequestsShort(selectedSC.id, EPricingDisplayType.Dynamic));
            dispatch(loadCategoriesByQuery(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setFormIsChecked(false);
        setForm({...form, [name]: value})
    }
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setFormIsChecked(false);
        const nForm = {...form, offerType: Number(value) as EOfferType};
        if (nForm.offerType === EOfferType.FreeService) {
            nForm.offerValue = undefined;
        } else {
            nForm.serviceType = undefined;
        }
        setForm(nForm);
    }
    const handleArchive = async () => {
        if (!payload) {
            showError(SOMETHING_WRONG);
        } else {
            setArchiving(true);
            try {
                await dispatch(setArchiveOffer(payload, archive));
                setArchiving(false);
            } catch (e) {
                setArchiving(false);
                showError(e);
            }
        }
    }

    const handleSegmentsSelect = (e: any, value: TEnumMap<ECustomerSegment>[]) => {
        setFormIsChecked(false);
        if (form.customerSegments.find(d => d.id === ECustomerSegment.All && value.length > 1)) {
            setForm({...form, customerSegments: value.filter(s => s.id !== ECustomerSegment.All)});
        } else if (value.find(s => s.id === ECustomerSegment.All)) {
            setForm({...form, customerSegments: [customerSegments[0]]});
        } else {
            setForm({...form, customerSegments: value});
        }
    }
    const handleDOWSelect = (e: any, value: TEnumMap<EDayOfWeek>[]) => {
        setFormIsChecked(false);
        if (form.dayOfWeek.find(d => d.id === EDayOfWeek.EveryDay) && value.length > 1) {
            setForm({...form, dayOfWeek: value.filter(e => e.id !== EDayOfWeek.EveryDay)});
        } else if (value.find(d => d.id === EDayOfWeek.EveryDay)) {
            setForm({...form, dayOfWeek: [dayOfWeek[0]]});
        } else {
            setForm({...form, dayOfWeek: value});
        }
    }
    const handleChangeDateTime = (name: keyof TOfferForm) => (date: ParsableDate) => {
        setFormIsChecked(false);
        setForm({...form, [name]: date});
    };

    const setEditMode = () => {
        setViewMode(false);
    }

    const askRemove = () => askConfirm({
        title: `Please confirm you want to remove Offer ${payload?.title}?`,
        isRemove: true,
        onConfirm: async () => {
            await handleRemove();
        }
    });
    const handleRemove = async () => {
        if (!payload) {
            showError("Something wrong");
        } else {
            try {
                await dispatch(removeOffer(payload, archive));
                showMessage(`Offer removed`);
                props.onClose();
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleSRChange = (e: any, value: IAssignedServiceRequestShort[]) => {
        setFormIsChecked(false);
        if (form.serviceRequests.find(sr => sr.id === 0) && value.length > 1) {
            setForm({...form, serviceRequests: value.filter(e => e.id !== 0)});
        } else if (value.find(sr => sr.id === 0)) {
            setForm({...form, serviceRequests: [selectAllSR]});
        } else {
            setForm({...form, serviceRequests: value});
        }
    }

    const onCategoryChange = (e: any, value: ICategory[]) => {
        setForm(prev => ({...prev, serviceCategories: value}))
    }

    const handleSelect = (e: SelectChangeEvent<ECustomerPresence>) => {
        const {name, value} = e.target;
        setFormIsChecked(false);
        if (name) {
            setForm({...form, [name]: value});
        }
    }

    const handleValueChange = (name: keyof TOfferForm, value: unknown) => {
        setFormIsChecked(false);
        setForm({...form, [name]: value});
    }

    const checkIsValid = () => {
        let valid = true;
        if (!form.offerTitle?.length) {
            valid = false;
            showError('"Offer Title" must not be empty')
        }
        if (!form.offerValue?.length) {
            valid = false;
            showError('"Offer Value" must be greater than "0"')
        }
        if (!form.customerSegments.length) {
            valid = false;
            showError('"Customer Segment" must not be empty')
        }
        if (!form.serviceRequests.length) {
            valid = false;
            showError('"Service Request" must not be empty')
        }
        if (!form.dayOfWeek.length) {
            valid = false;
            showError('"Day of Week" must not be empty')
        }
        if (!form.durationFrom) {
            valid = false;
            showError('"Start Date" must not be empty')
        }
        if (!form.durationTo) {
            valid = false;
            showError('"End Date" must not be empty')
        }
        if (!form.timeOfDayFrom) {
            valid = false;
            showError('"Start Time" must not be empty')
        }
        if (!form.timeOfDayTo) {
            valid = false;
            showError('"End Time" must not be empty')
        }
        return valid;
    }

    const onCancel = () => {
        setFormIsChecked(false);
        props.onClose();
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setFormIsChecked(true);
            if (checkIsValid()) {
                setSaving(true);
                try {
                    const data: IOfferForm = {
                        id: payload?.id,
                        title: form.offerTitle || "",
                        value: Number(form.offerValue),
                        serviceCenterId: selectedSC.id,
                        type: form.offerType,
                        customerPresence: form.customerPresence,
                        customerSegments: form.customerSegments.map(s => s.id),
                        dayOfWeeks: form.dayOfWeek.map(d => d.id),
                        duration: {
                            start: form.durationFrom?.toISOString(),
                            end: form.durationTo?.toISOString()
                        },
                        timeOfDay: {
                            start: form.timeOfDayFrom?.format(timeSpanString),
                            end: form.timeOfDayTo?.format(timeSpanString),
                        },
                        isAllServiceRequestsIncluded: Boolean(
                            form.serviceRequests.find(sr => sr.id === 0)
                        ),
                        serviceRequests: Boolean(form.serviceRequests.find(sr => sr.id === 0))
                            ? null : form.serviceRequests.map(s => s.id),
                        serviceType: form.serviceType ? {name: form.serviceType} : undefined
                    };
                    if (payload) {
                        await dispatch(updateOffer(data, archive));
                    } else {
                        await dispatch(createOffer(data));
                    }
                    showMessage(`Offer ${payload ? "updated" : "created"}`);
                    setSaving(false);
                    onCancel()
                } catch (e) {
                    setSaving(false);
                    showError(e);
                }
            }
        }
    }
    return (
        <BaseModal {...props} width={600} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {viewMode ? "" : payload ? "Edit" : "Add"} Offer
            </DialogTitle>
            {(viewMode && payload)
                ? <ViewOffer offer={payload} archiving={archiving} onArchive={handleArchive} />
                : <OfferForm
                    formIsChecked={formIsChecked}
                    form={form}
                    onValueChange={handleValueChange}
                    onChange={handleChange}
                    onRadio={handleRadio}
                    onSelect={handleSelect}
                    onChangeDateTime={handleChangeDateTime}
                    onDOWSelect={handleDOWSelect}
                    onSegmentSelect={handleSegmentsSelect}
                    onSRChange={handleSRChange}
                    onCategoryChange={onCategoryChange}
                />}
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                {viewMode ?
                    <>
                        <Button onClick={askRemove} color="secondary" variant="outlined">Delete</Button>
                        <Button onClick={setEditMode} color="primary" variant="contained">Edit</Button>
                    </>
                : <LoadingButton
                    onClick={handleSave}
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                >Save</LoadingButton>}

            </DialogActions>
        </BaseModal>
    );
};