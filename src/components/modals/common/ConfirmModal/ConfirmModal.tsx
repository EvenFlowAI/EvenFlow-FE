import React, {useCallback, useState} from "react";
import {Button, Divider, Grid} from "@mui/material";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from '../../BaseModal/BaseModal';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ReportProblemOutlined} from "@mui/icons-material";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {TCallback} from "../../../../types/types";

type TProps = {
    loading: boolean;
    onClose: TCallback;
    onConfirm: TCallback;
    onCancel?: TCallback;
    cancelContent?: string;
    isRemove?: boolean;
    confirmContent?: JSX.Element | string;
}

const MainButtonsBlock: React.FC<TProps> = ({
                                                loading,
                                                onConfirm,
                                                onClose,
                                                cancelContent,
                                                onCancel,
                                                confirmContent,
                                                isRemove}) => {
    return <>
        {cancelContent && onCancel
            ? <LoadingButton
                loading={loading}
                onClick={onClose}
                variant="contained">
                {cancelContent}
            </LoadingButton>
            : <Button onClick={onClose} color="info">
                {cancelContent ?? "Cancel"}
            </Button>}

        <LoadingButton
            loading={loading}
            onClick={onConfirm}
            variant="contained"
            color={isRemove ? "secondary" : "primary"}>
            {confirmContent ? confirmContent : isRemove ? "Remove" : "Confirm"}
        </LoadingButton>
    </>
}

export const ConfirmModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<unknown>>> = () => {
    const {open, payload} = useSelector((state: RootState) => state.modals.confirm);
    const {closeConfirm} = useConfirm();
    const [loading, setLoading] = useState<boolean>(false);

    const onClose = useCallback(async () => {
        if (payload?.onCancel) {
            setLoading(true)
            try {
                await payload.onCancel();
            } catch (e) {
                console.log('on cancel error', e)
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
                console.log('on confirm error', e)
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
        <DialogActions style={{justifyContent: payload.additionalContent && payload.onAdditional ? 'space-between' : "flex-end"}}>
            {payload.additionalContent && payload.onAdditional
                ? <LoadingButton
                    loading={loading}
                    onClick={payload.onAdditional}
                    color="secondary"
                    variant="outlined">
                    {payload.additionalContent}
                </LoadingButton>
                : null}

            {payload.additionalContent && payload.onAdditional
                ? <div>
                    <MainButtonsBlock
                    loading={loading}
                    onClose={onClose}
                    onConfirm={onConfirm}
                    isRemove={payload.isRemove}
                    onCancel={payload.onCancel}
                    confirmContent={payload.confirmContent}
                    cancelContent={payload.cancelContent}/>
            </div>
                : <MainButtonsBlock
                    loading={loading}
                    onClose={onClose}
                    onConfirm={onConfirm}
                    isRemove={payload.isRemove}
                    onCancel={payload.onCancel}
                    confirmContent={payload.confirmContent}
                    cancelContent={payload.cancelContent}
                />
            }
        </DialogActions>
    </BaseModal>
};
