import React from 'react';
import {useDialogStyles} from "../../../../hooks/styling/useDialogStyles";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EAncillaryType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {TCallback} from "../../../../types/types";
import {useStyles} from "./styles";
import {Button} from "@mui/material";
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {CenteredButtonsWrapper} from "../../../../components/styled/BfButtonsWrapper";
import {DialogProps} from "../../../../components/modals/BaseModal/types";

type TDisplayAncillaryPriceProps = DialogProps & {
    onNext: TCallback;
    serviceString: string;
    onBack: TCallback;
}

const AncillaryPriceModal: React.FC<TDisplayAncillaryPriceProps> = ({
                                                                        open,
                                                                        onClose,
                                                                        onNext,
                                                                        serviceString,
                                                                        onBack,
                                                                    }) => {
    const {ancillaryPrice} = useSelector((state: RootState) => state.appointmentFrame);
    const {classes: dialogClasses} = useDialogStyles();
    const { classes  } = useStyles();
    const {t} = useTranslation();
    const price = ancillaryPrice?.feeAmount && ancillaryPrice?.feeType === EAncillaryType.Amount ? `${ancillaryPrice?.feeAmount.toFixed(2)}` : `${ancillaryPrice?.feeAmount}%`

    const handleBack = () => {
        onBack();
        onClose();
    }

    const onSubmit = () => {
        onNext()
        onClose()
    }

    return (
        <BaseModal
            open={open}
            style={{paddingBottom: 20}}
            onClose={onClose}
            classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}
            width={525}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("For the pick up location, a convenience fee of")} {ancillaryPrice?.feeType === EAncillaryType.Amount ? "$" : ""}{price} {t("will be added to your service bill")}.
                    <span className={classes.question}>
                        {t("Do you wish to proceed with the")} {serviceString}?
                    </span>
                </div>
            </DialogContent>
            <CenteredButtonsWrapper>
                <Button onClick={handleBack} variant="outlined" style={{backgroundColor: '#F7F8FB'}}>
                    {t("Visit Center Instead")}
                </Button>
                <Button onClick={onSubmit} variant="contained">
                    {`${t("Schedule")} ${serviceString}`}
                </Button>
            </CenteredButtonsWrapper>
        </BaseModal>
    );
};

export default AncillaryPriceModal;
