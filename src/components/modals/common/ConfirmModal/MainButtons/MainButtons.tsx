import {TCallback} from "../../../../../types/types";
import React from "react";
import {LoadingButton} from "../../../../buttons/LoadingButton/LoadingButton";
import {Button} from "@mui/material";

type TProps = {
    loading: boolean;
    onClose: TCallback;
    onConfirm: TCallback;
    onCancel?: TCallback;
    cancelContent?: string;
    isRemove?: boolean;
    confirmContent?: JSX.Element | string;
    cancelBtnVariant?: "outlined" | "text";
    isBooking?: boolean;
}

export const MainButtons: React.FC<TProps> = ({
                                                  loading,
                                                  onConfirm,
                                                  onClose,
                                                  cancelContent,
                                                  onCancel,
                                                  confirmContent,
                                                  isRemove,
                                                  cancelBtnVariant,
                                                  isBooking
                                              }) => {
    return <>
        {cancelContent && onCancel
            ? <LoadingButton
                loading={loading}
                onClick={onClose}
                style={isBooking ? {borderRadius: 0} : {}}
                variant={cancelBtnVariant ?? "contained"}>
                {cancelContent}
            </LoadingButton>
            : <Button
                onClick={onClose}
                color="info"
                variant={cancelBtnVariant ?? "text"}
                style={isBooking ? {borderRadius: 0} : {}}
            >
                {cancelContent ?? "Cancel"}
            </Button>}

        <LoadingButton
            loading={loading}
            onClick={onConfirm}
            variant="contained"
            style={isBooking ? {borderRadius: 0} : {}}
            color={isRemove ? isBooking ? "error" : "secondary" : "primary"}>
            {confirmContent ? confirmContent : isRemove ? "Remove" : "Confirm"}
        </LoadingButton>
    </>
}