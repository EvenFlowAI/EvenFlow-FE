import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {SC_UNDEFINED, timeSpanString} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {EDay} from "../../../../store/reducers/demandSegments/types";
import {loadAppointmentCutoff, setAppointmentCutoff} from "../../../../store/reducers/optimizationWindows/actions";
import {RootState} from "../../../../store/rootReducer";
import {IAppointmentCutoff} from "../../../../store/reducers/optimizationWindows/types";
import {AccessTime} from "@mui/icons-material";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";
import {ParsableDate, TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";
import ClockTimePicker from "../../../../components/pickers/ClockTimePicker/ClockTimePicker";

type TForm = {
    [k in EDay]: TParsableDate;
}

const initialState: TForm = dayjs.weekdays().reduce((acc, d, dayOfWeek) => {
    acc[dayOfWeek as EDay] = null;
    return acc;
}, {} as TForm);

export const AppointmentCutoffModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialState);

    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const cutoffValues = useSelector((state: RootState) => state.optimizationWindows.appointmentCutoff);
    const workingDays = useSelector((state: RootState) => state.serviceCenters.workingDays);

    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (selectedSC && props.open) {
            dispatch(loadAppointmentCutoff(selectedSC.id, selectedPod?.id));
        }
    }, [props.open, selectedSC, selectedPod, dispatch]);

    useEffect(() => {
        const nForm = {} as TForm;
        if (cutoffValues.length) {
            for (let cutOff of cutoffValues) {
                nForm[cutOff.day] = cutOff.value ? dayjs(cutOff.value, timeSpanString) : null;
            }
            setForm({...initialState, ...nForm});
        } else {
            setForm(initialState);
        }
    }, [cutoffValues]);

    const handleChange = (day: EDay) => (date: ParsableDate) => {
        setForm({...form, [day]: date});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                const data: IAppointmentCutoff[] = dayjs.weekdays().map((d, idx) => ({
                    day: idx,
                    value: form[idx as EDay] ? dayjs(form[idx as EDay]).format(timeSpanString) : "",
                    podId: selectedPod?.id,
                    serviceCenterId: selectedSC.id
                })).filter(v => Boolean(v.value));
                await dispatch(setAppointmentCutoff(data, selectedSC.id, selectedPod?.id));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false)
                showError(e);
            }
        }
    }

    return <BaseModal {...props} width={300}>
        <DialogTitle onClose={props.onClose}>Set Appointment Cutoff</DialogTitle>
        <DialogContent>
            {dayjs.weekdays().map((day, idx) => {
                const isDisabled = Boolean(workingDays.length && !workingDays.includes(idx as EDay));
                return <ClockTimePicker
                    key={idx}
                    value={form[idx as EDay]}
                    fullWidth
                    InputProps={{
                        style:{cursor: "pointer"},
                        endAdornment: <AccessTime color={!isDisabled ? "primary" : undefined} />,
                        disabled: isDisabled,
                        name: String(idx)
                    }}
                    label={day}
                    onChange={handleChange(idx)}
                />
            })}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="info">
                Close
            </Button>
            <LoadingButton
                onClick={handleSave}
                color="primary"
                variant="contained"
                loading={saving}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};