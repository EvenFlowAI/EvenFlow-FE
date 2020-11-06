import React from 'react';
import {VehicleDetailsS1} from "./Steps/VehicleDetailsS1";
import {Container, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    container: {
        padding: "40px 0"
    },
    paper: {
        marginLeft: 80,
        padding: 32,
        display: "flex",
        justifyContent: "center",
        "& h4": {
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 16,
            margin: "0 0 22px",
        }
    }
});

export const AppointmentFlow = () => {
    const classes = useStyles();
    return <Container className={classes.container}>
        <Paper className={classes.paper} variant="outlined">
            <VehicleDetailsS1 />
        </Paper>
    </Container>
};