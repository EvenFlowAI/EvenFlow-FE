import React, {useCallback, useState} from "react";
import {Button, Divider, Grid} from "@mui/material";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from '../../BaseModal/BaseModal';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ReportProblemOutlined} from "@mui/icons-material";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

export const ConfirmModal: React.FC = () => {
    const {open, payload} = useSelector((state: RootState) => state.modals.confirm);
    const {closeConfirm} = useConfirm();
    const [loading, setLoading] = useState<boolean>(false);

    const onClose = useCallback(async () => {
        if (payload?.onCancel) {
            setLoading(true)
            try {
                await payload.onCancel();
            } catch (e) {
                throw e;
            } finally {
                setLoading(false);
            }
        }
        closeConfirm();
    }, [payload, closeConfirm]);

    const onConfirm = useCallback(async () => {
        if (payload?.onConfirm) {
            setLoading(true)
            try {
                await payload.onConfirm();
            } catch (e) {
                throw e;
            }
            finally {
                setLoading(false);
            }
        }
        closeConfirm();
    }, [payload, closeConfirm]);

    if (!payload)
        return null;

    return <BaseModal
        width={400}
        open={open}
        onClose={closeConfirm}
    >
        <DialogTitle onClose={closeConfirm}>{payload.icon || payload.isRemove ?
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                    {payload.icon || <ReportProblemOutlined fontSize="large" color="secondary" />}
                </Grid>
                <Grid item xs={10} style={{textAlign: "left", paddingRight: 25}}>
                    {payload.title}
                </Grid>
            </Grid>
            : payload.title
        }</DialogTitle>
        {payload.content ? <DialogContent>{payload.content}</DialogContent> : null}
        {payload.isRemove ? <Divider style={{margin: "0 0 10px"}} /> : null}
        <DialogActions>
            {payload.cancelContent && payload.onCancel
                ? <LoadingButton
                    loading={loading}
                    onClick={onClose}
                    variant="contained">
                    {payload.cancelContent}
                </LoadingButton>
                : <Button onClick={onClose}>
                    {payload.cancelContent ?? "Cancel"}
                </Button>}

            <LoadingButton
                loading={loading}
                onClick={onConfirm}
                variant="contained"
                color={payload.isRemove ? "secondary" : "primary"}>
                {payload.confirmContent ? payload.confirmContent : payload.isRemove ? "Remove" : "Confirm"}
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};
