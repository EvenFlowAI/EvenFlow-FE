import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {IOptimizationWindow, TOptContentData} from "../../../../store/reducers/optimizationWindows/types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useDispatch} from "react-redux";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {setOptimizationWindow} from "../../../../store/reducers/optimizationWindows/actions";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

type TProps = DialogProps<IOptimizationWindow> & {
    windowContent: TOptContentData
}

export const OptimizationModal: React.FC<TProps> = ({
    onAction,
    windowContent,
    payload,
    ...props}) => {
    const [val, setVal] = useState<number>(0);
    const [saving, setSaving] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    useEffect(() => {
        if (payload) {
            setVal(payload.value || 0);
        }
    }, [payload]);
    const handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setVal(Number(value));
    }
    const handleSave = async () => {
        if (!selectedSC || !payload) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setOptimizationWindow(
                    payload.type, val, selectedSC.id, selectedPod?.id
                ));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} width={300}>
        <DialogTitle onClose={props.onClose}>{windowContent.title}</DialogTitle>
        <DialogContent>
            <TextField
                value={val}
                fullWidth
                label={windowContent.label}
                type="number"
                endAdornment={windowContent.suffix || undefined}
                inputProps={{min: 0}}
                onChange={handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                onClick={handleSave}
                loading={saving}
                color="primary"
                variant="contained"
            >Save</LoadingButton>
        </DialogActions>
    </BaseModal>
}