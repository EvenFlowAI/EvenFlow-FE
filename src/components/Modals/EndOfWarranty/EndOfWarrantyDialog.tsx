import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {TextField} from "../../UI/TextField";
import {SC_UNDEFINED} from "../../../config/constants";
import {setEndOfWarranty} from "../../../store/reducers/valueSettings/actions";
import {IEndOfWarranty} from "../../../store/reducers/valueSettings/types";

export const EndOfWarrantyDialog: React.FC<DialogProps<IEndOfWarranty>> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>();
    const [months, setMonths] = useState<string>("");
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setMonths(String(payload.periodInMonth));
            } else {
                setMonths("");
            }
        }

    }, [props.open, payload]);

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setEndOfWarranty({
                    serviceCenterId: selectedSC.id,
                    periodInMonth: Number(months)
                }));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit End of Warranty</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                id="warranty-months"
                name="months"
                label="Considered near the end of warranty within"
                autoComplete="warranty-months months"
                type="number"
                inputProps={{min: 0}}
                value={months}
                onChange={e => setMonths(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                variant="contained"
                color="primary"
                loading={saving}
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}