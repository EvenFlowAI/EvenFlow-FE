import React from 'react';
import {Button, Dialog} from "@mui/material";
import {useDialogStyles} from "../../../../hooks/styling/useDialogStyles";
import {useTranslation} from "react-i18next";
import {TCallback} from "../../../../types/types";
import {useStyles} from "./styles";
import {DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";

type TUnavailableServiceProps = DialogProps & {
    serviceString: string;
    onVisitCenter: TCallback;
}

const UnavailableServiceModal: React.FC<TUnavailableServiceProps> = ({

                                                                         serviceString,
                                                                         onVisitCenter,
                                                                         open,
                                                                         onClose,
                                                                     }) => {
    const { classes: dialogClasses } = useDialogStyles();
    const { classes  } = useStyles();
    const {t} = useTranslation();

    const onVisitCenterClick = () => {
        onVisitCenter()
        onClose();
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("We are sorry but we do not offer")} {serviceString} {t("to your area")}
                </div>
            </DialogContent>
            <div className={classes.buttonWrapper}>
                <Button
                    onClick={onVisitCenterClick}
                    color={'primary'}
                    variant='contained'>
                    {t("Back to Visit Center")}
                </Button>
            </div>
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.linkButton}
                    onClick={onClose}
                    variant="text">
                    {t("Try another location")}
                </Button>
            </div>
        </Dialog>
    );
};

export default UnavailableServiceModal;