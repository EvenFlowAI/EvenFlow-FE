import React, {useEffect, useMemo} from 'react';
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EPricingDisplayType} from "../../../store/reducers/pricingSettings/types";
import {useTranslation} from "react-i18next";
import SelectedConsultant from "./SelectedAppointmentParts/SelectedConsultant";
import ServiceValetDateTime from "./SelectedAppointmentParts/ServiceValetDateTime";
import ServicesList from "./SelectedAppointmentParts/ServicesWithPrices";
import Prices from "./SelectedAppointmentParts/Prices";
import ServiceOption from "./SelectedAppointmentParts/ServiceOption";
import Address from "./SelectedAppointmentParts/Address";
import Info from "./SelectedAppointmentParts/Info";

const Wrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "3fr 2fr",
    gridGap: 10,
    alignItems: "stretch",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
        flexDirection: "column"
    }
}))

const List = styled('ul')(({theme}) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "18px",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
        alignSelf: "flex-start",
        gap: "10px",
        width: "100%",
    },
    "& .service-item": {
        textTransform: "capitalize",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            "& .price": {
                fontSize: 20,
                fontWeight: "bold",
                "&>span": {
                    fontSize: 14
                }
            },
        },
        "& .service-list": {
            display: 'block',
            maxHeight: 120,
            overflow: "auto",
            padding: '8px 8px 8px 0',
        }
    },
    "& ul": {
        listStyle: "none",
        marginTop: -10,
        "&>li": {
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 14,
            "&:hover": {
                textDecoration: "none"
            }
        }
    }
}));

const PriceWrapper = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    textAlign: "right",
    [theme.breakpoints.down("sm")]: {
        alignItems: "flex-start",
    },
    "& .price": {
        fontSize: 24,
        fontWeight: "bold",
        "&>span": {
            fontSize: 18
        }
    },
    "& .info": {
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        color: "#008331",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: 'uppercase',
        [theme.breakpoints.down("sm")]: {
            marginTop: 5
        }
    },
}));

export const useSelectedAppointmentStyles = makeStyles(theme => ({
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: 5,
        },
        [theme.breakpoints.down("sm")]: {
            '& > div > div': {
                padding: 5
            }
        },
    },
    select: {
        width: '100%',
        marginLeft: 10,
        borderRadius: 0,
        '&:before': {
            display: 'none',
        },
        '& > div': {
            '&:focus': {
                backgroundColor: 'transparent'
            }
        },
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        margin: '0 0 10px 0',
        textTransform: 'uppercase'
    }
}))

export const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
        marginTop: 8,
        textAlign: "left",
    }
}))

export const SelectedAppointment = () => {
    const {serviceType, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, appointmentSlots, appointment, serviceValetAppointment, serviceValetSlots} = useSelector((state: RootState) => state.appointment);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

    const dispatch = useDispatch();
    const classes = useSelectedAppointmentStyles();
    const theme = useTheme();
    const {t} = useTranslation();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    const price = serviceTypeOption?.type === EServiceType.PikUpDropOff && serviceValetAppointment
        ? serviceValetAppointment?.price.value ?? 0
        : appointment?.price.value ?? 0;
    const ancillaryPrice = serviceTypeOption?.type === EServiceType.PikUpDropOff && serviceValetAppointment
        ? serviceValetAppointment?.price.ancillaryPrice ?? 0
        : appointment?.price.ancillaryPrice ?? 0;

    const isDynamicPricing = serviceTypeOption?.type === EServiceType.PikUpDropOff
        ? serviceValetSlots.length
            ? serviceValetSlots[0]?.serviceRequestPrices?.find(item => item.pricingDisplayType === EPricingDisplayType.Dynamic)
            : false
        : appointmentSlots.length
            ? appointmentSlots[0]?.serviceRequestPrices?.find(item => item.pricingDisplayType === EPricingDisplayType.Dynamic)
            : false;

    useEffect(() => {
        scProfile && dispatch(loadCategoriesByQuery(scProfile.id))
    }, [scProfile])

    return (
        <div>
            <Wrapper>
                <div>
                    {!isSm && <p className={classes.title}>{t("Your selections")}</p>}
                <List>
                    <li className={"service-item"} key="service-item">
                       <ServicesList/>
                        { isSm && Boolean(price) &&
                        <Prices price={price} ancillaryPrice={ancillaryPrice}/> }
                    </li>
                    <li key="advisor">
                        <SelectedConsultant currentConfig={currentConfig}/>
                        <Address />
                        <ServiceOption isSm={isSm}/>
                        {appointment && isSm
                            ? <DateWrapper>
                            {appointment.date.format('MMMM D, h:mm A')}
                        </DateWrapper>
                            : serviceValetAppointment && isSm
                                ? <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment}/>
                                : null}
                    </li>
                </List>
                </div>
                <PriceWrapper>
                    {appointment && !isSm
                        ? <DateWrapper>
                            {t("Date & Time")}: <br /> {appointment.date.format('MMMM D, h:mm A')}
                        </DateWrapper>
                        : serviceValetAppointment && !isSm
                            ? <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment}/>
                            : null}
                    <React.Fragment>
                        {!isSm && Boolean(price) && <Prices price={price} ancillaryPrice={ancillaryPrice}/>}
                        {/*todo uncomment for offer new functionality*/}
                        {/*{!isSm && Boolean(appointment?.serviceRequestPrices?.find(sr => sr.offer)) ? <div className="offerLabel">*/}
                        {/*  <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
                        {/*</div> : null}*/}
                        <Info/>
                    </React.Fragment>
                </PriceWrapper>
            </Wrapper>
        </div>
    );
};