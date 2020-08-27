import React, {useCallback} from "react";
import {Button} from "@material-ui/core";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from '../Modals/BaseModal';
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useConfirm} from "../../utils/hooks";


export const ConfirmDialog: React.FC = props => {
    const {open, payload} = useSelector((state: RootState) => state.modals.confirm);
    const {closeConfirm} = useConfirm();
    const onClose = useCallback(() => {
        if (payload?.onCancel) {
            payload.onCancel();
        }
        closeConfirm();
    }, [payload, closeConfirm]);
    const onConfirm = useCallback(() => {
        if (payload?.onConfirm) {
            payload.onConfirm();
        }
        closeConfirm();
    }, [payload, closeConfirm])

    if (!payload)
        return null;

    return <BaseModal
        maxWidth="sm"
        open={open}
        onClose={closeConfirm}
    >
        <DialogTitle>{payload.title}</DialogTitle>
        <DialogContent>{payload.content}</DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={onConfirm} variant="contained" color="primary">
                {payload.confirmContent || "Confirm"}
            </Button>
        </DialogActions>
    </BaseModal>
};
