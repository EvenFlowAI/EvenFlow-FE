import React from 'react';
import {DialogContent, DialogTitle} from "../BaseModal";
import {Button, Dialog} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {makeStyles} from "@material-ui/core/styles";
import {DialogProps} from "../types";
import {
    setAddress,
    setCurrentFrameScreen,
    setServiceType,
    setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";

const useStyles = makeStyles(() => ({
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
    },
    linkButton: {
        textTransform: 'none',
        fontSize: 18,
        textDecoration: 'underline',
    }
}))

const UnavailableService: React.FC<DialogProps> = ({onClose, open}) => {
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const serviceString = serviceType === EServiceType.MobileService
        ? t("Mobile Service")
        : t("Pick Up / Drop Off Service");

    const onTryAnother = () => {
        dispatch(setAddress(null));
        dispatch(setZipCode(null));
        onClose()
    }

    const onVisitCenter = () => {
        dispatch(setServiceType(EServiceType.VisitCenter));
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        onTryAnother();
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("We are sorry but we do not offer")} {serviceString} {t("to your area")}. {t("Would you like to book an appointment to visit our service center?")}
                </div>
            </DialogContent>
            <div className={classes.buttonWrapper}>
                <Button
                    onClick={onVisitCenter}
                    color={'primary'}
                    variant='contained'>
                    Visit Center
                </Button>
            </div>
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.linkButton}
                    onClick={onTryAnother}
                    variant="text">
                    {t("Try another location")}
                </Button>
            </div>
        </Dialog>
    );
};

export default UnavailableService;