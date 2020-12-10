import React from 'react';
import {Box, Button, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../UI/Paper";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import moment from "moment";
import {TS1Form} from "../../store/reducers/appointment/types";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../config/routes";
import {concatAddress} from "../../utils/utils";

const Paper = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(2),
    borderRadius: 6,
    maxWidth: 520,
    fontSize: 15,
    position: "relative"
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
    zIndex: -1
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
const getCarInfo = (data: TS1Form):string => {
    return `${data.make ?? ""} ${data.model ?? ""} ${data.year ?? ""}`.trim() || "-";
}

export const ConfirmationContent = () => {
    const data: TDataMap = useSelector(({appointment}: RootState) => ({
        date: moment(appointment.appointment?.date).format("ddd, MMM D, h:mm A"),
        address: appointment.scProfile?.address ? concatAddress(appointment.scProfile.address) : "-",
        serviceType: appointment.serviceRequests.find(s => s.id === appointment.selectedSR)?.description || "-",
        name: appointment.personalInformation.fullName || "-",
        carInfo: getCarInfo(appointment.s1Data),
        phoneNumber: appointment.personalInformation.phoneNumber || "-",
        email: appointment.personalInformation.email || "-",
        total: appointment.appointment?.price ? `$${appointment.appointment.price.toFixed(2)}` : "-"
    }));

    const history = useHistory();
    const {id} = useParams();

    const handleBack = () => {
        history.push(`${Routes.EndUser.AppointmentBase}/${id ?? ""}`);
    }

    return <Paper elevation={8}>
        <Title>Appointment confirmed!</Title>
        <Highlight />
        <Grid container spacing={2}>
            {rows.map(row => {
                return <React.Fragment key={row.id}>
                    <Grid item xs={5}>
                        <Label>{row.label}</Label>
                    </Grid>
                    <Grid item xs={7}>
                        <Box textAlign="right">{data[row.key]}</Box>
                    </Grid>
                </React.Fragment>
            })}
            <Grid item xs={12}>
                <Box p={.25} />
            </Grid>
            <Grid item xs={6}>
                <Button onClick={handleBack} variant="outlined" color="primary">
                    Change Appointment
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Box textAlign="right">
                    <Button variant="contained" color="primary">
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