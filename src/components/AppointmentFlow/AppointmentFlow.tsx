import React, {useCallback, useEffect, useRef, useState} from 'react';
import {VehicleDetailsS1} from "./Steps/VehicleDetailsS1";
import {Container, Paper, Step, StepButton, Stepper, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ServiceNeedsS2} from "./Steps/ServiceNeedsS2";
import clsx from "clsx";
import {TStepProps} from "./UI";
import {AppointmentTimingS3} from "./Steps/AppointmentTimingS3";
import {TransportationNeedsS4} from "./Steps/TransportationNeedsS4";
import {AppointmentConfirmationS6} from "./Steps/AppointmentConfirmationS6";
import {AppointmentSelectionS5} from "./Steps/AppointmentSelectionS5";
import {ProgressStepper} from "./ProgressStepper";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointmentReducer, saveAppointmentReducer} from "../../store/reducers/appointment/actions";
import {RootState} from "../../store/rootReducer";


const useStyles = makeStyles(theme => ({
    container: {
        padding: "40px 0",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1)
        }
    },
    paper: {
        minHeight: 0,
        minWidth: 0,
        height: "100%",
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
        },
        [theme.breakpoints.down("xs")]: {
            margin: 0,
            padding: 32
        }
    },
    stepContainer: {
        position: "absolute",
        left: -246,
        top: 0,
        maxHeight: "100%",
        overflow: "hidden auto",
        width: 300,
        background: "transparent",
        "& div[class*='MuiStepConnector-root']": {
            display: "none"
        },
        [theme.breakpoints.down("xs")]: {
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
    mobileStepper: {

    },
    step: {
        marginTop: 8,
        justifyContent: "flex-end",
        "& span[class*='MuiStepLabel-iconContainer']": {
            order: 1,
            padding: "0 0 0 12px",
            "&>svg": {
                color: "#fff",
                fontSize: 60,
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
            fontSize: 14,
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
    },
    {
        id: 3,
        label: "Appointment Timing",
        component: AppointmentTimingS3
    },
    {
        id: 4,
        label: "Transportation Needs",
        component: TransportationNeedsS4
    },
    {
        id: 5,
        label: "Appointment Selection",
        component: AppointmentSelectionS5
    },
    {
        id: 6,
        label: "Appointment Confirmation",
        component: AppointmentConfirmationS6
    }
]

export const AppointmentFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(1);
    const dispatch = useDispatch();
    const isSet = useRef(false);

    const appState = useSelector((state: RootState) => state.appointment);

    const isStepCompleted = useCallback((idx: number): boolean => {
        switch (idx) {
            case 6:
                return Boolean(appState.personalInformation.email);
            case 5:
                return appState.appointment !== null;
            case 4:
                const s4 = appState.transportation;
                return s4 !== null;
            case 3:
                return true;
            case 2:
                return Boolean(appState.selectedSR);
            case 1:
                const s1 = appState.s1Data;
                return Boolean(s1.model && s1.make && s1.year);
            default:
                return false;
        }
    }, [appState]);

    useEffect(() => {
        if (!isSet.current) {
            const load = async () => {
                await dispatch(loadAppointmentReducer());
            }
            load().then(() => {
                for (let i=1; i <= steps.length; i++) {
                    if (!isStepCompleted(i)) {
                        setActiveStep(i);
                        break;
                    }
                }
                isSet.current = true;
            })
        }
    }, [dispatch, isStepCompleted]);

    useEffect(() => {
        if (isSet.current) {
            dispatch(saveAppointmentReducer());
        }
    }, [activeStep, dispatch]);

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const handleStep = (idx: number) => () => {
        for (let i = 1; i < idx; i++) {
            if (!isStepCompleted(i)) return;
        }
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
        const C = steps[activeStep - 1].component;
        return <C next={handleNext} prev={handlePrev} isCompleted={isStepCompleted(activeStep)} />;
    }

    const classes = useStyles();
    return <Container className={classes.container}>
        {isXS ? <ProgressStepper
            steps={steps.length}
            activeStep={activeStep}
            label={steps[activeStep-1]?.label || ""}
            nextLabel={steps[activeStep]?.label}
        /> : null}
        <Paper className={classes.paper} variant="outlined">
            {!isXS ? <Stepper nonLinear className={classes.stepContainer} activeStep={activeStep} orientation="vertical">
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
            </Stepper> : null}
            {getComponent()}
        </Paper>
    </Container>
};