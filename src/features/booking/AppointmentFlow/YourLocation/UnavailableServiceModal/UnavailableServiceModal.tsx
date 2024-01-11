import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {DialogContent, DialogTitle} from "../../../../../components/modals/BaseModal/BaseModal";
import {Button, Dialog} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useDialogStyles} from "../../../../../hooks/styling/useDialogStyles";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {DialogProps} from "../../../../../components/modals/BaseModal/types";
import {setAddress, setCurrentFrameScreen, setZipCode} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {TCallback} from "../../../../../types/types";
import {useStyles} from "./styles";

type TUnavailableServiceProps = DialogProps & {
    setFormChecked: Dispatch<SetStateAction<boolean>>;
    onBackToServiceOption: TCallback;
    onVisitCenter: TCallback;
    onBackToSelectSlotsForVisitCenter: TCallback;
}

const UnavailableServiceModal: React.FC<TUnavailableServiceProps> = ({
                                                                    onClose,
                                                                    open,
                                                                    setFormChecked,
                                                                    onBackToSelectSlotsForVisitCenter,
                                                                    onBackToServiceOption,
                                                                    onVisitCenter
}) => {
    const {serviceTypeOption, appointmentByKey, serviceOptionChangedFromSlotPage} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const isSameServiceTypeOption = useMemo(() => {
        return appointmentByKey?.serviceTypeOption?.id === serviceTypeOption?.id
    }, [appointmentByKey, serviceTypeOption])
    const serviceString = serviceType === EServiceType.MobileService
        ? t("Mobile Service")
        : t("Pick Up / Drop Off Service");

    const backLabel = serviceOptionChangedFromSlotPage
        ? t("Back to Visit Center")
        : customerLoadedData?.isUpdating
        ? isSameServiceTypeOption
            ? t("Keep Original Location")
            : t("Back") : t("Visit Center")

    const clearLocation = () => {
        setFormChecked(false);
        dispatch(setAddress(null));
        dispatch(setZipCode(""));
        onClose()
    }

    const keepOriginalLocation = () => {
        dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null))
        dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ''))
        onClose()
        dispatch(setCurrentFrameScreen('manageAppointment'))
    }

    const onVisitCenterClick = () => {
        if (serviceOptionChangedFromSlotPage) {
            onBackToSelectSlotsForVisitCenter()
        } else {
            if (customerLoadedData?.isUpdating) {
                if (isSameServiceTypeOption) {
                    keepOriginalLocation()
                } else {
                    onBackToServiceOption()
                    clearLocation();
                }
            } else {
                onVisitCenter()
                clearLocation();
            }
        }
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {serviceOptionChangedFromSlotPage
                        ? `${t("We are sorry but we do not offer")} ${serviceString} ${t("to your area")}`
                        : `${t("We are sorry but we do not offer")} ${serviceString} ${t("to your area")}. ${t("Would you like to book an appointment to visit our service center?")}`
                    }
                </div>
            </DialogContent>
            <div className={classes.buttonWrapper}>
                <Button
                    onClick={onVisitCenterClick}
                    color={'primary'}
                    variant='contained'>
                    {backLabel}
                </Button>
            </div>
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.linkButton}
                    onClick={clearLocation}
                    variant="text">
                    {t("Try another location")}
                </Button>
            </div>
        </Dialog>
    );
};

export default UnavailableServiceModal;