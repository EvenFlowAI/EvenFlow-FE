import React, {useCallback, useState} from "react";
import {Button, Divider, Grid} from "@material-ui/core";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from '../Modals/BaseModal';
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useConfirm} from "../../utils/hooks";
import {LoadingButton} from "./Button";
import {ReportProblemOutlined} from "@material-ui/icons";


export const ConfirmDialog: React.FC = () => {
    const {open, payload} = useSelector((state: RootState) => state.modals.confirm);
    const {closeConfirm} = useConfirm();
    const [loading, setLoading] = useState<boolean>(false);
    const onClose = useCallback(() => {
        if (payload?.onCancel) {
            payload.onCancel();
        }
        closeConfirm();
    }, [payload, closeConfirm]);
    const onConfirm = useCallback(async () => {
        if (payload?.onConfirm) {
            setLoading(true)
            try {
                await payload.onConfirm();
                setLoading(false);
            } catch (e) {
                setLoading(false);
                throw e;
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
            <Button onClick={onClose}>
                Cancel
            </Button>
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
