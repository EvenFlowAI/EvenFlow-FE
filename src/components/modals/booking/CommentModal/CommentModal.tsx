import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {DialogProps} from "../../BaseModal/types";
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

const CommentModal: React.FC<DialogProps> = ({open, onClose}) => {
    const {appointmentByKey, description} = useSelector((state: RootState) => state.appointmentFrame)
    const {t} = useTranslation();
    return (
        <BaseModal open={open} onClose={onClose} width={550}>
            <DialogTitle onClose={onClose}>Appointment Comments</DialogTitle>
            <DialogContent>
                {description?.length
                    ? description
                    : appointmentByKey?.comment?.length
                        ? appointmentByKey.comment
                        : t("No appointment comments have been provided")}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="info" variant="contained">Close</Button>
            </DialogActions>
        </BaseModal>
    );
};

export default CommentModal;