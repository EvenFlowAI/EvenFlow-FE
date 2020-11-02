import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useConfirm, useException, useMessage, useSCs} from "../../../utils/hooks";
import {
    customerSegments,
    dayOfWeek,
    ECustomerPresence,
    ECustomerSegment,
    EDayOfWeek,
    EOfferType,
    IOffer,
    IOfferForm,
} from "../../../store/reducers/offers/types";
import {useDispatch} from "react-redux";
import {createOffer, removeOffer, setArchiveOffer, updateOffer} from "../../../store/reducers/offers/actions";
import {SC_UNDEFINED, SOMETHING_WRONG, timeSpanString} from "../../../config/constants";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {TEnumMap} from "../../../store/reducers/utils";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import {ViewOfferContent} from "./ViewOfferContent";
import {OfferEditContent} from "./OfferEditContent";
import {TOfferForm} from "./types";

const clearForm: TOfferForm = {
    offerValue: undefined,
    offerTitle: undefined,
    offerType: EOfferType.AmountOff,
    serviceRequests: [],
    customerSegments: [customerSegments[0]],
    customerPresence: ECustomerPresence.Both,
    dayOfWeek: [dayOfWeek[0]],
    timeOfDayFrom: moment("00:01:00", "hh:mm:ss"),
    timeOfDayTo: moment("23:59:59", "hh:mm:ss")
}
export const NewOffer:React.FC<DialogProps<IOffer>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TOfferForm>(clearForm);
    const [archiving, setArchiving] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);

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
                    serviceRequests: payload.serviceRequests,
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
                    timeOfDayTo: moment(payload.timeOfDay.end, timeSpanString)
                })
            } else {
                setForm(clearForm);
            }
        }
    }, [props.open, payload]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCRequestsShort(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value})
    }
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setForm({...form, offerType: Number(value) as EOfferType});
    }
    const handleArchive = async () => {
        if (!payload) {
            showError(SOMETHING_WRONG);
        } else {
            setArchiving(true);
            try {
                await dispatch(setArchiveOffer(payload));
                setArchiving(false);
            } catch (e) {
                setArchiving(false);
                showError(e);
            }
        }
    }

    const handleSegmentsSelect = (e: any, value: TEnumMap<ECustomerSegment>[]) => {
        if (form.customerSegments.find(d => d.id === ECustomerSegment.All && value.length > 1)) {
            setForm({...form, customerSegments: value.filter(s => s.id !== ECustomerSegment.All)});
        } else if (value.find(s => s.id === ECustomerSegment.All)) {
            setForm({...form, customerSegments: [customerSegments[0]]});
        } else {
            setForm({...form, customerSegments: value});
        }
    }
    const handleDOWSelect = (e: any, value: TEnumMap<EDayOfWeek>[]) => {
        if (form.dayOfWeek.find(d => d.id === EDayOfWeek.EveryDay) && value.length > 1) {
            setForm({...form, dayOfWeek: value.filter(e => e.id !== EDayOfWeek.EveryDay)});
        } else if (value.find(d => d.id === EDayOfWeek.EveryDay)) {
            setForm({...form, dayOfWeek: [dayOfWeek[0]]});
        } else {
            setForm({...form, dayOfWeek: value});
        }
    }
    const handleChangeDateTime = (name: keyof TOfferForm) => (date: MaterialUiPickersDate) => {
        setForm({...form, [name]: date});
    }

    const setEditMode = () => {
        setViewMode(false);
    }

    const askRemove = () => askConfirm({
        title: `Are you sure want to remove offer ${payload?.title}?`,
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
                await dispatch(removeOffer(payload));
                showMessage(`Successfully removed ${payload?.title}`);
                props.onClose();
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
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
                    isAllServiceRequestsIncluded: false,
                    serviceRequests: form.serviceRequests.map(s => s.id),
                };
                if (payload) {
                    await dispatch(updateOffer(data));
                } else {
                    await dispatch(createOffer(data));
                }
                showMessage("Saved");
                setSaving(false);
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const handleSRChange = (e: any, value: IAssignedServiceRequestShort[]) => {
        setForm({...form, serviceRequests: value});
    }

    const handleSelect = ({target: {name, value}}: React.ChangeEvent<{name?: string, value: unknown}>) => {
        if (name) {
            setForm({...form, [name]: value});
        }
    }
    return (
        <BaseModal {...props} width={500}>
            <DialogTitle onClose={props.onClose}>{
                viewMode ? "" : payload ? "Edit" : "Add new"
            } Offer</DialogTitle>
            {(viewMode && payload)
                ? <ViewOfferContent offer={payload} archiving={archiving} onArchive={handleArchive} />
                : <OfferEditContent
                    form={form}
                    onChange={handleChange}
                    onRadio={handleRadio}
                    onSelect={handleSelect}
                    onChangeDateTime={handleChangeDateTime}
                    onDOWSelect={handleDOWSelect}
                    onSegmentSelect={handleSegmentsSelect}
                    onSRChange={handleSRChange}
                />}
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
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