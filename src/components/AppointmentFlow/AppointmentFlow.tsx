import React, {useState} from 'react';
import {VehicleDetailsS1} from "./Steps/VehicleDetailsS1";
import {Container, Paper, Step, StepButton, StepContent, Stepper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
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
    },
    step: {
        "& span[class*='MuiStepLabel-iconContainer']": {
            order: 1,
            padding: "0 0 0 12px",
            "&>svg": {
                fontSize: 70,
                fontWeight: "bold"
            }
        },
        "& span[class*='MuiStepLabel-labelContainer']>span": {
            fontSize: 16,
            fontWeight: "bold"
        },
        "& span[class*='MuiStepLabel-active']": {
            color: theme.palette.primary.main
        }
    }
}));

type TStep = {
    label: string;
    id: number;
    component: React.ComponentType
}
const steps: TStep[] = [
    {
        id: 1,
        label: "Vehicle details",
        component: VehicleDetailsS1
    }
]

export const AppointmentFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(1);
    const handleStep = (idx: number) => () => {
        setActiveStep(idx);
    }

    const classes = useStyles();
    return <Container className={classes.container}>
        <Paper className={classes.paper} variant="outlined">
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map(step => {
                    return <Step key={step.id}>
                        <StepButton
                            className={classes.step}
                            active={activeStep === step.id}
                            onClick={handleStep(step.id)}
                            completed={step.id < activeStep}>
                            {step.label}
                        </StepButton>
                        <StepContent><step.component /></StepContent>
                    </Step>
                })}
            </Stepper>
        </Paper>
    </Container>
};