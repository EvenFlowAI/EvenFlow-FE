import React, {useCallback, useState} from "react";
import {Button} from "@material-ui/core";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from '../Modals/BaseModal';
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useConfirm} from "../../utils/hooks";
import {LoadingButton} from "./Button";


export const ConfirmDialog: React.FC = () => {
    const {open, payload} = useSelector((state: RootState) => state.modals.confirm);
    const {closeConfirm} = useConfirm();
    const [loading, setLoading] = useState<boolean>(false);
    const onClose = useCallback(async () => {
        setLoading(true);
        if (payload?.onCancel) {
            try {
                await payload.onCancel();
                setLoading(false);
            } catch (e) {
                setLoading(false);
                throw e;
            }
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
            <LoadingButton
                loading={loading}
                onClick={onConfirm}
                variant="contained"
                color="primary">
                {payload.confirmContent || "Confirm"}
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};
