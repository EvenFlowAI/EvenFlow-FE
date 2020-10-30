import React, {useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {SC_UNDEFINED} from "../../../config/constants";
import {useDispatch} from "react-redux";

export const EditDemandSegments:React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [isSaving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const handleSave = async() => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                // const data: IDemandSegmentGroupForm = {
                //};
                // await dispatch(setDemandSegmentGroups(data));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>Edit Demand Segment</DialogTitle>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton loading={isSaving} onClick={handleSave}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};