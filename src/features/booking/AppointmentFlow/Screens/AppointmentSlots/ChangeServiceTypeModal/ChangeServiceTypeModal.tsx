import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {BfButtonsWrapper} from "../../../../../../components/styled/BfButtonsWrapper";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import ServiceOption from "../AppointmentFilters/ServiceOption/ServiceOption";
import {useStyles} from "./styles";

const ChangeServiceTypeModal: React.FC<DialogProps> = ({open, onClose}) => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame)
    const {t} = useTranslation();
    const {classes} = useStyles();

    return (
        <BaseModal open={open} onClose={onClose} width={550}>
            <DialogTitle onClose={onClose}>
            </DialogTitle>
            <DialogContent>
                <div className={classes.textWrapper}>
                    We're sorry. {serviceTypeOption?.name} is not available based on your selections. Please change your Service Option selection.
                </div>
                <div className={classes.selectWrapper}>
                    <div className={classes.label}>Service Option</div>
                    <ServiceOption onChangeServiceOption={onClose} hideLabel/>
                </div>
            </DialogContent>
            <BfButtonsWrapper>
                <Button variant="contained" onClick={onClose}>
                    {t("Close")}
                </Button>
            </BfButtonsWrapper>
        </BaseModal>
    );
};

export default ChangeServiceTypeModal;