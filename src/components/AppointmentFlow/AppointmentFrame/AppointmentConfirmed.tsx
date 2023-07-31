import React, {useCallback, useEffect, useMemo} from 'react';
//import ReactGA from 'react-ga4';
import ReactGA from 'react-ga';
import {StepWrapper} from "./StepWrapper";
import {Button, styled} from "@material-ui/core";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {concatAddress, getCalendarUrl} from "../../../utils/utils";
import {G_CALENDAR_FORMAT} from "../../../config/constants";
import {TCallback} from "../../../types/types";
import {getMaintenanceDescription} from "./uiUtils";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {Routes} from "../../../config/routes";
import {useHistory, useParams} from "react-router-dom";
import {
    clearAppointmentData, setSideBarSteps,
    setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useCurrentUser} from "../../../utils/hooks";

const Paper = styled('div')(({theme}) => ({
    boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
    padding: 20,
    fontSize: 15,
    [theme.breakpoints.up('sm')]: {
        minWidth: 545,
    },
    "& h3": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "10px 0 0",
        padding: 0,
        fontSize: 24,
        textAlign: 'center'
    },
}))

const Wrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    marginBottom: 20,
    "& h2": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "0 0 10px",
        padding: 0,
        fontSize: 19,
        textAlign: 'center'
    },
    "&>div": {
        textAlign: "right"
    },
    "&>.label": {
        textAlign: "left",
        textTransform: "uppercase",
        color: "#9FA2B4",
        fontWeight: "bold"
    }
}));

const Divider = styled("div")(({theme}) => ({
    width: "100%",
    height: 2,
    gridColumnStart: 1,
    gridColumnEnd: 3,
    marginTop: 16,
    background: `repeating-linear-gradient(to right,
        ${theme.palette.divider} 0,${theme.palette.divider} 10px,
        transparent 10px,
        transparent 20px)`
}));

type TItem = {
    label: string;
    content: string|JSX.Element[];
}


