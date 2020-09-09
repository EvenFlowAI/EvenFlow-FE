import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch} from "react-redux";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import {setNewLostCustomers} from "../../../store/reducers/valueSettings/actions";
import {NewLostEnum} from "../../../store/reducers/valueSettings/types";

export const NewCustomerValue: React.FC<DialogProps & {isNew: boolean}> = ({onAction, isNew=false, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [months, setMonths] = useState<string>("");

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setMonths("");
            } else {
                setMonths("");
            }
        }
    }, [dispatch, props.open, payload]);

    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not loaded");
        } else {
            setSaving(true);
            try {
                await dispatch(setNewLostCustomers({
                    serviceCenterId: selectedSC.id,
                    periodInMonth: Number(months),
                    type: isNew ? NewLostEnum.New : NewLostEnum.Lost
                }));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle>Edit {isNew ? "New" : "Lost"} Customer</DialogTitle>
        <DialogContent>
            <TextField
                id="months"
                name="months"
                fullWidth
                label={`Considered ${isNew ? "new" : "lost"} up to`}
                value={months}
                onChange={e => setMonths(e.target.value)}
                inputProps={{min: 0}}
                type="number"
                autoComplete="new-customer number"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                color="primary"
                variant="contained"
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}