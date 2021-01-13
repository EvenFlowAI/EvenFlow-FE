import React, {useMemo} from 'react';
import {Box, Button, Grid, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {SquarePaper} from "../UI/Paper";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import moment from "moment";
import {TS1Form} from "../../store/reducers/appointment/types";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../config/routes";
import {concatAddress, getCalendarUrl} from "../../utils/utils";

const Paper = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(2),
    borderRadius: 6,
    maxWidth: 520,
    fontSize: 15,
    position: "relative",
    [theme.breakpoints.down("xs")]: {
        margin: theme.spacing(1)
    }
}));
const Highlight = styled("span")(({theme}) => ({
    display: "block",
    height: 16,
    borderRadius: 8,
    opacity: .4,
    width: "106%",
    backgroundColor: theme.palette.primary.main,
    position: "absolute",
    top: -8,
    left: "-3%",
    zIndex: -1,
    [theme.breakpoints.down("xs")]: {
        display: "none"
    }
}));
const Title = styled("h2")(({theme}) => ({
    textAlign: "center",
    margin: `${theme.spacing(1.5)} 0 ${theme.spacing(3)}`,
    textTransform: "uppercase",
    fontSize: 19,
    fontWeight: "bold"
}));
const Label = styled("span")(({theme}) => ({
    textTransform: "uppercase",
    color: theme.palette.text.disabled,
    fontSize: 15,
    fontWeight: "bold"
}));
const Message = styled("div")({
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center"
});
const Divider = styled("div")(({theme}) => ({
    width: "100%",
    height: 2,
    background: `repeating-linear-gradient(to right,
        ${theme.palette.divider} 0,${theme.palette.divider} 10px,
        transparent 10px,
        transparent 20px)`
}));

type TRow = {
    id: number;
    label: string;
    key: keyof TDataMap;
}
type TDataMap = {
    date: string;
    address: string;
    serviceType: string;
    name: string;
    carInfo: string;
    phoneNumber: string;
    email: string;
    total: string;
}
const rows: TRow[] = [
    {id: 1, label: "Date and Time", key: "date"},
    {id: 2, label: "Address", key: "address"},
    {id: 3, label: "Service Type", key: "serviceType"},
    {id: 4, label: "Name", key: "name"},
    {id: 5, label: "Car Info", key: "carInfo"},
    {id: 6, label: "Phone Number", key: "phoneNumber"},
    {id: 7, label: "E-Mail", key: "email"},
    {id: 8, label: "Total", key: "total"},
];
const calendarIds: number[] = [3, 5, 8];
const getCarInfo = (data: TS1Form):string => {
    return `${data.make ?? ""} ${data.model ?? ""} ${data.year ?? ""}`.trim() || "-";
}

export const ConfirmationContent = () => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const appointment = useSelector(({appointment}: RootState) => appointment);
    const data: TDataMap = useMemo(() => ({
        date: moment(appointment.appointment?.date).format("ddd, MMM D, h:mm A"),
        address: appointment.scProfile?.address ? concatAddress(appointment.scProfile.address) : "-",
        serviceType: appointment.selectedSR.map(sId => appointment.serviceRequests.find(s => s.id === sId)?.description || "-").join(", "),
        name: appointment.personalInformation.fullName || "-",
        carInfo: getCarInfo(appointment.s1Data),
        phoneNumber: appointment.personalInformation.phoneNumber || "-",
        email: appointment.personalInformation.email || "-",
        total: appointment.appointment?.price ? `$${
            appointment.appointment.priceWithOffer?.value.toFixed(2) ||
            appointment.appointment.price.value.toFixed(2)
        }` : "-"
    }), [appointment]);

    const history = useHistory();
    const {id} = useParams();

    const handleBack = () => {
        history.push(`${Routes.EndUser.AppointmentBase}/${id ?? ""}`);
    }

    const handleAddToCalendar = () => {
        const url = getCalendarUrl({
            dates: [moment(appointment.appointment?.date).toISOString()],
            text: "Appointment",
            location: appointment.scProfile?.address ? concatAddress(appointment.scProfile.address) : "",
            details: rows.filter(r => calendarIds.includes(r.id)).map(r =>
                `${r.label}: ${data[r.key]}`
            ).join("\n")
        });
        window.open(url);
    }

    return <Paper elevation={8}>
        <Title>Appointment confirmed!</Title>
        <Highlight />
        <Grid container spacing={isXS ? 1 : 2}>
            {rows.map(row => {
                return <React.Fragment key={row.id}>
                    <Grid item xs={12} sm={5}>
                        <Label>{row.label}</Label>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Box textAlign={isXS ? "left" : "right"}
                             mb={isXS ? 1 : 0}>{data[row.key]}</Box>
                    </Grid>
                </React.Fragment>
            })}
            <Grid item xs={12}>
                <Box p={.25} />
            </Grid>
            <Grid item xs={12} sm={6} style={{order: isXS ? 1 : undefined}}>
                <Button fullWidth={isXS} onClick={handleBack} variant="outlined" color="primary">
                    Change Appointment
                </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box textAlign="right">
                    <Button onClick={handleAddToCalendar} fullWidth={isXS} variant="contained" color="primary">
                        Add To Calendar
                    </Button>
                </Box>
            </Grid>
        </Grid>
        <Box my={3}>
            <Divider />
        </Box>
        <Box>
            <Message>We will see you soon !</Message>
        </Box>
    </Paper>
};