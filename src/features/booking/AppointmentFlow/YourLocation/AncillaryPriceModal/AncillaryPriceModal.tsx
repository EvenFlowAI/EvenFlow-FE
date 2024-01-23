import React, {useMemo} from 'react';
import {useDialogStyles} from "../../../../../hooks/styling/useDialogStyles";
import {BaseModal, DialogContent, DialogTitle} from "../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../components/modals/BaseModal/types";
import {useTranslation} from "react-i18next";
import {ActionButtons} from "../../../ActionButtons/ActionButtons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EAncillaryType, EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {TCallback} from "../../../../../types/types";
import {
    setAddress,
    setZipCode
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useStyles} from "./styles";

type TDisplayAncillaryPriceProps = DialogProps & {
    onNext: TCallback;
    onVisitCenter: TCallback;
    onBackToSelectSlotsForVisitCenter: TCallback;
}

const AncillaryPriceModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TDisplayAncillaryPriceProps>>> = ({
                                                                          open,
                                                                          onClose,
                                                                          onNext,
                                                                          onVisitCenter,
                                                                          onBackToSelectSlotsForVisitCenter,
                                                                      }) => {
    const {
        serviceTypeOption,
        ancillaryPrice,
        appointmentByKey,
        serviceOptionChangedFromSlotPage,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const price = ancillaryPrice?.feeAmount && ancillaryPrice?.feeType === EAncillaryType.Amount ? `${ancillaryPrice?.feeAmount.toFixed(2)}` : `${ancillaryPrice?.feeAmount}%`
    const isSameServiceTypeOption = useMemo(() => {
        return appointmentByKey?.serviceTypeOption?.id === serviceTypeOption?.id
    }, [appointmentByKey, serviceTypeOption])

    const serviceString = serviceType === EServiceType.MobileService
        ? t("Mobile Service")
        : t("Pick Up / Drop Off Service");

    const restorePrevData = () => {
        if (appointmentByKey?.address) dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null))
        if (appointmentByKey?.address?.zipCode) dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ''))
    }

    const onBack = () => {
        if (serviceOptionChangedFromSlotPage) {
            onBackToSelectSlotsForVisitCenter()
        } else {
            customerLoadedData?.isUpdating
                ? isSameServiceTypeOption
                    ? restorePrevData()
                    : onClose()
                : onVisitCenter()
        }
        onClose();
    }

    const onSubmit = () => {
        onNext()
        onClose()
    }

    return (
        <BaseModal open={open} fullWidth  style={{paddingBottom: 20}} onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}} width={700}>
            <DialogTitle onClose={onClose}/>
            <DialogContent>
                <div className={classes.info}>
                    {t("For the location you entered, a convenience fee of")} {ancillaryPrice?.feeType === EAncillaryType.Amount ? "$" : ""}{price} {t("will be added to your service bill for the")} {" "}
                    {serviceString}.
                    <span className={classes.question}>
                        {t("Do you wish to proceed with the")} {serviceString}?
                    </span>
                </div>
            </DialogContent>
            <div className={classes.actionsWrapper}>
                <ActionButtons
                    onBack={onBack}
                    onNext={onSubmit}
                    nextLabel={`${t("Continue with")} ${serviceString}`}
                    prevLabel={customerLoadedData?.isUpdating && !serviceOptionChangedFromSlotPage ? t("Back") : t("Visit Center instead")}
                />
            </div>
        </BaseModal>
    );
};

export default AncillaryPriceModal;
