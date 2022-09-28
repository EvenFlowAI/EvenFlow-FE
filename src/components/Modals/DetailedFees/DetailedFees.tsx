import React, {useMemo} from 'react';
import {DialogContent, DialogTitle} from "../BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {DialogProps} from "../types";
import {Dialog, styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ErrorOutline} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import {EOfferType, offerTypes} from "../../../store/reducers/offers/types";

const List = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    marginBottom: 20,
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    background: 'white',
    "& .service-item": {
        textTransform: "capitalize"
    }
});

const Info = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    padding: 0,
    "& > .text": {
        marginLeft: 10,
    }
});

const useStyles = makeStyles(() => ({
    item: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 24px',

        "&:not(last-child)": {
            borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
        }
    },
    price: {
        width: '20%',
        fontWeight: 600,
        fontSize: 16,
        textAlign: 'end',
    },
    pricesBlock: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    offersPrice: {
        color: '#008331',
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 12,
    },
    offersText: {
        color: '#008331',
        fontSize: 14,
        fontWeight: 400,
        marginLeft: 12,
    }
}))

const useDialogStyles = makeStyles({
    root: {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 11,
            fontSize: 14
        },
    },
    dialogTitle: {
        textAlign: "left",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold"
        }
    },
    dialogContent: {
        padding: "10px 25px"
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    },
    dialogPaper: {
        backgroundColor: '#E5E5E5',
        maxWidth: 525,
        paddingBottom: 24,
    }
});

const DetailedFees: React.FC<DialogProps> = ({ open, onClose, }) => {
    const {appointment, scProfile} = useSelector((state: RootState) => state.appointment);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();
    const {t} = useTranslation();
    const price = useMemo(() => appointment?.price?.value && appointment.price.value > 0
            ? `$${scProfile?.isRoundPrice
                ? appointment.price.value
                : appointment.price.value.toFixed(2)}`
            : '',
        [appointment])
    const noDefinedPriceExists = useMemo(() => appointment?.serviceRequestPrices?.find(item => typeof item.priceValue === 'undefined' || item.priceValue === 0),
        [appointment])

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                {t("Selected Price")}:   {price}
            </DialogTitle>
            <DialogContent>
                <List>
                    {appointment?.serviceRequestPrices?.map(item => (
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
                                {item.offer
                                    ? <span className={item?.offer?.type === EOfferType.FreeService ? classes.offersText : classes.offersPrice}>
                                       {item?.offer?.type === EOfferType.AmountOff ? '$' : ''}{item?.offer?.valueOff ?? ''} {(item?.offer && item?.offer?.type !== EOfferType.AmountOff) ? offerTypes[item?.offer?.type].label : ''}
                                </span>
                                    : null}
                            </div>
                        </li>))}
                </List>
                {noDefinedPriceExists && <Info>
                  <ErrorOutline/>
                  <span className="text">{t("Service item will be quoted at dealership")}</span>
                </Info>}

            </DialogContent>
        </Dialog>
    );
};

export default DetailedFees;