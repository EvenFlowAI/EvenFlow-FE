import React, {useState} from 'react';
import {VehicleDetailsS1} from "./Steps/VehicleDetailsS1";
import {Container, Paper, Step, StepButton, Stepper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ServiceNeedsS2} from "./Steps/ServiceNeedsS2";
import clsx from "clsx";
import {TStepProps} from "./UI";


const useStyles = makeStyles(theme => ({
    container: {
        padding: "40px 0",
        height: "100vh"
    },
    paper: {
        minHeight: "calc(100% - 64px)",
        marginLeft: "20%",
        marginRight: "10%",
        padding: 32,
        paddingLeft: 64,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        "& h4": {
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 16,
            margin: "0 0 22px",
        }
    },
    stepContainer: {
        position: "absolute",
        left: -178,
        width: 250,
        background: "transparent",
        "& div[class*='MuiStepConnector-root']": {
            display: "none"
        }
    },
    completedStep: {
        "& span[class*='MuiStepLabel-iconContainer']": {
            "&>svg": {
                "& text": {
                    fill: `${theme.palette.primary.main} !important`
                },
                "& circle": {
                    stroke: `${theme.palette.primary.main} !important`,
                }
            }
        },
        "& span[class*='MuiStepLabel-labelContainer'] > span": {
            color: theme.palette.primary.main,
            opacity: .6
        }
    },
    step: {
        marginTop: 12,
        "& span[class*='MuiStepLabel-iconContainer']": {
            order: 1,
            padding: "0 0 0 12px",
            "&>svg": {
                color: "#fff",
                fontSize: 70,
                fontWeight: "bold",
                "& text": {
                    fill: theme.palette.text.hint
                },
                "& circle": {
                    transform: "scale(0.98)",
                    strokeWidth: "0.3px",
                    stroke: theme.palette.text.hint,
                    transformOrigin: "center"
                }
            }
        },
        "& span[class*='MuiStepLabel-labelContainer']>span": {
            fontSize: 16,
            fontWeight: "bold"
        },
        "& span[class*='MuiStepLabel-active']": {
            color: theme.palette.primary.main,
        },
        "& svg[class*='MuiStepIcon-active']": {
            color: `${theme.palette.primary.main} !important`,
            "& text": {
                fill: "#ffffff !important",
            },
            "& circle": {
                transform: "scale(1) !important",
                stroke: "none !important"
            }
        }
    }
}));

type TStep = {
    label: string;
    id: number;
    component: React.FC<TStepProps>
}
const steps: TStep[] = [
    {
        id: 1,
        label: "Vehicle details",
        component: VehicleDetailsS1
    },
    {
        id: 2,
        label: "Service Needs",
        component: ServiceNeedsS2
    }
]

export const AppointmentFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(1);

    const handleStep = (idx: number) => () => {
        setActiveStep(idx);
    }

    const handleNext = () => {
        if (activeStep < steps.length) {
            setActiveStep(activeStep + 1);
        }
    }
    const handlePrev = () => {
        if (activeStep !== 1) {
            setActiveStep(activeStep - 1);
        }
    }

    const getComponent = () => {
        const C = steps[activeStep -1 ].component;
        return <C next={handleNext} prev={handlePrev} />;
    }

    const classes = useStyles();
    return <Container className={classes.container}>
        <Paper className={classes.paper} variant="outlined">
            <Stepper className={classes.stepContainer} activeStep={activeStep} orientation="vertical">
                {steps.map(step => {
                    return <Step key={step.id} completed={false}>
                        <StepButton
                            className={clsx(...[classes.step, activeStep > step.id ? classes.completedStep : undefined])}
                            active={activeStep === step.id}
                            onClick={handleStep(step.id)}>
                            {step.label}
                        </StepButton>
                    </Step>
                })}
            </Stepper>
            {getComponent()}
        </Paper>
    </Container>
};