import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED, timeSpanString} from "../../../config/constants";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import moment from "moment";
import {loadAppointmentCutoff, setAppointmentCutoff} from "../../../store/reducers/optimizationWindows/actions";
import {RootState} from "../../../store/rootReducer";
import {TimePicker} from "../../UI/DateTimePickers";
import {IAppointmentCutoff} from "../../../store/reducers/optimizationWindows/types";
import {AccessTime} from "@material-ui/icons";

type TForm = {
    [k in EDay]: ParsableDate;
}

const initialState: TForm = moment.weekdays().reduce((acc, d, dayOfWeek) => {
    acc[dayOfWeek as EDay] = null;
    return acc;
}, {} as TForm);

export const AppointmentCutoffDialog: React.FC<DialogProps> = ({payload, onAction, ...props}) => {
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
                nForm[cutOff.day] = cutOff.value ? moment(cutOff.value, timeSpanString) : null;
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
                const data: IAppointmentCutoff[] = moment.weekdays().map((d, idx) => ({
                    day: idx,
                    value: form[idx as EDay] ? moment(form[idx as EDay]).format(timeSpanString) : "",
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
            {moment.weekdays().map((day, idx) => {
                const isDisabled = Boolean(workingDays.length && !workingDays.includes(idx as EDay));
                return <TimePicker
                    key={idx}
                    value={form[idx as EDay]}
                    clearable
                    fullWidth
                    style={{cursor: "pointer"}}
                    InputProps={{
                        endAdornment: <AccessTime color={!isDisabled ? "primary" : undefined} />
                    }}
                    disabled={isDisabled}
                    name={String(idx)}
                    label={day}
                    onChange={handleChange(idx)}
                />
            })}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
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