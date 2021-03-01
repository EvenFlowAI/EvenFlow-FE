import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import moment from "moment";
import {TextField} from "../../UI/TextField";

type TForm = {
    [k in EDay]: ParsableDate;
}

const initialState: TForm = moment.weekdays().reduce((acc, d, dayOfWeek) => {
    acc[dayOfWeek as EDay] = "";
    return acc;
}, {} as TForm);

export const AppointmentCutoffDialog: React.FC<DialogProps> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialState);

    const {selectedSC} = useSCs();

    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            setForm(initialState);
        }
    }, [props.open]);

    const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [Number(name)]: value});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                // TODO: Send date request
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false)
                showError(e);
            }
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Set Appointment Cutoff</DialogTitle>
        <DialogContent>
            {moment.weekdays().map((day, idx) => {
                return <TextField
                    key={idx}
                    value={form[idx as EDay]}
                    fullWidth
                    name={String(idx)}
                    label={day}
                    type="number"
                    endAdornment={undefined}
                    onChange={handleChange}
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