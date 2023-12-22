import {DialogProps} from "../../../../components/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import React, {useEffect, useState} from "react";
import {Button, FormGroup, InputLabel} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {ICustomerLifetime, ICustomerLifetimeForm} from "../../../../store/reducers/valueSettings/types";
import {setCustomerLifetimes} from "../../../../store/reducers/valueSettings/actions";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {useStyles} from "./styles";
import {TForm} from "./types";
import {LoadingButton} from "../../../../components/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

const initialForm: TForm = {
    from: "", to: ""
}

export const CustomerLifetimesModal: React.FC<DialogProps<ICustomerLifetime>> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC && props.open) {
            if (payload) {
                setForm({from: String(payload.from), to: String(payload.to)});
            } else {
                setForm(initialForm);
            }
        }
    }, [selectedSC, props.open, payload])

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [name]: e.target.value});
    }

    const checkIsValid = () => {
        if (Number(form.from) > Number(form.to)) {
            showError('"From" must be less than or equal to "To"')
            return false;
        }
        return true;
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            if (checkIsValid()) {
                setSaving(true)
                const data: ICustomerLifetimeForm = {
                    from: Number(form.from),
                    to: Number(form.to),
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id
                }
                try {
                    await dispatch(setCustomerLifetimes(data))
                    showMessage("Customer Lifetime Value Range updated");
                    setSaving(false);
                    props.onClose();
                } catch (e) {
                    setSaving(false);
                    showError(e);
                }
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Medium Value</DialogTitle>
        <DialogContent>
            <InputLabel className={classes.label}>Customer Lifetime Value Range</InputLabel>
            <FormGroup className={classes.group} row>
                <TextField
                    type="number"
                    autoComplete="low-value value"
                    id="low-value"
                    startAdornment="$"
                    name="low-value-f"
                    inputProps={{min: 0}}
                    value={form.from}
                    onChange={handleChange("from")}
                />
                <span>-</span>
                <TextField
                    type="number"
                    startAdornment="$"
                    autoComplete="high-value value"
                    inputProps={{min: Number(form.from) || 0}}
                    id="high-value"
                    name="high-value-t"
                    value={form.to}
                    onChange={handleChange("to")}
                />
            </FormGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary"
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}