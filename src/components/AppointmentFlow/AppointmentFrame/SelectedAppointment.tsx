import React, {useEffect, useMemo, useState} from 'react';
import {MenuItem, Select, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getMaintenanceDescription} from "./uiUtils";
import {
    setAdvisor,
    setServiceType,
    setServiceTypeOption
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {EServiceCenterName} from "../../../api/types";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EPricingDisplayType} from "../../../store/reducers/pricingSettings/types";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {IServiceValetAppointment} from "../../../store/reducers/appointment/types";


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

const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
        marginTop: 8,
        textAlign: "left",
    }
}))

const useStyles = makeStyles(theme => ({
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

type TDropOffTime = {
    hoursDMin: string;
    minutesDMin: string;
    hoursDMax: string;
    minutesDMax: string;
}

const ServiceValetDateTime: React.FC<{serviceValetAppointment: IServiceValetAppointment}> = ({serviceValetAppointment}) => {
    const { dropOffSettings } = useSelector((state: RootState) => state.appointment);
    const [dropOffTime, setDropOffTime] = useState<TDropOffTime|null>(null);
    const [hoursPMin, minutesPMin] = serviceValetAppointment.pickUpMin.split(":");
    const [hoursPMax, minutesPMax] = serviceValetAppointment.pickUpMax.split(":");

    useEffect(() => {
        if (serviceValetAppointment.dropOffMax && serviceValetAppointment.dropOffMin) {
            setDropOffTime({
                hoursDMin: serviceValetAppointment.dropOffMin.split(":")[0],
                minutesDMin: serviceValetAppointment.dropOffMin.split(":")[1],
                hoursDMax: serviceValetAppointment.dropOffMax.split(":")[0],
                minutesDMax: serviceValetAppointment.dropOffMax.split(":")[1],
            })
        }
    }, [serviceValetAppointment])

    return <DateWrapper>
        <div>Date: <span>{moment.utc(serviceValetAppointment.date).format('MMMM D')}</span></div>
        <div>Pick Up Time:
            <span> {moment(serviceValetAppointment.date).set('hour', +hoursPMin).set('minute', +minutesPMin).format("hh:mm A")} to {moment(serviceValetAppointment.date).set('hour', +hoursPMax).set('minute', +minutesPMax).format("hh:mm A")}</span>
        </div>
        {dropOffSettings?.showDropOffTime && dropOffTime
            ? <div>Drop Off Time:
                <span> {moment(serviceValetAppointment.date).set('hour', +dropOffTime.hoursDMin).set('minute', +dropOffTime.minutesDMin).format("hh:mm A")} to {moment(serviceValetAppointment.date).set('hour', +dropOffTime.hoursDMax).set('minute', +dropOffTime.minutesDMax).format("hh:mm A")}</span>
            </div>
            : null}
    </DateWrapper>
}

export const SelectedAppointment = () => {
    const {
        selectedPackage,
        packagePricingType,
        packagePriceTitles,
        advisor,
        consultants,
        categoriesIds,
        serviceType,
        serviceTypeOption,
        address,
        zipCode,
        valueService,
        selectedRecalls,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, appointmentSlots, appointment, serviceValetAppointment, serviceValetSlots } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const {t} = useTranslation();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const selectedServices = useMemo(() => getMaintenanceDescription(srList, selectedRecalls, packagePriceTitles, selectedSR, selectedPackage, allCategories, categoriesIds, valueService, packagePricingType),
        [srList, selectedSR, selectedPackage, allCategories, categoriesIds, valueService, packagePricingType])
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])
    const selectedPrevServiceOption = useMemo(() => serviceTypeOption, []);

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

    const handleConsultantChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        if (isBmWService && e.target.value !== advisor?.id) {
            dispatch(selectAppointment(null));
            dispatch(selectServiceValetAppointment(null));
        }
        dispatch(setAdvisor(consultant ? consultant : null))
    }

    const handleServiceOptionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        if (e.target.value === EServiceType.PikUpDropOff) {
            dispatch(selectAppointment(null))
        } else {
            dispatch(selectServiceValetAppointment(null));
        }
        const option = firstScreenOptions.find(item => item.id === e.target.value);
        if (option) {
            dispatch(setServiceTypeOption(option));
            dispatch(setServiceType(option.type))
        }
    }


    useEffect(() => {
        scProfile && dispatch(loadCategoriesByQuery(scProfile.id))
    }, [scProfile])

    const getServiceName = () => {
        if (serviceTypeOption?.name) return serviceTypeOption.name
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PikUpDropOff:
                return t("Pick Up / Drop Off Service");
            default:
                return t("Visit Center");
        }
    }

    return (
        <div>
            <Wrapper>
                <div>
                    {!isSm && <p className={classes.title}>{t("Your selections")}</p>}
                <List>
                    <li className={"service-item"} key="service-item">
                        <div className="service-list">
                            {selectedServices.map(item => <div key={item}>{item}</div>)}
                        </div>
                        { isSm && Boolean(price) &&
                        <div className="price">
                          ${scProfile?.isRoundPrice ? price + ancillaryPrice : (price + ancillaryPrice).toFixed(2)}
                        </div> }
                    </li>
                    <li key="advisor">
                        {currentConfig?.advisorSelection && consultants.length
                            ? <div className={classes.selectWrapper}>
                                <div className={classes.selectWrapper}>
                                    {t("Advisor")}: {isSm ? <br/> : null}
                                    <Select
                                        value={advisor?.id || "Any"}
                                        className={classes.select}
                                        disabled={currentConfig && !currentConfig?.advisorSelection || !consultants.length}
                                        onChange={handleConsultantChange}>
                                        {consultants
                                            .map(consultant => <MenuItem value={consultant.id} key={consultant.name}>{consultant.name}</MenuItem>)
                                            .concat([<MenuItem value="Any" key="any">{t("Any Available")}</MenuItem>])}
                                    </Select>
                                </div>
                            </div>
                            : null}
                        {serviceType !== EServiceType.VisitCenter && address
                            ? <div className="service-list">
                                <h4> {t("YOUR ADDRESS")}: <div>{`${typeof address === "string" ? address : address?.label}` || ""}{zipCode ? `, ${zipCode}` : ""}</div></h4>
                            </div>
                            : null}
                        {selectedPrevServiceOption?.type !== EServiceType.VisitCenter
                            ? selectedPrevServiceOption?.type === EServiceType.PikUpDropOff
                                ? <div className={classes.selectWrapper}>
                                <div className={classes.selectWrapper}>
                                    {t("PROVIDED BY OUR")}: {isSm ? <br/> : null}
                                    <Select
                                        value={serviceTypeOption?.id}
                                        className={classes.select}
                                        onChange={handleServiceOptionChange}>
                                        {firstScreenOptions
                                            .filter(option => option.type === EServiceType.PikUpDropOff || option.type === EServiceType.VisitCenter)
                                            .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)}
                                    </Select>
                                </div>
                            </div>
                                : <div className="service-list" style={{marginBottom: 10, marginTop: 20}}>
                                <div>{t("PROVIDED BY OUR")}: {getServiceName()}</div>
                            </div>
                            : null
                        }
                        {appointment && isSm ? <DateWrapper>
                            {appointment.date.format('MMMM D, h:mm A')}
                        </DateWrapper> : null}
                        {serviceValetAppointment && isSm ? <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment}/> : null}
                    </li>

                </List>
                </div>
                <PriceWrapper>
                    {appointment && !isSm
                        ? <DateWrapper>
                            {t("Date & Time")}: <br /> {appointment.date.format('MMMM D, h:mm A')}
                        </DateWrapper>
                        : null}
                    {serviceValetAppointment && !isSm ? <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment}/> : null}
                    <>
                        {!isSm && Boolean(price) && <div className="price">
                          ${scProfile?.isRoundPrice ? price + ancillaryPrice : (price + ancillaryPrice).toFixed(2)}
                        </div>}
                        {/*todo uncomment for offer new functionality*/}
                        {/*{!isSm && Boolean(appointment?.serviceRequestPrices?.find(sr => sr.offer)) ? <div className="offerLabel">*/}
                        {/*  <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
                        {/*</div> : null}*/}
                        {isDynamicPricing && serviceTypeOption?.type !== EServiceType.PikUpDropOff && (
                            <div className="info">
                                {!appointment?.price?.amountOfSavingMoney
                                    ? t("Save by booking at off peak times!")
                                    : `${t("Off Peak Savings Of")} $${appointment.price.amountOfSavingMoney.toFixed(2)}`}
                            </div>
                        )}
                    </>
                </PriceWrapper>
            </Wrapper>
        </div>
    );
};