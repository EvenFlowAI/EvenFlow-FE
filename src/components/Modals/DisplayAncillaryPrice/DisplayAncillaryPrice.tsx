import React, {useMemo} from 'react';
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {useTranslation} from "react-i18next";
import {Actions} from "../../AppointmentFlow/AppointmentFrame/Actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAncillaryType, EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {makeStyles} from "@material-ui/core/styles";
import {TCallback} from "../../../types/types";
import {
    setAddress,
    setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";

type TDisplayAncillaryPriceProps = DialogProps & {
    onNext: TCallback;
    onVisitCenter: TCallback;
    onBackToSelectSlotsForVisitCenter: TCallback;
}

const useStyles = makeStyles(theme => ({
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
    question: {
        marginTop: 20,
        textAlign: "center",
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        [`${theme.breakpoints.down("sm")} and (orientation: portrait)`]: {
            '& > div': {
                flexDirection: 'column',
                padding: '0 16px',
                '& > button:first-child': {
                    order: 2
                }
            }
        }
    }
}))

const DisplayAncillaryPrice: React.FC<TDisplayAncillaryPriceProps> = ({
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
                <Actions
                    onBack={onBack}
                    onNext={onSubmit}
                    nextLabel={`${t("Continue with")} ${serviceString}`}
                    prevLabel={customerLoadedData?.isUpdating && !serviceOptionChangedFromSlotPage ? t("Back") : t("Visit Center instead")}
                />
            </div>
        </BaseModal>
    );
};

export default DisplayAncillaryPrice;
