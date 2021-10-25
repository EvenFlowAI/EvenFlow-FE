import React, {useEffect, useMemo} from 'react';
import ReactGA from 'react-ga';
import {StepWrapper} from "./StepWrapper";
import {Button, styled} from "@material-ui/core";
import moment from "moment";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {concatAddress, getCalendarUrl} from "../../../utils/utils";
import {G_CALENDAR_FORMAT} from "../../../config/constants";
import {TCallback} from "../../../types/types";
import {getMaintenanceDescription} from "./uiUtils";


const Wrapper = styled('div')(({theme}) => ({
    boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
    padding: 20,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    fontSize: 15,
    [theme.breakpoints.up('sm')]: {
        minWidth: 545,
    },
    "& h2": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "0 0 10px",
        padding: 0,
        fontSize: 19,
        textAlign: 'center'
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
        vehicle
    ] = useSelector((state: RootState) => [
        state.appointment.appointment,
        state.appointment.serviceRequests,
        state.appointment.selectedSR,
        state.appointment.scProfile,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointmentFrame.customer,
        state.appointmentFrame.selectedVehicle
    ]);

    useEffect(() => {
        ReactGA.event({
            category: 'User',
            action: 'Created Appointment',
        })
    }, [])

    const data: TItem[] = useMemo(() => {
        return [
            {
                label: "Date and time",
                content: appointment?.date.format('ddd, MMM D, h:mm A')
                    ?? moment.utc().format('ddd, MMM D, h:mm A'),
            },
            {
                label: "Address",
                content: scProfile?.address ? concatAddress(scProfile?.address) : ""
            },
            {
                label: "Service type",
                content: getMaintenanceDescription(srList, selectedSR, selectedPackage, s, ss)
            },
            {
                label: "Selected Price",
                content: `$${appointment?.price?.value}`
            },
            {
                label: "Name",
                content: customer.fullName
            },
            {
                label: "Vehicle",
                content: `${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`
            },
            {
                label: "Phone number",
                content: customer.phoneNumber
            },
            {
                label: "Email",
                content: customer.email
            }
        ]
    }, [appointment, scProfile, s, ss, customer, vehicle, srList, selectedPackage, selectedSR]);

    const handleAddToCalendar = () => {
        const date = moment.utc(appointment?.date);
        const url = getCalendarUrl({
            dates: [
                date.format(G_CALENDAR_FORMAT) + appointment?.time.split(":").join(""),
                date.add(1, "hour").format(G_CALENDAR_FORMAT) + appointment?.time.split(":").join("")],
            text: `${scProfile?.name} Car Service Appointment`,
            location: scProfile?.address ? concatAddress(scProfile?.address) : "",
            details: [
                `Contact number: ${scProfile?.phoneNumber}\n`,
                ...data.slice(0, 4).map(r =>
                    `${r.label}: ${r.content}`
                )].join("\n")
        });
        window.open(url);
    }

    return <StepWrapper>
        <Wrapper>
            <h2>Appointment Confirmed!</h2>
            {data.map(item => {
                if (!selectedPackage && item.label === "Selected Price") {
                    return null;
                }
                return <React.Fragment key={item.label}>
                    <div className="label">{item.label}</div>
                    <div>{item.content}</div>
                </React.Fragment>;
            })}

            <Button color="primary" fullWidth variant="outlined" onClick={onModify}>
                Modify Appointment
            </Button>
            <Button color="primary" onClick={handleAddToCalendar} fullWidth variant="contained">
                Add to Calendar
            </Button>
            <Divider />
            <h3>We will see you soon !</h3>
        </Wrapper>
    </StepWrapper>
};