import React, {useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";

export const OverbookingFactorDialog: React.FC<DialogProps> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
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
        <DialogTitle onClose={props.onClose}>Set overbooking factor</DialogTitle>
        <DialogContent>
            Content
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