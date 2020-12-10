import React from 'react';
import {Box, Grid, styled} from "@material-ui/core";
import {SquarePaper} from "../UI/Paper";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import moment from "moment";
import {TS1Form} from "../../store/reducers/appointment/types";

const Paper = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(1)
}));
const Title = styled("h2")({
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold"
});
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
    return `${data.make} ${data.model} ${data.year}`.trim();
}

export const ConfirmationContent = () => {
    const data: TDataMap = useSelector(({appointment}: RootState) => ({
        date: moment(appointment.appointment?.date).format("ddd, MMM D, h:mm A"),
        address: "-",
        serviceType: appointment.serviceRequests.find(s => s.id === appointment.selectedSR)?.description || "-",
        name: appointment.personalInformation.fullName,
        carInfo: getCarInfo(appointment.s1Data),
        phoneNumber: appointment.personalInformation.phoneNumber,
        email: appointment.personalInformation.email,
        total: appointment.appointment?.price ? `$${appointment.appointment.price}` : "-"
    }));

    return <Paper variant="outlined">
        <Title>Appointment confirmed!</Title>
        <Grid container spacing={2}>
            {rows.map(row => {
                return <React.Fragment key={row.id}>
                    <Grid item xs={5}>
                        {row.label}
                    </Grid>
                    <Grid item xs={7}>
                        <Box textAlign="right">{data[row.key]}</Box>
                    </Grid>
                </React.Fragment>
            })}
        </Grid>
    </Paper>
};