type TProps = {
    onModify: TCallback;
}
export const AppointmentConfirmed: React.FC<TProps> = ({onModify}) => {
    const [
        appointment,
        serviceValetAppointment,
        srList,
        selectedSR,
        scProfile,
        s, ss,
        selectedPackage,
        packagePricingType,
        packageEMenuType,
        customer,
        vehicle,
        allCategories,
        categoriesIds,
        serviceTypeOption,
        address,
        zipCode,
        valueService,
        engineTypes,
        selectedRecalls,
        advisor,
        packagePriceTitles,
        dropOffSettings,
    ] = useSelector((state: RootState) => [
        state.appointment.appointment,
        state.appointment.serviceValetAppointment,
        state.appointment.serviceRequests,
        state.appointment.selectedSR,
        state.appointment.scProfile,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointmentFrame.packagePricingType,
        state.appointmentFrame.packageEMenuType,
        state.appointmentFrame.customer,
        state.appointmentFrame.selectedVehicle,
        state.categories.allCategories,
        state.appointmentFrame.categoriesIds,
        state.appointmentFrame.serviceTypeOption,
        state.appointmentFrame.address,
        state.appointmentFrame.zipCode,
        state.appointmentFrame.valueService,
        state.vehicleDetails.engineTypes,
        state.appointmentFrame.selectedRecalls,
        state.appointmentFrame.advisor,
        state.appointmentFrame.packagePriceTitles,
        state.appointment.dropOffSettings,
    ]);

    const {t} = useTranslation();
    const history = useHistory();
    const isFrame = window.top !== window.self;
    const {id} = useParams();
    const dispatch = useDispatch();
    const currentUser = useCurrentUser();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const servicesList = useMemo(() => {
            return getMaintenanceDescription(
                srList,
                selectedRecalls,
                packagePriceTitles,
                selectedSR,
                selectedPackage,
                allCategories,
                categoriesIds,
                valueService,
                packagePricingType,
                packageEMenuType,
                scProfile?.maintenancePackageOptionTypes
            )
        },
        [srList, selectedSR, selectedRecalls, selectedPackage, allCategories, packagePriceTitles, categoriesIds,
            valueService, packagePricingType, packageEMenuType, scProfile])

    const engine = useMemo(() => engineTypes.find(item => item.id === Number(vehicle?.engineTypeId)), [engineTypes, vehicle])

    const vehicleData = vehicle?.year
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${engine?.name ?? ""}`
        : valueService?.year
            ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
            : ''

    const isServiceValetApp = useMemo(() => !!serviceValetAppointment && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption])

    useEffect(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Created Appointment',
            nonInteraction: true,
        })
        dispatch(setWelcomeScreenView("select"));
    }, [dispatch])

    const getServiceName = () => {
        if (serviceTypeOption?.name) return serviceTypeOption?.name;
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PickUpDropOff:
                return t("Pick Up / Drop Off Service");
            default:
                return t("Visit Center");
        }
    }

    const getAddress = (): string => {
        if (serviceType === EServiceType.VisitCenter) {
            return scProfile?.address ? concatAddress(scProfile?.address) : ""
        } else {
            return address ? `${typeof address === 'string' ? address : address?.label ?? ""} ${zipCode ? zipCode : ""}` : ""
        }
    }

    const getPriceContent = (): string => {
        if (isServiceValetApp && serviceValetAppointment?.price?.value) {
            return scProfile?.isRoundPrice
                ? `$${serviceValetAppointment?.price?.value}`
                : `$${serviceValetAppointment?.price?.value.toFixed(2)}`
        }
        if (appointment?.price?.value) {
            return scProfile?.isRoundPrice
                ? `$${appointment?.price?.value}`
                : `$${appointment?.price?.value.toFixed(2)}`
        }
        return t('Will be quoted at the dealership')
    }

    const getDate = () => {
        return isServiceValetApp
            ? moment.utc(serviceValetAppointment?.date).format('ddd, MMM D')
            : appointment?.date.format('ddd, MMM D, h:mm A')
            ?? moment.utc().format('ddd, MMM D, h:mm A');
    }

    const data: TItem[] = useMemo(() => {
        const list: TItem[] = [
            {
                label: isServiceValetApp ? t("Date") : t("Date and time"),
                content: getDate(),
            },
            {
                label: serviceType !== EServiceType.VisitCenter ? t("Location of service") : "",
                content: serviceType !== EServiceType.VisitCenter ? getServiceName() : ""
            },
            {
                label: serviceType === EServiceType.VisitCenter || address ? t("Address") : '',
                content: getAddress(),
            },
            {
                label: servicesList?.length > 1 ? t("Services type") : t("Service type"),
                content: servicesList.map(item => <div>{item}</div>)
            },
            {
                label: t("Selected Price"),
                content: getPriceContent(),
            },
            {
                label: t("Name"),
                content: customer.fullName
            },
            {
                label: t("Vehicle"),
                content: vehicleData,
            },
            {
                label: t("Phone number"),
                content: customer.phoneNumber
            },
            {
                label: t("Email"),
                content: customer.email
            },
        ]
        if (isServiceValetApp) {
            list.splice(
                1,
                0,
                {
                    label: t("Pick Up Time"),
                    content: `${moment.utc(serviceValetAppointment?.pickUpMin, "HH:mm:ss").format('hh:mm A')}
            ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, "HH:mm:ss").format('hh:mm A')}`
                }
            )
            if (dropOffSettings?.showDropOffTime && serviceValetAppointment?.dropOffMin && serviceValetAppointment?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${moment.utc(serviceValetAppointment?.dropOffMin, "HH:mm:ss").format('hh:mm A')}
            ${t("to")} ${moment.utc(serviceValetAppointment?.dropOffMax, "HH:mm:ss").format('hh:mm A')}`
                })
            }
        }
        return list;
    }, [appointment, scProfile, s, ss, customer, vehicle, srList, selectedPackage, selectedSR, serviceValetAppointment, serviceTypeOption]);

    const getDateForCalendar = useCallback(() => {
        let dateString: string = '';
        if (isServiceValetApp) {
            dateString = moment(serviceValetAppointment?.date).format('ddd, MMM D');
            const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(serviceValetAppointment?.pickUpMin, "HH:mm:ss").format('hh:mm A')} ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, "HH:mm:ss").format('hh:mm A')}`
            dateString = dateString.concat('\n')
            dateString = dateString.concat(pickUpTime)
        } else {
            dateString = appointment?.date.format('ddd, MMM D, h:mm A') ?? moment.utc().format('ddd, MMM D, h:mm A');
        }
        return dateString;
    }, [isServiceValetApp, serviceValetAppointment, appointment])

    const calendarData: TItem[] = useMemo(() => {
        const data = [
        {
            label: t('VEHICLE DETAILS'),
            content: vehicleData,
        },
        {
            label: t('SERVICE OPTION'),
            content: getServiceName()
        },
        {
            label: t('SELECTED DATE & TIME'),
            content: getDateForCalendar(),
        },
        {
            label: t('SERVICE REQUESTS'),
            content: servicesList.map(item => item.includes('Going') ? t('My Description Of Need') : item).join(', '),
        },
        {
            label: t('APPOINTMENT DETAILS'),
            content: `Service Advisor: ${advisor?.name ?? t('Any Advisor')}`
        },
        {
            label: t('DEALERSHIP CONTACT NUMBER'),
            content: scProfile?.phoneNumber ?? '',
        }
    ];
        if (serviceTypeOption?.type === EServiceType.MobileService) {
            data.splice(4, 1);
        }
        return data
    }, [vehicleData, getServiceName, getDateForCalendar, isServiceValetApp, servicesList, advisor, scProfile, serviceTypeOption])

    const handleAddToCalendar = () => {
        const date = isServiceValetApp
            ? moment.utc(serviceValetAppointment?.date)
            : moment.utc(appointment?.date);
        const url = getCalendarUrl({
            dates: [
                date.format(G_CALENDAR_FORMAT) + `${isServiceValetApp ? "000000" : appointment?.time.split(":").join("")}`,
                date.add(1, "hour").format(G_CALENDAR_FORMAT) + `${isServiceValetApp ? "000000" : appointment?.time.split(":").join("")}`],
            text: `${scProfile?.name} ${t("Service Appointment")}`,
            location: scProfile?.address ? concatAddress(scProfile?.address) : "",
            details: calendarData.map(r => `${r.label}:\n${r.content}`).join("\n \n"),
        });
        window.open(url);
    }

    const onMakeNew = async () => {
        await dispatch(setVehicle(null));
        await dispatch(clearAppointmentData());
        await dispatch(setSideBarSteps([]));
        await dispatch(setWelcomeScreenView(currentUser ? "serviceCenterSelect" : "select"));
        history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
    }

    return <StepWrapper>
        <Paper>
            <Wrapper>
                <h2>Appointment Confirmed!</h2>
                {data.filter(el => el.content).map((item, index) => {
                    if (!selectedPackage && item.label === t("Selected Price")) {
                        return null;
                    }
                    if (!item.label.length && item.content.length) return null;
                    return <React.Fragment key={item.label + index}>
                        <div className="label">{item.label}</div>
                        <div>{item.content}</div>
                    </React.Fragment>;
                })}

                <Button color="primary" fullWidth variant="outlined" onClick={onModify}>
                    {t("Modify Appointment")}
                </Button>
                <Button color="primary" onClick={handleAddToCalendar} fullWidth variant="contained">
                    {t("Add to Calendar")}
                </Button>
                <Divider />
            </Wrapper>
            { !isFrame ? <Button color="primary" fullWidth variant="outlined" onClick={onMakeNew}>
                {t("Make New Appointment")}
            </Button> : null}
            <h3>{t("We will see you soon!")}</h3>
        </Paper>
    </StepWrapper>
};