import React, {useMemo} from 'react';
import {DialogContent, DialogTitle} from "../../../../../components/modals/BaseModal/BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {DialogProps} from "../../../../../components/modals/BaseModal/types";
import {Dialog} from "@mui/material";
import {ErrorOutline} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {EOfferType} from "../../../../../store/reducers/offers/types";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {DetailedFeesInfo, DetailedFeesList, useStyles} from "./styles";
import {useDialogStyles} from "../../../../../hooks/styling/useDialogStyles";
import {getOfferString} from "../../../../../utils/utils";

const DetailedFees: React.FC<DialogProps> = ({ open, onClose, }) => {
    const {appointment, scProfile, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const { serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const price = useMemo(() => {
            if (serviceValetAppointment && serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return serviceValetAppointment?.price?.value && serviceValetAppointment.price.value > 0
                    ? `$${scProfile?.isRoundPrice
                        ? serviceValetAppointment.price.value + serviceValetAppointment.price.ancillaryPrice
                        : (serviceValetAppointment.price.value + serviceValetAppointment.price.ancillaryPrice).toFixed(2)}`
                    : ''
            }
            return appointment?.price?.value && appointment.price.value > 0
                ? `$${scProfile?.isRoundPrice
                    ? appointment.price.value + appointment.price.ancillaryPrice
                    : (appointment.price.value + appointment.price.ancillaryPrice).toFixed(2)}`
                : ''
        },
        [appointment, serviceValetAppointment, serviceTypeOption])
    const noDefinedPriceExists = useMemo(() => {
            if (serviceValetAppointment && serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return serviceValetAppointment?.serviceRequestPrices?.find(item => typeof item.priceValue === 'undefined' || item.priceValue === 0)
            }
            return appointment?.serviceRequestPrices?.find(item => typeof item.priceValue === 'undefined' || item.priceValue === 0)
        },
        [appointment, serviceValetAppointment, serviceTypeOption])

    const getServiceName = () => {
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PickUpDropOff:
                return t("Pick Up / Drop Off Service");
            default:
                return t("Visit Center");
        }
    }

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                {t("Selected Price")}:   {price}
            </DialogTitle>
            <DialogContent>
                <DetailedFeesList>
                    {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
                        ? serviceValetAppointment?.serviceRequestPrices?.map(item => (
                            <li className={classes.item} key={item.requestName}>
                            <span>
                                {item.requestName.includes("Going")
                                    ? t("My Description of Needs")
                                    : item.requestName}
                            </span>
                                <div className={classes.pricesBlock}>
                                    {Object(item).hasOwnProperty('priceValue') && item.priceValue
                                        ? <span className={classes.price}>
                                    ${scProfile?.isRoundPrice
                                            ? item.priceValue
                                            : item.priceValue.toFixed(2)}
                            </span>
                                        : <ErrorOutline/>}
                                </div>
                            </li>))
                    : appointment?.serviceRequestPrices?.map(item => (
                        <li className={classes.item} key={item.requestName}>
                            <span>
                                {item.requestName.includes("Going")
                                    ? t("My Description of Needs")
                                    : item.requestName}
                            </span>
                            <div className={classes.pricesBlock}>
                                {item.offer
                                    ? <span className={item?.offer?.type === EOfferType.FreeService ? classes.offersText : classes.offersPrice}>
                                       {getOfferString(item.offer, Boolean(scProfile?.isRoundPrice))}
                                </span>
                                    : null}
                                {Object(item).hasOwnProperty('priceValue') && item.priceValue
                                    ? <span className={classes.price}>
                                    ${scProfile?.isRoundPrice
                                        ? item.priceValue
                                        : item.priceValue.toFixed(2)}
                            </span>
                                    : <ErrorOutline/>}
                            </div>
                        </li>))}
                    {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
                        ? <li className={classes.item} key="serviceType">
                            <span>
                               {getServiceName()}
                            </span>
                            <div className={classes.pricesBlock}>
                                    <span className={classes.price}>
                                    ${scProfile?.isRoundPrice
                                        ? serviceValetAppointment?.price.ancillaryPrice
                                        : serviceValetAppointment?.price.ancillaryPrice.toFixed(2)}
                            </span>
                            </div>
                        </li>
                    : appointment?.price.ancillaryPrice && serviceType !== EServiceType.VisitCenter
                        ? <li className={classes.item} key="serviceType">
                            <span>
                               {getServiceName()}
                            </span>
                            <div className={classes.pricesBlock}>
                                    <span className={classes.price}>
                                    ${scProfile?.isRoundPrice
                                        ? appointment?.price.ancillaryPrice
                                        : appointment?.price.ancillaryPrice.toFixed(2)}
                            </span>
                            </div>
                        </li>
                        : null}
                </DetailedFeesList>
                {noDefinedPriceExists && <DetailedFeesInfo>
                  <ErrorOutline/>
                  <span className="text">{t("Service item will be quoted at dealership")}</span>
                </DetailedFeesInfo>}

            </DialogContent>
        </Dialog>
    );
};

export default DetailedFees;