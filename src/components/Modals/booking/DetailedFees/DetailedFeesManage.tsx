import React, {useMemo} from 'react';
import {DialogContent, DialogTitle} from "../../../BaseModal/BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {DialogProps} from "../../../BaseModal/types";
import {Dialog} from "@material-ui/core";
import {ErrorOutline} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import {EOfferType} from "../../../../store/reducers/offers/types";
import {getOfferString} from "../../../AppointmentFlow/AppointmentFrame/utils";
import {DetailedFeesInfo, DetailedFeesList, useStyles} from "./styles";
import {useDialogStyles} from "../../../../commonStyles/useDialogStyles";

const DetailedFeesManage: React.FC<DialogProps> = ({ open, onClose, }) => {
    const { scProfile} = useSelector((state: RootState) => state.appointment);
    const { appointmentRequestsPrices} = useSelector((state: RootState) => state.appointmentFrame);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();

    const noDefinedPriceExists = useMemo(() => {
            return appointmentRequestsPrices.find(item => typeof item.priceValue === 'undefined' || item.priceValue === 0)
        },
        [appointmentRequestsPrices])

    const price = appointmentRequestsPrices
        .reduce((prev, current) => prev + (current.priceValue ?? 0),0)

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                {t("Selected Price")}:   {price}
            </DialogTitle>
            <DialogContent>
                <DetailedFeesList>
                    {appointmentRequestsPrices?.map(item => (
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
                </DetailedFeesList>
                {noDefinedPriceExists && <DetailedFeesInfo>
                    <ErrorOutline/>
                    <span className="text">{t("Service item will be quoted at dealership")}</span>
                </DetailedFeesInfo>}

            </DialogContent>
        </Dialog>
    );
};

export default DetailedFeesManage;