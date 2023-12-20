import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import {Button} from "@material-ui/core";
import {IOptimizationWindow, TOptContentData} from "../../../../store/reducers/optimizationWindows/types";
import {TextField} from "../../../../components/FormControls/TextFieldStyled/TextField";
import {useDispatch} from "react-redux";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../../utils/hooks";
import {SC_UNDEFINED} from "../../../../config/constants";
import {setOptimizationWindow} from "../../../../store/reducers/optimizationWindows/actions";
import {LoadingButton} from "../../../../components/LoadingButton/LoadingButton";

type TProps = DialogProps<IOptimizationWindow> & {
    content: TOptContentData
}

export const OptimizationModal: React.FC<TProps> = ({
    onAction,
    content,
    payload,
    ...props}) => {
    const [val, setVal] = useState<number>(0);
    const [saving, setSaving] = useState();
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
        <DialogTitle onClose={props.onClose}>{content.title}</DialogTitle>
        <DialogContent>
            <TextField
                value={val}
                fullWidth
                label={content.label}
                type="number"
                endAdornment={content.suffix || undefined}
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