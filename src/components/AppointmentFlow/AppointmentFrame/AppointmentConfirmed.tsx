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
import {TArgCallback} from "../../../types/types";
import {getMaintenanceDescription} from "./uiUtils";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {Routes} from "../../../config/routes";
import {useHistory, useParams} from "react-router-dom";
import {
    clearAppointmentData,
    setCurrentFrameScreen, setServiceOptionChanged,
    setSideBarSteps,
    setUserType,
    setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useCurrentUser} from "../../../utils/hooks";
import {ILoadedVehicle} from "../../../api/types";
import {setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import {Loading} from "../../UI/Loading";

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

const ButtonsWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    marginBottom: 20,
})

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
    },
    "& > .emptyContainer": {
        width: '100%',
        minHeight: 300,
        minWidth: 300,
        gridColumn: '1 / 3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
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
    onUpdateAppointment: TArgCallback<ILoadedVehicle>;
}
export const AppointmentConfirmed: React.FC<TProps> = ({onUpdateAppointment}) => {
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
        customerLoadedData,
        isAppointmentSaving,
        appointmentByKey,
        transactionValue,
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
        state.appointment.customerLoadedData,
        state.appointmentFrame.isAppointmentSaving,
        state.appointmentFrame.appointmentByKey,
        state.appointmentFrame.transactionValue,
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

    const isServiceValetApp = useMemo(() => Boolean(serviceValetAppointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceValetAppointment, serviceTypeOption]);
    const isServiceValetManage = useMemo(() => !Boolean(appointment) && serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey,
        [appointment, serviceTypeOption]);
    // const appointmentPrice = appointmentRequestsPrices
    //     .reduce((prev, current) => prev + (current.priceValue ?? 0),0)

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

    const getAddressLabel = (): string => {
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Service Address");
            case EServiceType.PickUpDropOff:
                return t("Pick Up Address");
            default:
                return t("Address");
        }
    }

    const getPriceContent = (): string => {
        let price  = t('Will be quoted at the dealership');
        if (!Number.isNaN(transactionValue) && transactionValue > 0) {
            price = scProfile?.isRoundPrice
                ? `$${transactionValue}`
                : `$${transactionValue.toFixed(2)}`
        } else if (isServiceValetApp && serviceValetAppointment?.price?.value) {
            price = scProfile?.isRoundPrice
                ? `$${serviceValetAppointment?.price?.value}`
                : `$${serviceValetAppointment?.price?.value.toFixed(2)}`
        } else if (appointment?.price?.value) {
            price = scProfile?.isRoundPrice
                ? `$${appointment?.price?.value}`
                : `$${appointment?.price?.value.toFixed(2)}`
        }
        return price
    }

    const getDate = () => {
        if (isServiceValetApp) {
            return moment.utc(serviceValetAppointment?.date).format('ddd, MMM D')
        } else if (appointment) {
            return appointment?.date.format('ddd, MMM D, h:mm A')
        } else if (appointmentByKey?.dateInUtc) {
            if (appointmentByKey.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return moment(appointmentByKey.dateInUtc).utc().format('ddd, MMM D')
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(":")
                return moment(appointmentByKey.dateInUtc).utc().set('hour', +hh).set('minute', +mm).format('ddd, MMM D, h:mm A')
            }
        }
        return moment.utc().format('ddd, MMM D, h:mm A');
    }

    const insertPickUpTime = useCallback((list: TItem[]): TItem[] => {
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
        } else if (isServiceValetManage) {
            list.splice(
                1,
                0,
                {
                    label: t("Pick Up Time"),
                    content: `${moment.utc(appointmentByKey?.serviceValetTime?.pickUpMin, "HH:mm:ss").format('hh:mm A')}
            ${t("to")} ${moment.utc(appointmentByKey?.serviceValetTime?.pickUpMax, "HH:mm:ss").format('hh:mm A')}`
                }
            )
            if (dropOffSettings?.showDropOffTime && appointmentByKey?.serviceValetTime?.dropOffMin && appointmentByKey?.serviceValetTime?.dropOffMax) {
                list.splice(2, 0, {
                    label: t("Drop Off Time"),
                    content: `${moment.utc(appointmentByKey?.serviceValetTime?.dropOffMin, "HH:mm:ss").format('hh:mm A')}
            ${t("to")} ${moment.utc(appointmentByKey?.serviceValetTime?.dropOffMax, "HH:mm:ss").format('hh:mm A')}`
                })
            }
        }
        return list;
    }, [isServiceValetApp, serviceValetAppointment, dropOffSettings, isServiceValetManage, appointmentByKey])

    const data: TItem[] = useMemo(() => {
        const list: TItem[] = [
            {
                label: isServiceValetApp || isServiceValetManage
                    ? t("Date")
                    : t("Date and time"),
                content: getDate(),
            },
            {
                label: serviceType !== EServiceType.VisitCenter ? t("Location of service") : "",
                content: serviceType !== EServiceType.VisitCenter ? getServiceName() : ""
            },
            {
                label: getAddressLabel(),
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

        return insertPickUpTime(list);
    }, [ appointment, scProfile, s, ss, customer, vehicle, srList, selectedPackage, selectedSR,
        isServiceValetApp, isServiceValetManage, insertPickUpTime]);

    const getDateForUpdate = (): moment.Moment => {
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return moment.utc(appointmentByKey.dateInUtc)
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(':')
                return moment.utc(appointmentByKey.dateInUtc).set('hour', +hh).set('minute', +mm)
            }
        }
        return moment()
    }

    const date = serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
        ? moment.utc(serviceValetAppointment?.date)
        : customerLoadedData?.isUpdating && appointmentByKey
            ? appointment?.date
                ? moment.utc(appointment?.date)
                : getDateForUpdate()
            : moment.utc(appointment?.date)

    const getDateForCalendar = useCallback(() => {
        let dateString: string = '';
        if (isServiceValetApp) {
            dateString = moment(date).format('ddd, MMM D');
            const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(serviceValetAppointment?.pickUpMin, "HH:mm:ss").format('hh:mm A')} ${t("to")} ${moment.utc(serviceValetAppointment?.pickUpMax, "HH:mm:ss").format('hh:mm A')}`
            dateString = dateString.concat('\n')
            dateString = dateString.concat(pickUpTime)
        } else {
            if (serviceTypeOption?.type === EServiceType.PickUpDropOff && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                dateString = moment(date).format('ddd, MMM D');
                const pickUpMin = appointmentByKey?.serviceValetTime?.pickUpMin;
                const pickUpMax = appointmentByKey?.serviceValetTime?.pickUpMax;
                if (pickUpMin && pickUpMax) {
                    const pickUpTime = `${t("Pick Up Time")}: ${moment.utc(pickUpMin, "HH:mm:ss").format('hh:mm A')} ${t("to")} ${moment.utc(pickUpMax, "HH:mm:ss").format('hh:mm A')}`
                    dateString = dateString.concat('\n')
                    dateString = dateString.concat(pickUpTime)
                }
            } else {
                dateString = date.format('ddd, MMM D, h:mm A') ?? moment.utc().format('ddd, MMM D, h:mm A');
            }
        }
        return dateString;
    }, [isServiceValetApp, serviceValetAppointment, appointment, date, appointmentByKey, serviceTypeOption])

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
    }, [vehicleData, getServiceName, getDateForCalendar, isServiceValetApp, servicesList, advisor, scProfile, serviceTypeOption, getDateForCalendar])

    const handleAddToCalendar = () => {
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
        await dispatch(setServiceOptionChanged(false));
        await dispatch(setSideBarSteps([]));
        await dispatch(setWelcomeScreenView(currentUser ? "serviceCenterSelect" : "select"));
        history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
    }

    const onModify = async () => {
        if (vehicle) {
            if (customerLoadedData) {
                await dispatch(setCustomerLoadedData({...customerLoadedData, isUpdating: true}))
                await dispatch(clearAppointmentData())
                await dispatch(setServiceOptionChanged(false));
                await dispatch(setUserType(EUserType.Existing))
            }
            await onUpdateAppointment(vehicle)
            await dispatch(setCurrentFrameScreen("manageAppointment"))
        }
    }

    return <StepWrapper>
        <Paper>
            <Wrapper>
                <h2>Appointment Confirmed!</h2>
                {isAppointmentSaving
                    ? <div className="emptyContainer"><Loading/></div>
                    : data.filter(el => el.content).map((item, index) => {
                    if (!item.label.length && item.content.length) return null;
                    return <React.Fragment key={item.label + index}>
                        <div className="label">{item.label}</div>
                        <div>{item.content}</div>
                    </React.Fragment>;
                })}
            </Wrapper>
            <ButtonsWrapper>
                <Button color="primary" fullWidth variant="outlined" onClick={onModify} disabled={isAppointmentSaving}>
                    {t("Modify Appointment")}
                </Button>
                <Button color="primary" onClick={handleAddToCalendar} fullWidth variant="contained" disabled={isAppointmentSaving}>
                    {t("Add to Calendar")}
                </Button>
                <Divider />
            </ButtonsWrapper>
            { !isFrame ? <Button color="primary" fullWidth variant="outlined" onClick={onMakeNew} disabled={isAppointmentSaving}>
                {t("Make New Appointment")}
            </Button> : null}
            <h3>{t("We will see you soon!")}</h3>
        </Paper>
    </StepWrapper>
};