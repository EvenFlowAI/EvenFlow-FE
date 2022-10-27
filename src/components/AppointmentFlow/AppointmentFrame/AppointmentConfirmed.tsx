import React, {useEffect, useMemo} from 'react';
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
    selectCategoriesIds,
    selectService,
    selectSubService, setAdditionalServicesChosen, setAdvisor, setPackage, setTiming, setTransportation,
    setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {selectAppointment} from "../../../store/reducers/appointment/actions";

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
        srList,
        selectedSR,
        scProfile,
        s, ss,
        selectedPackage,
        customer,
        vehicle,
        allCategories,
        categoriesIds,
        serviceType,
        address,
        zipCode,
        valueService,
    ] = useSelector((state: RootState) => [
        state.appointment.appointment,
        state.appointment.serviceRequests,
        state.appointment.selectedSR,
        state.appointment.scProfile,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointmentFrame.customer,
        state.appointmentFrame.selectedVehicle,
        state.categories.allCategories,
        state.appointmentFrame.categoriesIds,
        state.appointmentFrame.serviceType,
        state.appointmentFrame.address,
        state.appointmentFrame.zipCode,
        state.appointmentFrame.valueService,
    ]);

    const {t} = useTranslation();
    const history = useHistory();
    const isFrame = window.top !== window.self;
    const {id} = useParams();
    const dispatch = useDispatch();
    const servicesList = useMemo(() => getMaintenanceDescription(srList, selectedSR, selectedPackage, allCategories, categoriesIds, valueService),
        [srList, selectedSR, selectedPackage, allCategories, categoriesIds, valueService])
    const vehicleData = vehicle?.year
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        : valueService?.year
            ? `${valueService?.year?.year} BMW ${valueService?.series?.name} ${valueService?.model?.name}`
            : ''

    useEffect(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Created Appointment',
            nonInteraction: true,
        })
        dispatch(setWelcomeScreenView("select"));
    }, [dispatch])

    const data: TItem[] = useMemo(() => {
        return [
            {
                label: t("Date and time"),
                content: appointment?.date.format('ddd, MMM D, h:mm A')
                    ?? moment.utc().format('ddd, MMM D, h:mm A'),
            },
            {
                label: serviceType === EServiceType.VisitCenter || address ? t("Address") : '',
                content: serviceType === EServiceType.VisitCenter
                    ? scProfile?.address
                        ? concatAddress(scProfile?.address)
                        : ""
                    : address ? `${address?.label ?? ""} ${zipCode ? zipCode : ""}` : "",
            },
            {
                label: servicesList?.length > 1 ? t("Services type") : t("Service type"),
                content: servicesList.map(item => <div>{item}</div>)
            },
            {
                label: t("Selected Price"),
                content: appointment?.price?.value
                    ? scProfile?.isRoundPrice
                        ? `$${appointment?.price?.value}`
                        : `$${appointment?.price?.value.toFixed(2)}`
                    : t('Will be quoted at the dealership')

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
            }
        ]
    }, [appointment, scProfile, s, ss, customer, vehicle, srList, selectedPackage, selectedSR]);

    const getPrice = (): string => {
        const price = appointment?.price?.value;
        return price
            ? `${t("Selected Price")}: $${scProfile?.isRoundPrice ? price : price.toFixed(2)}`
            : t('Service price will be quoted at dealership');
    }

    const handleAddToCalendar = () => {
        const date = moment.utc(appointment?.date);
        const url = getCalendarUrl({
            dates: [
                date.format(G_CALENDAR_FORMAT) + appointment?.time.split(":").join(""),
                date.add(1, "hour").format(G_CALENDAR_FORMAT) + appointment?.time.split(":").join("")],
            text: `${scProfile?.name} ${t("Service Appointment")}`,
            location: scProfile?.address ? concatAddress(scProfile?.address) : "",
            details: [
                `${t("Contact number")}: ${scProfile?.phoneNumber}\n`,
                ...data.slice(0, 2).map(r =>
                    `${r.label}: ${r.content}`
                ),
                `${t("Service type")}: ${servicesList.map(item => item.includes('Going') ? t('My Description Of Need') : item).join(', ')}`,
                getPrice(),
            ].join("\n"),
        });
        window.open(url);
    }

    const onMakeNew = () => {
        dispatch(setVehicle(null));
        dispatch(selectAppointment(null));
        dispatch(selectService(null));
        dispatch(selectSubService(null));
        dispatch(setTransportation(null));
        dispatch(setAdvisor(null));
        dispatch(selectCategoriesIds([]));
        dispatch(setAdditionalServicesChosen(false));
        dispatch(setPackage(null));
        dispatch(setTiming(null));
        history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
    }

    return <StepWrapper>
        <Paper>
            <Wrapper>
                <h2>Appointment Confirmed!</h2>
                {data.map(item => {
                    if (!selectedPackage && item.label === t("Selected Price")) {
                        return null;
                    }
                    return <React.Fragment key={item.label}>
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